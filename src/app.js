const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const db = require('./database/database');

// ✅ IMPORTAR SUA CLASSE PRINCIPAL

const SistemaService = require('./services/SistemaService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rota principal
app.get('/', (req, res) => {
    res.json({ 
        message: '🎉 API ONG funcionando!',
        endpoints: [
            'GET /api/usuarios - Listar usuários',
            'GET /api/campanhas - Listar campanhas',
            'GET /api/doacoes - Listar doações',
            'POST /api/processar-doacao - CLASSE PRINCIPAL'
        ]
    });
});

// Usuários
app.get('/api/usuarios', (req, res) => {
    db.all("SELECT * FROM Usuario", (err, usuarios) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ success: true, data: usuarios });
        }
    });
});

// Campanhas
app.get('/api/campanhas', (req, res) => {
    db.all("SELECT * FROM Campanha", (err, campanhas) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ success: true, data: campanhas });
        }
    });
});

// Doações
app.get('/api/doacoes', (req, res) => {
    db.all("SELECT * FROM Doacao", (err, doacoes) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ success: true, data: doacoes });
        }
    });
});

// ===== CLASSE PRINCIPAL =====
app.post('/api/processar-doacao', async (req, res) => {
    try {
        const resultado = await SistemaService.processarDoacaoCompleta(req.body);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ 
            status: 'erro', 
            message: 'Erro interno' 
        });
    }
});

// 404
app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor na porta ${PORT}`);
});

module.exports = app;