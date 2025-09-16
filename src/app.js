// Importações necessárias para o projeto
const express = require('express'); // Framework web para Node.js
const cors = require('cors'); // Permite requisições de outros domínios
const helmet = require('helmet'); // Adiciona segurança nas requisições HTTP
const db = require('./database/database'); // Conexão com banco SQLite

// Importar a classe principal do sistema ONG
// Esta é a classe que vai orquestrar todas as operações do sistema
const SistemaService = require('./services/SistemaService');

const app = express(); // Cria a aplicação Express
const PORT = process.env.PORT || 3000; // Porta do servidor (Vercel usa variável de ambiente)

// Configuração dos middlewares - sempre vem antes das rotas!
app.use(helmet()); // Adiciona headers de segurança automaticamente
app.use(cors()); // Permite que frontend acesse nossa API
app.use(express.json()); // Converte JSON das requisições em objetos JavaScript

// Instanciar a classe principal - aqui criamos o objeto que vai gerenciar tudo
const sistema = new SistemaService();

// Rota raiz - mostra informações sobre a API
// Útil para documentar quais endpoints estão disponíveis
app.get('/', (req, res) => {
    res.json({ 
        message: 'API ONG funcionando!',
        endpoints: [
            'GET /api/usuarios - Listar usuários',
            'GET /api/campanhas - Listar campanhas', 
            'GET /api/doacoes - Listar doações',
            'GET /api/noticias - Listar notícias',
            'POST /api/processar-doacao - CLASSE PRINCIPAL'
        ]
    });
});

// Rota GET para usuários
// Aqui usamos SQL direto porque são operações simples de listagem
app.get('/api/usuarios', (req, res) => {
    // db.all executa SELECT e retorna todos os resultados
    db.all("SELECT * FROM Usuario", (err, usuarios) => {
        if (err) {
            // Se der erro no banco, retorna status 500 (erro interno)
            res.status(500).json({ error: err.message });
        } else {
            // Se deu certo, retorna os dados com status 200 (padrão)
            res.json({ success: true, data: usuarios });
        }
    });
});

// Rota GET para campanhas
// Mesmo padrão da rota de usuários - busca tudo da tabela
app.get('/api/campanhas', (req, res) => {
    db.all("SELECT * FROM Campanha", (err, campanhas) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ success: true, data: campanhas });
        }
    });
});

// Rota GET para doações
// Lista todas as doações já processadas no sistema
app.get('/api/doacoes', (req, res) => {
    db.all("SELECT * FROM Doacao", (err, doacoes) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ success: true, data: doacoes });
        }
    });
});

// Rota GET para notícias
// Busca todas as notícias cadastradas pela ONG
app.get('/api/noticias', (req, res) => {
    db.all("SELECT * FROM Noticias", (err, noticias) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ success: true, data: noticias });
        }
    });
});

// ESTA É A ROTA MAIS IMPORTANTE - USA A CLASSE PRINCIPAL!
// Aqui demonstramos o uso da programação orientada a objetos
app.post('/api/processar-doacao', async (req, res) => {
    try {
        // req.body contém os dados JSON enviados pelo cliente
        // Passamos esses dados para o método da nossa classe principal
        const resultado = await sistema.processarDoacao(req.body);
        
        // Se chegou até aqui, deu tudo certo
        res.json({
            status: 'sucesso',
            message: 'Doação processada com sucesso!',
            data: resultado // Retorna os dados da doação criada
        });
    } catch (error) {
        // Se algo deu errado na classe principal, capturamos o erro aqui
        // É importante sempre tratar erros em operações async/await
        res.status(500).json({ 
            status: 'erro', 
            message: error.message // Mostra a mensagem de erro específica
        });
    }
});

// Middleware de 404 - captura rotas que não existem
// IMPORTANTE: sempre colocar por último, depois de todas as rotas!
app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

// Configuração do servidor para desenvolvimento local
// Em produção (Vercel), isso não executa porque NODE_ENV é 'production'
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Servidor ONG rodando na porta ${PORT}`);
        console.log(`Acesse: http://localhost:${PORT}`);
        console.log('Para testar: use Postman ou curl');
    });
}

// Exporta o app para o Vercel conseguir usar
// Em ambiente serverless, não usamos app.listen()
module.exports = app;