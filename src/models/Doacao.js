// src/models/Doacao.js
const db = require('../database/database');

class Doacao {
    // Função para validar se os dados obrigatórios foram preenchidos
    static validar(dados) {
        const erros = [];
        
        // Verifica se o cliente foi informado
        if (!dados.cd_cliente) erros.push('Cliente é obrigatório');
        
        // Verifica se a campanha foi informada
        if (!dados.cd_campanha) erros.push('Campanha é obrigatória');
        
        // Verifica se o nome da doação foi informado
        if (!dados.nome_doacao) erros.push('Nome da doação é obrigatório');
        
        // Verifica se o tipo da doação foi informado
        if (!dados.tipo_doacao) erros.push('Tipo da doação é obrigatório');
        
        return erros;
    }

    // Função para criar uma nova doação no banco de dados
    static async criar(dados) {
        try {
            // Primeiro valida os dados antes de inserir
            const erros = Doacao.validar(dados);
            if (erros.length > 0) {
                throw { tipo: 'validacao', erros };
            }

            // Query SQL para inserir a doação na tabela
            const query = `INSERT INTO Doacao (cd_cliente, cd_campanha, nome_doacao, tipo_doacao, forma_arrecadacao, status_arrecadacao) 
                            VALUES (?, ?, ?, ?, ?, ?)`;
            
            // Executa a query passando os parâmetros
            const result = await db.runAsync(query, [
                dados.cd_cliente,
                dados.cd_campanha,
                dados.nome_doacao,
                dados.tipo_doacao,
                dados.forma_arrecadacao,
                dados.status_arrecadacao || 'pendente' // Se não informar status, usa 'pendente' como padrão
            ]);
            
            // Retorna o ID gerado junto com os dados
            return { id: result.lastID, ...dados };
            
        } catch (error) {
            console.error('Erro ao criar doação:', error);
            throw error; 
        }
    }

    // Função para buscar todas as doações de um cliente específico
    static async buscarPorCliente(clienteId) {
        try {
            // Busca todas as doações onde o cd_cliente é igual ao ID informado
            const rows = await db.allAsync("SELECT * FROM Doacao WHERE cd_cliente = ?", [clienteId]);
            return rows;
        } catch (error) {
            console.error(`Erro ao buscar doações do cliente ${clienteId}:`, error);
            throw error;
        }
    }

    // Função para buscar todas as doações de uma campanha específica
    static async buscarPorCampanha(campanhaId) {
        try {
            // Busca todas as doações onde o cd_campanha é igual ao ID informado
            const rows = await db.allAsync("SELECT * FROM Doacao WHERE cd_campanha = ?", [campanhaId]);
            return rows;
        } catch (error) {
            console.error(`Erro ao buscar doações da campanha ${campanhaId}:`, error);
            throw error;
        }
    }
}

module.exports = Doacao;