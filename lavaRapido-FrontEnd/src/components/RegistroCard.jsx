import React from "react";
import { Link } from "react-router-dom";

function RegistroCard({ registro }) {
  return (
    <div className="p-4 border rounded shadow mb-2">
      <p>
        <strong> Placa: </strong> {registro.placa}
      </p>

      <p>
        <strong> Modelo: </strong> {registro.modelo}
      </p>

      <p>
        <strong> Serviço: </strong> {registro.descricao}
      </p>

      <p>
        <strong> Valor: </strong> R$ {registro.valor}
      </p>

      <p>
        <strong> Pago: </strong> {registro.pago ? "Sim" : "Não"}
      </p>

      <p>
        <strong> Data: </strong>{" "}
        {new Date(registro.dataHora).toLocaleString("pt-BR")}
      </p>

      <p>
        <strong>Status: </strong> {registro.ativo ? "Ativo" : "Inativo"}
      </p>

      <Link
        to={`/registro/${registro.id}`}
        className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Ver / Editar Registro
      </Link>
    </div>
  );
}

export default RegistroCard;
