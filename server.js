const express = require('express');
const cors = require('cors');
require('dotenv').config();

// importar a classe principal do sistema
const SistemaService = require('./src/services/SistemaService');

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(cors());
app.use(express.json());

// criar instancia da classe principal
const sistema = new SistemaService();

// rota principal
app.get('/', (req, res) => {
  res.json({
    message: 'API ONG funcionando! PORRAAAAAAAAAAAAAAAAAAAAA',
    endpoints: [
      'GET / - Esta página',
      'POST /api/processar-doacao - Processar doação',
      'GET /api/usuarios - Listar usuários',
      'GET /api/campanhas - Listar campanhas',
      'GET /api/doacoes - Listar doações'
    ]
  });
});

// rotas usando a classe principal
// Rota POST para processar doações através da classe principal do sistema
// Recebe dados da doação via body vimos isso hj dia 9/16
app.post('/api/processar-doacao', async (req, res) => {
  try {
    const resultado = await sistema.processarDoacao(req.body);
    //RETORNA MENSAGEM DE SUCESSO
    res.json({
      status: 'sucesso',
      message: 'Doação processada com sucesso! 🎉',
      data: resultado
    });
  } catch (error) {
    res.status(500).json({ status: 'erro', message: error.message });
  }
});
// Rota para listar todas os usuarios cadastrados na ONG
app.get('/api/usuarios', async (req, res) => {
  try {
    const usuarios = await sistema.listarUsuarios();
    res.json({ status: 'sucesso', data: usuarios });
  } catch (error) {
    res.status(500).json({ status: 'erro', message: error.message });
  }
});
// Rota para listar todas as campanhas da ONG
app.get('/api/campanhas', async (req, res) => {
  try {
    const campanhas = await sistema.listarCampanhas();
    res.json({ status: 'sucesso', data: campanhas });
  } catch (error) {
    res.status(500).json({ status: 'erro', message: error.message });
  }
});

// Rota para listar todas as notícias da ONG
app.get('/api/noticias', async (req, res) => {
  try {
    const noticias = await sistema.listarNoticias();
    res.json({ status: 'sucesso', data: noticias });
  } catch (error) {
    res.status(500).json({ status: 'erro', message: error.message });
  }
});

// Rota para listar as doacoes da ONG
app.get('/api/doacoes', async (req, res) => {
  try {
    const doacoes = await sistema.listarDoacoes();
    res.json({ status: 'sucesso', data: doacoes });
  } catch (error) {
    res.status(500).json({ status: 'erro', message: error.message });
  }
});

// iniciar servidor
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

module.exports = app;