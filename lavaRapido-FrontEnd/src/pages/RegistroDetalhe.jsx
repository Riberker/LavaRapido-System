// Importa o React e hooks necessários do React e do React Router
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// Importa funções de serviço para buscar e atualizar o registro
import {
  getRegistroPorId,
  atualizarRegistro,
} from "../services/registroService";
import { useParams } from "react-router-dom";

// Mapeia os preços dos serviços de lavagem
const precosPorServico = {
  LAVAGEM_SIMPLES: 50,
  LAVAGEM_SIMPLES_CERA: 55,
  LAVAGEM_SIMPLES_POR_BAIXO: 100,
  LAVAGEM_COMPLETA_MOTOR: 150,
};

// Componente funcional principal
function RegistroDetalhe() {
  // Recupera o ID do registro da URL
  const { id } = useParams();
  const navigate = useNavigate();

  // Estados para controlar carregamento e salvamento
  const [registro, setRegistro] = useState(null); // Dados originais do registro
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [salvando, setSalvando] = useState(false); // Estado de salvamento

  // Estado para o formulário (valores editáveis)
  const [form, setForm] = useState({
    placa: "",
    modelo: "",
    descricao: "",
    pago: false,
    ativo: true,
  });

  // Efeito para buscar os dados do registro ao carregar a página
  useEffect(() => {
    getRegistroPorId(id) // Busca registro por ID
      .then((data) => {
        setRegistro(data); // Armazena dados no estado
        setForm({
          placa: data.placa || "",
          modelo: data.modelo || "",
          descricao: data.descricao || "",
          pago: data.pago || false,
          ativo: data.ativo !== undefined ? data.ativo : true,
        });
        setLoading(false); // Finaliza o carregamento
      })
      .catch((error) => {
        console.error("Erro ao carregar registro:", error);
        setLoading(false); // Finaliza o carregamento mesmo em caso de erro
      });
  }, [id]); // Executa toda vez que o ID mudar

  // Função para atualizar os campos do formulário
  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    if (name === "descricao") {
      // Se o campo alterado for a descrição, atualiza também o valor
      const novoValor = precosPorServico[value] || 0;
      setForm((prev) => ({
        ...prev,
        descricao: value,
        valor: novoValor,
      }));
    } else {
      // Para outros campos, atualiza normalmente (checkbox usa checked)
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  }

  // Função para salvar as alterações
  async function handleSalvar() {
    setSalvando(true); // Inicia salvamento
    try {
      await atualizarRegistro(id, form); // Envia dados atualizados
      alert("Registro atualizado com sucesso!");
      navigate("/"); // Volta para a tela inicial após salvar
    } catch (error) {
      console.error("Erro ao salvar registro:", error);
      alert("Erro ao salvar registro.");
    }
    setSalvando(false); // Finaliza salvamento
  }

  // Função para ativar/inativar o registro
  async function toggleAtivo() {
    setSalvando(true); // Inicia processo de ativação/inativação
    try {
      // Atualiza o campo ativo (inverte o estado atual)
      await atualizarRegistro(id, { ...form, ativo: !form.ativo });
      // Atualiza o estado do formulário local
      setForm((prev) => ({ ...prev, ativo: !prev.ativo }));
      // Exibe mensagem ao usuário
      alert(form.ativo ? "Registro inativado." : "Registro ativado.");
      navigate("/"); // Volta para a lista
    } catch (error) {
      console.error("Erro ao alterar status do registro:", error);
      alert("Erro ao alterar status do registro.");
    }
    setSalvando(false); // Finaliza processo
  }

  // Renderiza mensagens de carregamento ou registro não encontrado
  if (loading) return <p>Carregando...</p>;
  if (!registro) return <p>Registro não encontrado.</p>;

  // Renderiza o formulário de edição
  return (
    <div className="p-6 max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Editar Registro</h1>
        <Link
          to="/"
          className="inline-block px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          Voltar
        </Link>
      </div>

      <div className="border p-6 rounded shadow space-y-4">
        {/* Campo de Placa */}
        <div>
          <label className="block font-semibold mb-1">Placa:</label>
          <input
            type="text"
            name="placa"
            value={form.placa}
            onChange={handleChange}
            maxLength={7} // Limita a 7 caracteres
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Campo de Modelo */}
        <div>
          <label className="block font-semibold mb-1">Modelo:</label>
          <input
            type="text"
            name="modelo"
            value={form.modelo}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Campo de Serviço */}
        <div>
          <label className="block font-semibold mb-1">Serviço:</label>
          <select
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">-- Selecione um serviço --</option>
            <option value="LAVAGEM_SIMPLES">LAVAGEM_SIMPLES</option>
            <option value="LAVAGEM_SIMPLES_CERA">LAVAGEM_SIMPLES_CERA</option>
            <option value="LAVAGEM_SIMPLES_POR_BAIXO">
              LAVAGEM_SIMPLES_POR_BAIXO
            </option>
            <option value="LAVAGEM_COMPLETA_MOTOR">
              LAVAGEM_COMPLETA_MOTOR
            </option>
          </select>
        </div>

        {/* Checkbox Pago */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="pago"
            checked={form.pago}
            onChange={handleChange}
            id="pago"
          />
          <label htmlFor="pago" className="font-semibold">
            Pago
          </label>
        </div>

        {/* Botão para ativar/inativar o registro */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleAtivo}
            disabled={salvando}
            className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            {form.ativo ? "Inativar Registro" : "Ativar Registro"}
          </button>
        </div>

        {/* Botão para salvar alterações */}
        <button
          onClick={handleSalvar}
          disabled={salvando}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {salvando ? "Salvando..." : "Salvar Alterações"}
        </button>
      </div>
    </div>
  );
}

// Exporta o componente para uso em outras partes do app
export default RegistroDetalhe;
