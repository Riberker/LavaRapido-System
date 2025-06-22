// Importa o React e o Link do react-router-dom para navegação de página
import React from "react";
import { Link } from "react-router-dom";

// Componente RegistroCard que recebe um único registro como props
function RegistroCard({ registro }) {
  return (
    // Cada registro é renderizado como uma linha da tabela
    <tr className="border-b hover:bg-gray-100">
      {/* Placa do veículo */}
      <td className="px-4 py-2 font-medium">{registro.placa}</td>

      {/* Modelo do veículo */}
      <td className="px-4 py-2 font-medium">{registro.modelo}</td>

      {/* Tipo do cliente (Rua ou Empresa) */}
      <td className="px-4 py-2 font-medium">{registro.tipoCliente}</td>

      {/* Descrição do serviço */}
      <td className="px-4 py-2 font-medium">{registro.descricao}</td>

      {/* Valor formatado em reais */}
      <td className="px-4 py-2 font-medium">
        R$ {registro.valor}
      </td>

      {/* Campo de pagamento */}
      <td className="px-4 py-2 font-medium">
        {registro.pago ? "Sim" : "Não"}
      </td>

      {/* Data formatada para o padrão brasileiro */}
      <td className="px-4 py-2 font-medium">
        {new Date(registro.dataHora).toLocaleDateString("pt-BR")}
      </td>

      {/* Status: ativo ou inativo */}
      <td className="px-4 py-2 font-medium">
        {registro.ativo ? "Ativo" : "Inativo"}
      </td>

      {/* Botão/link para abrir a tela de detalhes ou edição */}
      <td className="px-4 py-2 font-medium">
        <Link
          to={`/registro/${registro.id}`}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
        >
          Ver / Editar
        </Link>
      </td>
    </tr>
  );
}

// Exporta o componente
export default RegistroCard;
