import axios from 'axios';

// Configuração base da API para comunicação com o backend
const api = axios.create({
  baseURL: 'http://192.168.0.241:3335', // URL base do servidor backend (IP da máquina)
  timeout: 15000, // Timeout de 15 segundos para requisições
  headers: {
    'Content-Type': 'application/json', // Define tipo de conteúdo como JSON
  },
  // Configurações adicionais para melhor estabilidade
  validateStatus: (status) => status < 500, // Aceita códigos de status menores que 500
});

// Interceptor para requisições - adiciona logs apenas em desenvolvimento
api.interceptors.request.use(
  (config) => {
    if (__DEV__) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`); // Log da requisição
    }
    return config;
  },
  (error) => {
    if (__DEV__) {
      console.error('[API] Erro na requisição:', error.message); // Log de erro na requisição
    }
    return Promise.reject(error);
  }
);

// Interceptor para respostas - trata erros globalmente
api.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.log(`[API] Resposta recebida:`, response.status); // Log da resposta
    }
    return response;
  },
  (error) => {
    // Log simplificado apenas em desenvolvimento
    if (__DEV__) {
      const errorMessage = error.response?.data?.message || error.message || 'Erro de conexão';
      console.warn(`[API] ${errorMessage}`);
    }

    // Cria erro mais limpo para o frontend
    const cleanError = new Error(
      error.response?.data?.message ||
      error.message ||
      'Não foi possível conectar ao servidor'
    );

    return Promise.reject(cleanError);
  }
);

export default api;
