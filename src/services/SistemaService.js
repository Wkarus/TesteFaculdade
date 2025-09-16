// src/services/SistemaService.js
// Classe principal que orquestra todo o sistema da ONG -- Icaro
const Usuario = require('../models/Usuarios');  // ✅ COM S
const Campanha = require('../models/Campanha');
const Doacao = require('../models/Doacao');
const Noticias = require('../models/Noticias');

class SistemaService {
    
    // Método principal - processa doação completa validando tudo
    static async processarDoacaoCompleta(dados) {
        try {
            console.log('🔄 Processando doação completa...');
            
            // 1. Validar se usuário existe usando minha classe Usuario
            const usuario = await Usuario.buscarPorId(dados.cd_cliente);
            if (!usuario) {
                return { 
                    status: 'erro', 
                    message: `Usuário ${dados.cd_cliente} não encontrado` 
                };
            }
            
            // 2. Validar se campanha existe usando minha classe Campanha
            const campanhas = await Campanha.buscar();
            const campanha = campanhas.find(c => c.cd_campanha == dados.cd_campanha);
            if (!campanha) {
                return { 
                    status: 'erro', 
                    message: `Campanha ${dados.cd_campanha} não encontrada` 
                };
            }
            
            // 3. Criar a doação usando minha classe Doacao
            const novaDoacao = await Doacao.criar(dados);
            
            // 4. Retornar resultado completo integrado
            return {
                status: 'sucesso',
                message: 'Doação processada com sucesso! 🎉',
                dados: {
                    usuario: {
                        id: usuario.cd_cliente,
                        nome: usuario.nome_completo,
                        email: usuario.email
                    },
                    campanha: {
                        id: campanha.cd_campanha,
                        nome: campanha.nome_campanha
                    },
                    doacao: {
                        id: novaDoacao.id,
                        nome: dados.nome_doacao,
                        tipo: dados.tipo_doacao
                    }
                }
            };
            
        } catch (error) {
            return {
                status: 'erro',
                message: `Erro no processamento: ${error.message}`
            };
        }
    }
    
    // Relatório simples integrando suas classes existentes
    static async gerarRelatorioGeral() {
        try {
            // Uso suas classes para gerar um relatório
            const usuarios = await Usuario.buscar();
            const campanhas = await Campanha.buscar();
            const noticias = await Noticias.buscar();
            
            return {
                relatorio: {
                    total_usuarios: usuarios.length,
                    total_campanhas: campanhas.length,
                    total_noticias: noticias.length
                },
                dados: {
                    usuarios: usuarios,
                    campanhas: campanhas,
                    noticias: noticias
                },
                gerado_em: new Date().toISOString()
            };
            
        } catch (error) {
            throw new Error(`Erro ao gerar relatório: ${error.message}`);
        }
    }
}

module.exports = SistemaService;