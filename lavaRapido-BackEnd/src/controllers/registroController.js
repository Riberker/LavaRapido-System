// Importa o PrismaClient para fazer operações no banco de dados
import { PrismaClient } from "@prisma/client";

// Cria uma instância do PrismaClient para usar nas funções
const prisma = new PrismaClient();

/**
 * Função auxiliar que formata a propriedade dataHora de um registro
 * para o formato de data e hora brasileiro (BRT) usando toLocaleString
 * com o timezone de São Paulo (America/Sao_Paulo).
 * Recebe um objeto registro e retorna uma cópia dele com dataHora formatada.
 */
const formatarDataBRT = (registro) => {
  return {
    ...registro, // mantém todas as outras propriedades do registro
    dataHora: registro.dataHora.toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    }), // formata a dataHora
  };
};

/**
 * Controlador para criar um novo registro no banco de dados.
 * Recebe os dados no corpo da requisição (req.body).
 * Retorna o registro criado com status 201.
 */
// Função para lidar com a criação de um novo registro
export const criarRegistro = async (req, res) => {
  try {
    // Extrai os dados enviados no corpo da requisição
    const { placa, modelo, tipoCliente, descricao, valor, pago } = req.body;

    // Define os serviços válidos e seus respectivos valores obrigatórios
    const servicosValidos = {
      LAVAGEM_SIMPLES: 50,
      LAVAGEM_SIMPLES_CERA: 55,
      LAVAGEM_SIMPLES_POR_BAIXO: 100,
      LAVAGEM_COMPLETA_MOTOR: 150,
    };

    // Verifica se o serviço enviado está dentro dos serviços válidos
    if (!servicosValidos[descricao]) {
      return res.status(400).json({ erro: "Serviço inválido." });
    }

    // Verifica se o valor enviado é igual ao valor fixo do serviço
    if (valor !== servicosValidos[descricao]) {
      return res.status(400).json({
        erro: `Valor incorreto para o serviço ${descricao}. O valor correto é R$ ${servicosValidos[descricao]}`,
      });
    }

    // Cria um novo registro no banco de dados
    const novoRegistro = await prisma.registro.create({
      data: {
        placa,
        modelo,
        tipoCliente,
        descricao,
        valor,
        pago,
        dataHora: new Date(), // Captura a data/hora atual
      },
    });

    // Retorna o registro criado com status 201 (criado)
    res.status(201).json(novoRegistro);
  } catch (err) {
    // Em caso de erro, registra no console e retorna erro 500
    console.error("Erro ao criar registro:", err);
    res
      .status(500)
      .json({ erro: "Erro ao registrar o serviço.", detalhe: err.message });
  }
};

/**
 * Controlador para listar todos os registros do banco.
 * Ordena os registros pela dataHora em ordem decrescente.
 * Retorna um array de registros com a dataHora formatada para BRT.
 */
export const listarRegistros = async (req, res) => {
  try {
    const { dataInicio, dataFim, status, pago, tipoCliente } = req.query;

    // Monta o filtro para a consulta Prisma
    const where = {};

    if (tipoCliente && tipoCliente !== "todos") {
      where.tipoCliente = tipoCliente;
    }

    // Filtro de dataHora
    if (dataInicio || dataFim) {
      where.dataHora = {};
      if (dataInicio) {
        // Ajusta para o início do dia em São Paulo
        const inicio = new Date(`${dataInicio}T00:00:00-03:00`);
        where.dataHora.gte = inicio;
      }
      if (dataFim) {
        // Ajusta para o final do dia em São Paulo
        const fim = new Date(`${dataFim}T23:59:59-03:00`);
        where.dataHora.lte = fim;
      }
    }

    // Filtro de status (campo ativo: true/false)
    if (status && status !== "todos") {
      where.ativo = status === "ativos";
    }

    // Filtro de pago (campo pago: true/false)
    if (pago && pago !== "todos") {
      if (pago === "pagos") where.pago = true;
      if (pago === "nao_pagos") where.pago = false;
    }

    // Busca registros com os filtros aplicados
    const registros = await prisma.registro.findMany({
      where,
      orderBy: { dataHora: "desc" },
    });

    const registrosFormatados = registros.map(formatarDataBRT);

    res.status(200).json(registrosFormatados);
  } catch (err) {
    console.error("Erro no listarRegistros:", err);
    res
      .status(500)
      .json({ erro: "Erro ao listar registros.", detalhe: err.message });
  }
};

/**
 * Controlador para buscar um registro específico pelo ID.
 * Se não encontrar, retorna erro 404.
 * Se encontrar, retorna o registro com a dataHora formatada para BRT.
 */
export const buscarRegistroPorId = async (req, res) => {
  try {
    const { id } = req.params;

    // Busca o registro pelo ID (convertido para inteiro)
    const registro = await prisma.registro.findUnique({
      where: { id: parseInt(id) },
    });

    // Se não encontrou, retorna 404
    if (!registro) {
      return res.status(404).json({ erro: "Registro não encontrado." });
    }

    // Retorna o registro formatado
    res.status(200).json(formatarDataBRT(registro));
  } catch (err) {
    // Erro na busca retorna 500
    console.error("Erro no buscarRegistroPorId:", err);
    res
      .status(500)
      .json({ erro: "Erro ao buscar registro.", detalhe: err.message });
  }
};

/**
 * Controlador para atualizar um registro pelo ID.
 * Recebe os dados para atualização no corpo da requisição.
 * Se registro não existir, retorna erro 404.
 * Retorna o registro atualizado com dataHora formatada.
 */
export const atualizarRegistro = async (req, res) => {
  try {
    const { id } = req.params;
    const { placa, modelo, tipoCliente, descricao, valor, pago, ativo } =
      req.body;

    // Atualiza o registro no banco
    const registroAtualizado = await prisma.registro.update({
      where: { id: parseInt(id) },
      data: { placa, modelo, tipoCliente, descricao, valor, pago, ativo },
    });

    // Retorna o registro atualizado formatado
    res.status(200).json(formatarDataBRT(registroAtualizado));
  } catch (err) {
    // Caso o registro não exista (código de erro P2025), retorna 404
    if (err.code === "P2025") {
      return res
        .status(404)
        .json({ erro: "Registro não encontrado para atualizar." });
    }

    // Outros erros retornam 500
    console.error("Erro no atualizarRegistro:", err);
    res
      .status(500)
      .json({ erro: "Erro ao atualizar registro.", detalhe: err.message });
  }
};

/**
 * Controlador para deletar um registro pelo ID.
 * Se registro não existir, retorna 404.
 * Retorna mensagem de sucesso se deletado.
 * Não retorna registro, portanto sem necessidade de formatação da data.
 */
export const deletarRegistro = async (req, res) => {
  try {
    const { id } = req.params;

    // Deleta o registro no banco
    await prisma.registro.delete({
      where: { id: parseInt(id) },
    });

    // Retorna mensagem de sucesso
    res.status(200).json({ mensagem: "Registro deletado com sucesso." });
  } catch (err) {
    // Se não encontrado retorna 404
    if (err.code === "P2025") {
      return res
        .status(404)
        .json({ erro: "Registro não encontrado para deletar." });
    }

    // Outros erros retornam 500
    console.error("Erro no deletarRegistro:", err);
    res
      .status(500)
      .json({ erro: "Erro ao deletar registro.", detalhe: err.message });
  }
};
