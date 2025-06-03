// Importa o Express para criar o roteador
import express from 'express';

// Importa os controladores responsáveis pelas operações dos registros
import {
  criarRegistro,
  listarRegistros,
  buscarRegistroPorId,
  atualizarRegistro,
  deletarRegistro
} from '../controllers/registroController.js';

// Cria um roteador do Express para agrupar rotas relacionadas
const router = express.Router();

// Define a rota POST /registros para criar um novo registro
router.post('/registros', criarRegistro);

// Define a rota GET /registros para listar todos os registros
router.get('/registros', listarRegistros);

// Define a rota GET /registros/:id para buscar um registro específico pelo ID
router.get('/registros/:id', buscarRegistroPorId);

// Define a rota PUT /registros/:id para atualizar um registro pelo ID
router.put('/registros/:id', atualizarRegistro);

// Define a rota DELETE /registros/:id para deletar um registro pelo ID
router.delete('/registros/:id', deletarRegistro);

// Exporta o roteador para ser usado no arquivo principal da aplicação
export default router;
