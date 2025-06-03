import React, { useEffect, useState } from "react";
import { getRegistros } from "../services/registroService";
import RegistroCard from "../components/RegistroCard";
import { Link } from "react-router-dom";

function Registros() {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [dataFiltro, setDataFiltro] = useState("");

  useEffect(() => {
    getRegistros()
      .then((data) => {
        setRegistros(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao carregar registros:", error);
        setLoading(false);
      });
  }, []);

  // Filtra os registros conforme status e data selecionados
  const registrosFiltrados = registros.filter((registro) => {
    // Filtrar por status
    if (filtroStatus === "ativos" && !registro.ativo) return false;
    if (filtroStatus === "inativos" && registro.ativo) return false;

    // Filtrar por data
    if (dataFiltro) {
      // Pega só a parte da data do registro (YYYY-MM-DD)
      const dataRegistroISO = registro.dataHora.split("T")[0];
      if (dataRegistroISO !== dataFiltro) return false;
    }

    return true;
  });

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between gap-10 items-center mb-6">
        <h1 className="text-2xl font-bold">Registros</h1>
        <Link
          to="/novo-registro"
          className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Novo Registro
        </Link>
      </div>

      <div className="flex gap-4 mb-6 items-end flex-wrap">
        <div>
          <label className="block font-semibold mb-1">Status:</label>
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="todos">Todos</option>
            <option value="ativos">Ativos</option>
            <option value="inativos">Inativos</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Data:</label>
          <input
            type="date"
            value={dataFiltro}
            onChange={(e) => setDataFiltro(e.target.value)}
            className="border rounded px-3 py-2"
          />
        </div>

        <button
          onClick={() => {
            setFiltroStatus("todos");
            setDataFiltro("");
          }}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
        >
          Limpar Filtros
        </button>
      </div>

      {registrosFiltrados.length === 0 ? (
        <p>Nenhum registro encontrado para os filtros selecionados.</p>
      ) : (
        registrosFiltrados.map((registro) => (
          <RegistroCard key={registro.id} registro={registro} />
        ))
      )}
    </div>
  );
}

export default Registros;
