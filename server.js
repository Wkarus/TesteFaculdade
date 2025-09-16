const express = require('express'); // esse require e como importar uma ferramenta
const cors = require('cors');
require('dotenv').config();


//criando o servidor  --icaro (importamos ele na primeira linha )
const app = express();
const PORT = process.env.PORT || 3000; // setamos a porta que vamos usar

// Middlewares sao funçoes que rodam antes de cada requisição `acabei de descobrir isso pqp `
    
app.use(cors()); // CORS = permite outros sites acessarem nossa API/ FRONT END ACESSAR A API--- Icaro 
app.use(express.json()); // Permite receber dados JSON -- Icaro

// Rota de teste
app.get('/', (req, res) => { // verifica quando alguem acessa 
  res.json({  //esse retorna 
    message: 'Funcionou porra',
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`); // mensagem  informando que esta ... 
  console.log(`Acesse: http://localhost:${PORT}`);
});