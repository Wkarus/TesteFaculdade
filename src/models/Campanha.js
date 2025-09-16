// src/models/Campanha.js
const db = require('../database/database');

class Campanha {
    constructor(data = {}) {
        this.id = data.cd_campanha || null;           
        this.nomeCampanha = data.nome_campanha || ''; 
        this.metaArrecadacao = data.meta_arrecadacao || 0;        
        this.inicio = data.inicio || '';     
        this.fim = data.fim || '';          
    }

    //  CRIAR CAMPANHA
    static async criar(dados) {
        const query = `INSERT INTO Campanha (nome_campanha, meta_arrecadacao, inicio, fim) 
                       VALUES (?, ?, ?, ?)`;
        
        const result = await db.runAsync(query, [
            dados.nome_campanha,
            dados.meta_arrecadacao || 0,
            dados.inicio,
            dados.fim
        ]);
        
        return { id: result.lastID, ...dados };
    }

    //  BUSCAR CAMPANHAS
    static async buscar() {
        const rows = await db.allAsync("SELECT * FROM Campanha ORDER BY cd_campanha DESC");
        return rows;
    }

    //  DELETAR CAMPANHA
    static async deletar(id) {
        const result = await db.runAsync("DELETE FROM Campanha WHERE cd_campanha = ?", [id]);
        
        if (result.changes === 0) {
            throw new Error('Campanha não encontrada');
        }
        
        return { id, deletada: true };
    }
}

module.exports = Campanha;