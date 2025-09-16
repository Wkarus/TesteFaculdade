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
app.post('/api/processar-doacao', async (req, res) => {
  try {
    const resultado = await sistema.processarDoacao(req.body);
    res.json({
      status: 'sucesso',
      message: 'Doação processada com sucesso! 🎉',
      data: resultado
    });
  } catch (error) {
    res.status(500).json({ status: 'erro', message: error.message });
  }
});

app.get('/api/usuarios', async (req, res) => {
  try {
    const usuarios = await sistema.listarUsuarios();
    res.json({ status: 'sucesso', data: usuarios });
  } catch (error) {
    res.status(500).json({ status: 'erro', message: error.message });
  }
});

app.get('/api/campanhas', async (req, res) => {
  try {
    const campanhas = await sistema.listarCampanhas();
    res.json({ status: 'sucesso', data: campanhas });
  } catch (error) {
    res.status(500).json({ status: 'erro', message: error.message });
  }
});

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