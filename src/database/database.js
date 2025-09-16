const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'ong_database.db');
console.log('Tentando conectar no banco:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Erro ao conectar com o banco:', err.message);
    } else {
        console.log('✅ Conectado ao banco SQLite criado no SQLite Studio!');
        
        db.run('PRAGMA foreign_keys = ON;', (err) => {
            if (err) {
                console.error('Erro ao ativar foreign keys:', err);
            } else {
                console.log('✅ Foreign keys ativadas!');
            }
        });
    }
});

function testarConexao() {
    db.all("SELECT name FROM sqlite_master WHERE type='table';", (err, tables) => {
        if (err) {
            console.error('Erro ao listar tabelas:', err);
        } else {
            console.log('📋 Tabelas encontradas:', tables.map(t => t.name));
        }
    });
}

testarConexao();

// 🚀 MÉTODOS ASYNC ADICIONADOS:
db.runAsync = function(query, params = []) {
    return new Promise((resolve, reject) => {
        this.run(query, params, function(err) {
            if (err) reject(err);
            else resolve({ lastID: this.lastID, changes: this.changes });
        });
    });
};

db.getAsync = function(query, params = []) {
    return new Promise((resolve, reject) => {
        this.get(query, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

db.allAsync = function(query, params = []) {
    return new Promise((resolve, reject) => {
        this.all(query, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

// Seus testes comentados...
/* ... */


// Testar ao conectar
testarConexao();
/*
// TESTE COMPLETO: Dados existentes + múltiplas campanhas
setTimeout(() => {
    console.log('\n🔍 Verificando dados existentes...\n');
    
    // 1. Mostrar dados atuais
    db.all(`SELECT 
                u.nome_completo,
                c.nome_campanha,
                d.nome_doacao,
                d.tipo_doacao
            FROM Usuario u 
            LEFT JOIN Doacao d ON u.cd_cliente = d.cd_cliente 
            LEFT JOIN Campanha c ON d.cd_campanha = c.cd_campanha
            ORDER BY u.cd_cliente, c.cd_campanha`, (err, dadosAtuais) => {
        
        if (err) {
            console.error('❌ Erro:', err.message);
            db.close();
            return;
        }
        
        console.log('�� Dados atuais no banco:');
        console.table(dadosAtuais);
        
        // 2. TESTE: João participando de múltiplas campanhas
        console.log('\n🧪 TESTE: Adicionando João em mais campanhas...\n');
        
        // João participa da campanha Natal também
        db.run(`INSERT INTO Doacao (cd_cliente, cd_campanha, nome_doacao, tipo_doacao, forma_arrecadacao) 
                VALUES (?, ?, ?, ?, ?)`,
                [1, 2, 'Doação Natal - João', 'Brinquedos', 'Entrega'],
                function(err) {
                    if (err) {
                        console.error('❌ Erro ao inserir:', err.message);
                    } else {
                        console.log('✅ João agora participa da campanha Natal também!');
                        
                        // 3. Inserir novo usuário em múltiplas campanhas
                        console.log('➕ Criando usuário que participa de TODAS as campanhas...');
                        
                        db.run(`INSERT INTO Usuario (nome_completo, telefone, cpf, nome_usuario, senha, email) 
                                VALUES (?, ?, ?, ?, ?, ?)`,
                                ['Carlos Multicamp', '11555555555', '44444444444', 'carlos_multi', 'senha999', 'carlos@email.com'],
                                function(err) {
                                    if (err) {
                                        console.error('❌ Erro ao inserir usuário:', err.message);
                                    } else {
                                        const carlosId = this.lastID;
                                        console.log('✅ Carlos criado com ID:', carlosId);
                                        
                                        // Carlos participa de TODAS as campanhas
                                        const participacoes = [
                                            [carlosId, 1, 'Doação Roupas - Carlos', 'Roupas', 'Entrega'],
                                            [carlosId, 2, 'Doação Natal - Carlos', 'Dinheiro', 'PIX']
                                        ];
                                        
                                        let contador = 0;
                                        participacoes.forEach(participacao => {
                                            db.run(`INSERT INTO Doacao (cd_cliente, cd_campanha, nome_doacao, tipo_doacao, forma_arrecadacao) 
                                                    VALUES (?, ?, ?, ?, ?)`,
                                                    participacao,
                                                    function(err) {
                                                        contador++;
                                                        if (err) {
                                                            console.error('❌ Erro:', err.message);
                                                        } else {
                                                            console.log(`✅ Carlos adicionado à campanha ${participacao[1]}`);
                                                        }
                                                        
                                                        // Quando terminar todas as inserções
                                                        if (contador === participacoes.length) {
                                                            // 4. RESULTADO FINAL
                                                            console.log('\n📈 RESULTADO FINAL - Múltiplas participações:\n');
                                                            
                                                            // Consulta: Quantas campanhas cada pessoa participa
                                                            db.all(`SELECT 
                                                                        u.nome_completo,
                                                                        COUNT(DISTINCT d.cd_campanha) as total_campanhas,
                                                                        GROUP_CONCAT(c.nome_campanha, ' | ') as campanhas_participando
                                                                    FROM Usuario u 
                                                                    LEFT JOIN Doacao d ON u.cd_cliente = d.cd_cliente 
                                                                    LEFT JOIN Campanha c ON d.cd_campanha = c.cd_campanha
                                                                    GROUP BY u.cd_cliente
                                                                    ORDER BY total_campanhas DESC`, (err, resumo) => {
                                                                
                                                                if (err) {
                                                                    console.error('❌ Erro:', err.message);
                                                                } else {
                                                                    console.log('👥 RESUMO - Participações por usuário:');
                                                                    console.table(resumo);
                                                                    
                                                                    // Consulta detalhada
                                                                    db.all(`SELECT 
                                                                                u.nome_completo as Usuario,
                                                                                c.nome_campanha as Campanha,
                                                                                d.nome_doacao as Doacao,
                                                                                d.tipo_doacao as Tipo
                                                                            FROM Usuario u 
                                                                            JOIN Doacao d ON u.cd_cliente = d.cd_cliente 
                                                                            JOIN Campanha c ON d.cd_campanha = c.cd_campanha
                                                                            ORDER BY u.nome_completo, c.nome_campanha`, (err, detalhado) => {
                                                                        
                                                                        if (err) {
                                                                            console.error('❌ Erro:', err.message);
                                                                        } else {
                                                                            console.log('\n📋 DETALHADO - Todas as participações:');
                                                                            console.table(detalhado);
                                                                        }
                                                                        
                                                                        console.log('\n🎉 TESTE COMPLETO!');
                                                                        console.log('✅ Múltiplas campanhas por usuário: FUNCIONANDO');
                                                                        console.log('✅ Múltiplos usuários por campanha: FUNCIONANDO');
                                                                        console.log('✅ Consultas complexas: FUNCIONANDO');
                                                                        
                                                                        
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                        });
                                    }
                                });
                    }
                });
    });
}, 2000);


setTimeout(() => {
    console.log('\n🧪 TESTE: Tentando cadastrar CPF duplicado...\n');
    
    // Tentar inserir Carlos com CPF que já existe
    db.run(`INSERT INTO Usuario (nome_completo, telefone, cpf, nome_usuario, senha, email) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            ['Carlos Duplicado', '11777777777', '12345678901', 'carlos_dup', 'senha123', 'carlos.dup@email.com'],
            function(err) {
                if (err) {
                    console.error('❌ ERRO ESPERADO - CPF duplicado:', err.message);
                    console.log('✅ Validação funcionando: CPF único mantido!');
                } else {
                    console.log('⚠️ PROBLEMA: Permitiu CPF duplicado!');
                }
                
                // Tentar inserir com email duplicado também
                db.run(`INSERT INTO Usuario (nome_completo, telefone, cpf, nome_usuario, senha, email) 
                        VALUES (?, ?, ?, ?, ?, ?)`,
                        ['Carlos Multicamp', '11555555555', '44444444444', 'carlos_' + Date.now(), 'senha999', 'carlos.multicamp@email.com'],
                        function(err) {
                            if (err) {
                                console.error('❌ ERRO ESPERADO - Email duplicado:', err.message);
                                console.log('✅ Validação funcionando: Email único mantido!');
                            } else {
                                console.log('⚠️ PROBLEMA: Permitiu email duplicado!');
                            }
                            
                            db.close(); // ← db.close() só aqui no final
                        });
            });
}, 4000);


*/

// Exportar para usar em outros arquivos
module.exports = db;