// Importa o axios, uma biblioteca para realizar requisições HTTP
import axios from "axios";

// Define a URL base da API de registros
const API_URL = "http://localhost:3000/api/registros";

// Função para buscar todos os registros (usando fetch)
export const getRegistros = async (query = "") => {
  // Se houver uma query string, adiciona à URL; caso contrário, usa apenas a base
  const url = query ? `${API_URL}?${query}` : API_URL;

  // Faz a requisição GET usando fetch
  const response = await fetch(url);

  // Verifica se a resposta foi bem-sucedida (status 200–299)
  if (!response.ok) throw new Error("Erro ao buscar registros");

  // Converte a resposta em JSON
  return response.json();
};

// Função para buscar um registro por ID (usando axios)
export async function getRegistroPorId(id) {
  try {
    // Faz a requisição GET usando axios para o endpoint de ID
    const response = await axios.get(`${API_URL}/${id}`);
    // Retorna os dados da resposta
    return response.data;
  } catch (error) {
    // Exibe o erro no console
    console.error("Erro ao buscar registro por ID:", error);
    // Lança o erro para o componente que chamou
    throw error;
  }
}

// Função para criar um novo registro (usando axios)
export async function criarRegistro(registro) {
  try {
    // Faz a requisição POST para a URL base com os dados do novo registro
    const response = await axios.post(API_URL, registro);
    // Retorna os dados da resposta
    return response.data;
  } catch (error) {
    // Exibe o erro no console
    console.error("Erro ao criar registro:", error);
    // Lança o erro para o componente que chamou
    throw error;
  }
}

// Função para atualizar um registro existente (usando axios)
export async function atualizarRegistro(id, dadosAtualizados) {
  try {
    // Faz a requisição PUT para o endpoint de ID com os dados atualizados
    const response = await axios.put(`${API_URL}/${id}`, dadosAtualizados);
    // Retorna os dados da resposta
    return response.data;
  } catch (error) {
    // Exibe o erro no console
    console.error("Erro ao atualizar registro:", error);
    // Lança o erro para o componente que chamou
    throw error;
  }
}
