// src/models/Noticias.js
const db = require('../database/database');

class Noticias {
    // CRIAR NOTÍCIA
    static async criar(dados) {
        const query = `INSERT INTO Noticias (cd_campanha, titulo_noticia, data_noticia, autor, conteudo) 
                        VALUES (?, ?, ?, ?, ?)`;
        
        const result = await db.runAsync(query, [
            dados.cd_campanha,
            dados.titulo_noticia,
            dados.data_noticia,
            dados.autor,
            dados.conteudo
        ]);
        
        return { id: result.lastID, ...dados };
    }

    //BUSCAR NOTÍCIAS
    static async buscar() {
        const rows = await db.allAsync("SELECT * FROM Noticias ORDER BY cd_noticias DESC");
        return rows;
    }

    //DELETAR NOTÍCIA
    static async deletar(id) {
        const result = await db.runAsync("DELETE FROM Noticias WHERE cd_noticias = ?", [id]);
        
        if (result.changes === 0) {
            throw new Error('Notícia não encontrada');
        }
        
        return { id, deletada: true };
    }
}

module.exports = Noticias;