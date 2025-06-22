// Importa os hooks do React e o serviço de API para buscar registros
import React, { useEffect, useState } from "react";
import { getRegistros } from "../services/registroService";
import RegistroCard from "../components/RegistroCard";
import NovoRegistroDropdown from "../components/NovoRegistroDropdown";

// Componente principal Registros
function Registros() {
  // Estado para armazenar a lista de registros
  const [registros, setRegistros] = useState([]);
  // Estado para controlar o loading da tela
  const [loading, setLoading] = useState(true);

  // Estado para armazenar o filtro de tipoCliente (Rua/Empresa)
  const [filtroTipoCliente, setFiltroTipoCliente] = useState("todos");

  // Estados para os filtros de data
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  // Estados para os filtros de status e pagamento
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroPago, setFiltroPago] = useState("todos"); // novo filtro de pagamento

  // useEffect que dispara toda vez que algum filtro muda
  useEffect(() => {
    setLoading(true); // Ativa o loading

    const params = new URLSearchParams(); // Cria o objeto para passar os parâmetros na URL

    // Adiciona o filtro de status
    if (filtroStatus !== "todos") {
      params.append("status", filtroStatus);
    }

    // Adiciona o filtro de data início
    if (dataInicio) {
      params.append("dataInicio", dataInicio);
    }

    // Adiciona o filtro de data fim
    if (dataFim) {
      params.append("dataFim", dataFim);
    }

    // Adiciona o filtro de pagamento
    if (filtroPago !== "todos") {
      params.append("pago", filtroPago);
    }

    // Adiciona o filtro de tipoCliente
    if (filtroTipoCliente !== "todos") {
      params.append("tipoCliente", filtroTipoCliente);
    }

    // Chama o serviço getRegistros passando os filtros montados
    getRegistros(params.toString())
      .then((data) => {
        setRegistros(data); // Atualiza a lista de registros
        setLoading(false); // Desativa o loading
        console.log(params.toString()); // Debug: imprime os filtros no console
      })
      .catch((error) => {
        console.error("Erro ao carregar registros:", error);
        setLoading(false); // Desativa o loading
      });
  }, [filtroStatus, dataInicio, dataFim, filtroPago, filtroTipoCliente]); // Dependências do useEffect

  // Renderiza a tela de loading
  if (loading) return <p>Carregando...</p>;

  // Renderiza a tela principal
  return (
    <div className="p-6">
      <div className="flex justify-around gap-10 items-center mb-6 flex-wrap">
        {/* Título da página */}
        <h1 className="text-2xl font-bold w-full md:w-auto">Todos registros</h1>

        {/* Filtros */}
        <div className="flex gap-4 items-center flex-wrap">
          {/* Filtro de Status */}
          <div>
            <label className="text-2xl font-semibold px-5">Status:</label>
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="border rounded-xl px-2 py-1 font-medium"
            >
              <option value="todos">Todos</option>
              <option value="ativos">Ativos</option>
              <option value="inativos">Inativos</option>
            </select>
          </div>

          {/* Filtro de Tipo Cliente */}
          <div>
            <label className="text-2xl font-semibold px-5">Tipo Cliente:</label>
            <select
              value={filtroTipoCliente}
              onChange={(e) => setFiltroTipoCliente(e.target.value)}
              className="border rounded-xl px-2 py-1 font-medium"
            >
              <option value="todos">Todos</option>
              <option value="RUA">Rua</option>
              <option value="EMPRESA">Empresa</option>
            </select>
          </div>

          {/* Filtro de Data Início */}
          <div>
            <label className="text-lg font-semibold px-2">Data Início:</label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>

          {/* Filtro de Data Fim */}
          <div>
            <label className="text-lg font-semibold px-2">Data Fim:</label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>

          {/* Filtro de Pagamento */}
          <div>
            <label className="text-2xl font-semibold px-5">Pagamento:</label>
            <select
              value={filtroPago}
              onChange={(e) => setFiltroPago(e.target.value)}
              className="border rounded-xl px-2 py-1 font-medium"
            >
              <option value="todos">Todos</option>
              <option value="pagos">Pagos</option>
              <option value="nao_pagos">Não Pagos</option>
            </select>
          </div>

          {/* Botão de limpar filtros */}
          <button
            onClick={() => {
              setFiltroStatus("todos");
              setFiltroPago("todos");
              setDataInicio("");
              setDataFim("");
              setFiltroTipoCliente("todos");
            }}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
          >
            Limpar Filtros
          </button>
        </div>

        {/* Componente para adicionar novos registros */}
        <NovoRegistroDropdown />
      </div>

      {/* Tabela de registros */}
      {registros.length === 0 ? (
        // Se não houver registros, exibe uma mensagem
        <p>Nenhum registro encontrado para os filtros selecionados.</p>
      ) : (
        // Renderiza a tabela de registros
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Placa</th>
                <th className="px-4 py-2 text-left">Modelo</th>
                <th className="px-4 py-2 text-left">Tipo</th>
                <th className="px-4 py-2 text-left">Serviço</th>
                <th className="px-4 py-2 text-left">Valor</th>
                <th className="px-4 py-2 text-left">Pago</th>
                <th className="px-4 py-2 text-left">Data</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {/* Mapeia os registros para exibir cada linha da tabela */}
              {registros.map((registro) => (
                <RegistroCard key={registro.id} registro={registro} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Exporta o componente
export default Registros;
