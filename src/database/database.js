const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// pega o caminho do banco
// se tiver no vercel usa /tmp senao usa a pasta local
const dbPath = process.env.VERCEL ? '/tmp/ong_database.db' : path.join(__dirname, 'ong_database.db');

console.log('tentando conectar:', dbPath);

// conecta no banco sqlite
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('deu erro:', err.message);
    } else {
        console.log('conectou!');
        // ativa as foreign keys pra funcionar os relacionamentos
        db.run('PRAGMA foreign_keys = ON;');
        criarTabelas();
    }
});

// funcao pra criar as tabelas do banco
function criarTabelas() {
    // db.run executa um comando SQL
    // CREATE TABLE IF NOT EXISTS = cria tabela so se nao existir
    
    // tabela usuario - guarda info dos usuarios
    db.run(`CREATE TABLE IF NOT EXISTS Usuario (
        cd_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
        nome_completo TEXT NOT NULL,
        telefone TEXT,
        cpf TEXT UNIQUE,
        nome_usuario TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL
    )`, function(err) {
        if (err) console.log('erro usuario:', err);
    });

    // tabela campanha - guarda as campanhas de doacao
    db.run(`CREATE TABLE IF NOT EXISTS Campanha (
        cd_campanha INTEGER PRIMARY KEY AUTOINCREMENT,
        nome_campanha TEXT NOT NULL,
        meta_arrecadacao REAL,
        inicio DATE,
        fim DATE
    )`, function(err) {
        if (err) console.log('erro campanha:', err);
    });

    // setTimeout = espera um tempo antes de executar
    // precisa esperar pq a tabela doacao depende das outras duas
    setTimeout(function() {
        // tabela doacao - guarda as doacoes feitas
        db.run(`CREATE TABLE IF NOT EXISTS Doacao (
            cd_doacao INTEGER PRIMARY KEY AUTOINCREMENT,
            cd_cliente INTEGER,
            cd_campanha INTEGER,
            nome_doacao TEXT,
            tipo_doacao TEXT,
            forma_arrecadacao TEXT,
            FOREIGN KEY (cd_cliente) REFERENCES Usuario(cd_cliente),
            FOREIGN KEY (cd_campanha) REFERENCES Campanha(cd_campanha)
        )`, function(err) {
            if (err) {
                console.log('erro doacao:', err);
            } else {
                // so chama inserirDados depois que criou todas as tabelas
                inserirDados();
            }
        });
    }, 100); // espera 100 milissegundos
}

// funcao pra colocar dados de teste no banco
function inserirDados() {
    // db.get = busca UMA linha do banco
    // COUNT(*) = conta quantos registros tem
    db.get("SELECT COUNT(*) as count FROM Usuario", function(err, row) {
        // se nao tem erro E nao tem nenhum usuario (count = 0)
        if (!err && row.count == 0) {
            console.log('colocando dados de teste...');
            
            // INSERT = insere dados na tabela
            // insere um usuario de exemplo
            db.run("INSERT INTO Usuario (nome_completo, telefone, cpf, nome_usuario, senha, email) VALUES ('João Silva', '11999999999', '12345678901', 'joao123', 'senha123', 'joao@email.com')");
            
            // insere uma campanha de exemplo
            db.run("INSERT INTO Campanha (nome_campanha, meta_arrecadacao, inicio, fim) VALUES ('Campanha do Agasalho', 50000.00, '2024-06-01', '2024-08-31')");
            
            // espera um pouco antes de inserir a doacao
            // pq ela precisa do usuario e campanha ja existirem
            setTimeout(function() {
                // insere uma doacao de exemplo
                db.run("INSERT INTO Doacao (cd_cliente, cd_campanha, nome_doacao, tipo_doacao, forma_arrecadacao) VALUES (1, 1, 'Doação de Roupas', 'Roupas', 'Entrega')");
                console.log('dados inseridos');
            }, 50);
        }
    });
}

// funcoes pra usar async/await que vi no stackoverflow
// transforma os metodos do sqlite em promises
// PROMISE = uma forma de lidar com operacoes que demoram (como consultas no banco)
// ao inves de usar callback (funcao dentro de funcao) usa async/await que eh mais facil

// runAsync = executa comando e retorna promise
db.runAsync = function(query, params) {
    if (!params) params = []; // se nao tem parametros usa array vazio
    return new Promise((resolve, reject) => {
        this.run(query, params, function(err) {
            if (err) reject(err); // se deu erro rejeita
            else resolve({ lastID: this.lastID, changes: this.changes }); // se ok retorna info
        });
    });
};

// getAsync = busca uma linha e retorna promise
db.getAsync = function(query, params) {
    if (!params) params = [];
    return new Promise((resolve, reject) => {
        this.get(query, params, (err, row) => {
            if (err) reject(err);
            else resolve(row); // retorna a linha encontrada
        });
    });
};

// allAsync = busca varias linhas e retorna promise
db.allAsync = function(query, params) {
    if (!params) params = [];
    return new Promise((resolve, reject) => {
        this.all(query, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows); // retorna todas as linhas
        });
    });
};

// exporta o banco pra usar em outros arquivos
module.exports = db;