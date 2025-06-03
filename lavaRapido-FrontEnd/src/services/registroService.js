// Importa a biblioteca axios para fazer requisições HTTP
import axios from "axios";

// Define a URL base da API que será usada nas requisições
const API_URL = "http://localhost:3000/api/registros";

// Função para buscar todos os registros
export async function getRegistros() {
  try {
    // Faz uma requisição GET para a URL base da API
    const response = await axios.get(API_URL);
    // Retorna os dados da resposta
    return response.data;
  } catch (error) {
    // Exibe o erro no console, caso ocorra
    console.error("Erro ao buscar registros:", error);
    // Lança o erro para que o componente que chamou possa tratá-lo
    throw error;
  }
}

// Função para buscar um registro específico por ID
export async function getRegistroPorId(id) {
  try {
    // Faz uma requisição GET para a URL base + o ID do registro
    const response = await axios.get(`${API_URL}/${id}`);
    // Retorna os dados da resposta
    return response.data;
  } catch (error) {
    // Exibe o erro no console, caso ocorra
    console.error("Erro ao buscar registro por ID:", error);
    // Lança o erro para que o componente que chamou possa tratá-lo
    throw error;
  }
}

// Função para criar um novo registro
export async function criarRegistro(registro) {
  try {
    // Faz uma requisição POST para a URL base da API com os dados do novo registro
    const response = await axios.post(API_URL, registro);
    // Retorna os dados da resposta
    return response.data;
  } catch (error) {
    // Exibe o erro no console, caso ocorra
    console.error("Erro ao criar registro:", error);
    // Lança o erro para que o componente que chamou possa tratá-lo
    throw error;
  }
}

export async function atualizarRegistro(id, dadosAtualizados) {
  try {
    const response = await axios.put(`${API_URL}/${id}`, dadosAtualizados);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar registro:", error);
    throw error;
  }
}
