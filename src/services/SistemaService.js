// src/services/SistemaService.js
// Classe principal que orquestra todo o sistema da ONG -- Icaro
// Esta é a "classe principal" que o professor pediu - ela integra todas as funcionalidades

const db = require('../database/database'); // importa nosso banco SQLite

class SistemaService {
    
    // metodo para processar doacao - funcionalidade principal
    async processarDoacao(dados) {
        try {
            console.log('processando doacao...');
            
            // desestruturacao = pegar so os campos que preciso do objeto dados
            const { nome_doacao, tipo_doacao, cd_cliente, cd_campanha,cd_noticias } = dados;
            
            // INSERT = inserir nova doacao no banco SQLite
            // runAsync = executa comando SQL e retorna info sobre o que foi inserido
            const resultado = await db.runAsync(
                'INSERT INTO Doacao (cd_cliente, cd_campanha, nome_doacao, tipo_doacao, forma_arrecadacao) VALUES (?, ?, ?, ?, ?)',
                [cd_cliente, cd_campanha, nome_doacao, tipo_doacao, 'Online'] // ? = placeholders pra seguranca
            );
            
            // retorna os dados da doacao criada incluindo o ID gerado automaticamente
            return {
                id_doacao: resultado.lastID, // lastID = ultimo ID inserido no banco
                nome_doacao,
                tipo_doacao,
                cd_cliente,
                cd_campanha
            };
            
        } catch (error) {
            // se der erro lanca excecao com mensagem clara
            throw new Error(`Erro ao processar doacao: ${error.message}`);
        }
    }
    
    // metodo para listar todos os usuarios cadastrados
    async listarUsuarios() {
        try {
            // allAsync = busca TODOS os registros da tabela Usuario
            return await db.allAsync('SELECT * FROM Usuario');
        } catch (error) {
            throw new Error(`Erro ao listar usuarios: ${error.message}`);
        }
    }
    
    // metodo para listar todas as campanhas ativas
    async listarCampanhas() {
        try {
            // SELECT * = seleciona todas as colunas da tabela Campanha
            return await db.allAsync('SELECT * FROM Campanha');
        } catch (error) {
            throw new Error(`Erro ao listar campanhas: ${error.message}`);
        }
    }
    
    // metodo para listar doacoes COM JOIN - mostra nomes em vez de codigos
    async listarDoacoes() {
        try {
            // JOIN = juntar tabelas pra mostrar informacoes completas
            // sem JOIN: so veria numeros (cd_cliente: 1, cd_campanha: 2)
            // com JOIN: ve nomes reais (Joao Silva, Campanha do Agasalho)
            return await db.allAsync(`
                SELECT d.*, u.nome_completo, c.nome_campanha 
                FROM Doacao d 
                LEFT JOIN Usuario u ON d.cd_cliente = u.cd_cliente 
                LEFT JOIN Campanha c ON d.cd_campanha = c.cd_campanha
            `);
            // LEFT JOIN = inclui todas as doacoes mesmo se usuario/campanha nao existir
            // d.* = todas as colunas da tabela Doacao
            // u.nome_completo = nome do usuario que fez a doacao
            // c.nome_campanha = nome da campanha que recebeu a doacao
        } catch (error) {
            throw new Error(`Erro ao listar doacoes: ${error.message}`);
        }
    }
    
    // ADICIONA ESTE MÉTODO AQUI:
    // metodo para listar todas as noticias da ONG
async listarNoticias() {
    try {
        // Usar os nomes corretos das colunas do SEU banco
        return await db.allAsync('SELECT * FROM Noticias ORDER BY data_noticia DESC');
    } catch (error) {
        throw new Error(`Erro ao listar noticias: ${error.message}`);
    }
}
    
    // relatorio geral do sistema - integra todas as funcionalidades
    async gerarRelatorioGeral() {
        try {
            // chama todos os metodos da classe pra gerar relatorio completo
            const usuarios = await this.listarUsuarios();     // this = se refere a esta classe
            const campanhas = await this.listarCampanhas();   // await = espera terminar antes de continuar
            const doacoes = await this.listarDoacoes();
            const noticias = await this.listarNoticias();     // ADICIONA ESTA LINHA
            
            // retorna estatisticas + dados 
            return {
                relatorio: {
                    total_usuarios: usuarios.length,    // .length = quantidade de itens no array
                    total_campanhas: campanhas.length,
                    total_doacoes: doacoes.length,
                    total_noticias: noticias.length     // ADICIONA ESTA LINHA
                },
                dados: {
                    usuarios,    // shorthand = mesmo que usuarios: usuarios
                    campanhas,
                    doacoes,
                    noticias     // ADICIONA ESTA LINHA
                },
                gerado_em: new Date().toISOString() // timestamp de quando foi gerado
            };
            
        } catch (error) {
            throw new Error(`Erro ao gerar relatorio: ${error.message}`);
        }
    }
}

// exporta a classe pra ser usada no server.js
// esta eh a "classe principal" que orquestra todo o sistema da ONG
module.exports = SistemaService;