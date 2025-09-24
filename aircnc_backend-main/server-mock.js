const express = require('express'); // Importa framework web Express
const cors = require('cors'); // Importa middleware para Cross-Origin Resource Sharing
const path = require('path'); // Importa utilitário para manipulação de caminhos

// Importar rotas mock
const ProductsMockRoutes = require('./routes/ProductsMock.routes'); // Importa rotas mock de produtos
const OrdersMockRoutes = require('./routes/OrdersMock.routes'); // Importa rotas mock de pedidos

const app = express(); // Cria instância da aplicação Express

// Middlewares
app.use(express.json()); // Middleware para parsing de JSON no body das requisições
app.use(cors()); // Middleware para permitir requisições cross-origin

// Servir arquivos estáticos (imagens)
app.use('/files', express.static(path.resolve(__dirname, 'uploads'))); // Serve arquivos da pasta uploads na rota /files

// Rota principal
app.get('/', (req, res) => { // Define rota GET para raiz da aplicação
    return res.json({ // Retorna resposta em JSON
        message: 'API Café Senac rodando (modo mock)...', // Mensagem de status
        endpoints: { // Objeto com endpoints disponíveis
            products: '/products', // Endpoint de produtos
            orders: '/orders', // Endpoint de pedidos
            files: '/files' // Endpoint de arquivos estáticos
        }
    });
});

// Rotas da API
app.use('/products', ProductsMockRoutes); // Registra rotas de produtos no caminho /products
app.use('/orders', OrdersMockRoutes); // Registra rotas de pedidos no caminho /orders

// Rota de teste
app.get('/ping', (req, res) => { // Define rota GET para teste de conectividade
    console.log('recebeu ping'); // Loga no console que recebeu ping
    res.json({ message: 'pong', timestamp: new Date().toISOString() }); // Responde com pong e timestamp
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => { // Middleware global para capturar erros
    console.error('Erro:', err); // Loga erro no console
    res.status(500).json({ error: 'Erro interno do servidor' }); // Retorna erro 500
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => { // Middleware catch-all para rotas não definidas
    res.status(404).json({ error: 'Rota não encontrada' }); // Retorna erro 404
});

// Iniciar servidor
const port = process.env.PORT || 3335; // Define porta do servidor (variável de ambiente ou 3335)
app.listen(port, () => { // Inicia servidor na porta especificada
    console.log(`🚀 Servidor rodando na porta ${port} (modo mock)`); // Loga que servidor iniciou
    console.log(`📱 API disponível em: http://localhost:${port}`); // Loga URL da API
    console.log(`🖼️  Arquivos estáticos em: http://localhost:${port}/files`); // Loga URL dos arquivos
});

module.exports = app; // Exporta aplicação Express
