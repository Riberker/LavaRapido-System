// Importa o framework Express para criar o servidor HTTP
import express from 'express';
import cors from 'cors';

// Importa as rotas definidas para o recurso "registro"
import registroRoutes from './routes/registroRoutes.js';

// Cria uma instância da aplicação Express
const app = express();

// Middleware que habilita o Express para interpretar requisições com JSON no corpo
app.use(express.json());
app.use(cors());

// Define o uso das rotas de registro, prefixadas com "/api"
// Ou seja, todas as rotas definidas em registroRoutes estarão acessíveis via "/api/..."
app.use('/api', registroRoutes);

// Rota raiz ("/") simples que retorna "Hello World!" para requisições GET
app.get('/', (req, res) => {
  res.send("Hello World!");
});

// Faz o servidor escutar requisições na porta 3000
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
