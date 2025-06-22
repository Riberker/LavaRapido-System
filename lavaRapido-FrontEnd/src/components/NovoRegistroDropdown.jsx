// Importa o React e os hooks necessários
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Componente funcional
function NovoRegistroDropdown() {
  // Estado para controlar se o dropdown está aberto ou fechado
  const [open, setOpen] = useState(false);

  // Hook para navegação programática
  const navigate = useNavigate();

  // Referência para detectar clique fora do dropdown
  const dropdownRef = useRef(null);

  // Hook de efeito para lidar com clique fora do dropdown
  useEffect(() => {
    // Função que verifica se o clique foi fora do dropdown
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false); // Fecha o dropdown se clicar fora
      }
    }

    // Adiciona o evento de clique ao documento
    document.addEventListener("mousedown", handleClickOutside);

    // Remove o evento de clique ao desmontar o componente
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Função chamada ao selecionar uma opção
  function handleSelect(tipo) {
    setOpen(false); // Fecha o dropdown
    // Navega para a rota de novo registro com parâmetro de cliente
    navigate(`/novo-registro?cliente=${tipo}`);
  }

  return (
    // Container principal do dropdown
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Botão que abre/fecha o dropdown */}
      <button
        onClick={() => setOpen(!open)}
        className="inline-block px-4 py-2 font-bold bg-blue-900 text-white rounded hover:bg-blue-600 transition focus:outline-none"
      >
        Novo Registro
        {/* Ícone de seta */}
        <svg
          className="inline-block ml-2 w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Renderiza o dropdown apenas se estiver aberto */}
      {open && (
        <div className="absolute mt-1 right-0 w-40 bg-white border border-gray-300 rounded shadow-md z-10">
          {/* Opção para Cliente Rua */}
          <button
            onClick={() => handleSelect("RUA")}
            className="block w-full text-left font-medium rounded px-4 py-2 hover:bg-blue-600 hover:border-black hover:border-1 hover:text-white transition duration-300"
          >
            Cliente Rua
          </button>
          {/* Opção para Cliente Empresa */}
          <button
            onClick={() => handleSelect("EMPRESA")}
            className="block w-full text-left font-medium rounded px-4 py-2 hover:bg-blue-600 hover:border-black hover:border-1 hover:text-white transition duration-300"
          >
            Cliente Empresa
          </button>
        </div>
      )}
    </div>
  );
}

// Exporta o componente para uso em outras partes do app
export default NovoRegistroDropdown;
