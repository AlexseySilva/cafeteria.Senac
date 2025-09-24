import api from './api';
import { productCartProps } from '../stores/cart-store';

// Interface para item de pedido no backend
export interface OrderItem {
  product: string; // ID do produto
  quantity: number; // Quantidade do produto
  price: number; // Preço unitário no momento do pedido
}

// Interface para dados de criação de pedido
export interface CreateOrderData {
  user_id: string; // ID do usuário que está fazendo o pedido
  items: OrderItem[]; // Array de itens do pedido
  customerName: string; // Nome do cliente
  customerPhone?: string; // Telefone do cliente (opcional)
  notes?: string; // Observações do pedido (opcional)
}

// Interface para pedido retornado pelo backend
export interface BackendOrder {
  _id: string; // ID único do pedido
  user: string; // ID do usuário
  items: Array<{
    product: {
      _id: string; // ID do produto
      title: string; // Nome do produto
      price: number; // Preço do produto
      category: string; // Categoria do produto
    };
    quantity: number; // Quantidade
    price: number; // Preço unitário
  }>;
  totalAmount: number; // Valor total do pedido
  status: string; // Status do pedido
  customerName: string; // Nome do cliente
  customerPhone?: string; // Telefone do cliente
  notes?: string; // Observações
  orderNumber: string; // Número único do pedido
  createdAt: string; // Data de criação
  updatedAt: string; // Data de atualização
}

// Serviço para criar um novo pedido
export const createOrder = async (orderData: CreateOrderData): Promise<BackendOrder> => {
  try {
    const response = await api.post('/orders', orderData); // Envia dados do pedido para o backend
    return response.data; // Retorna pedido criado
  } catch (error) {
    console.error('Erro ao criar pedido:', error); // Log do erro
    
    // Tratamento específico de erros
    if (error.response?.status === 400) {
      throw new Error(error.response.data.error || 'Dados do pedido inválidos'); // Erro de validação
    }
    
    throw new Error('Não foi possível criar o pedido. Tente novamente.'); // Erro genérico
  }
};

// Serviço para buscar pedidos de um usuário
export const getUserOrders = async (userId: string): Promise<BackendOrder[]> => {
  try {
    const response = await api.get(`/orders/user/${userId}`); // Busca pedidos do usuário
    return response.data; // Retorna array de pedidos
  } catch (error) {
    console.error('Erro ao buscar pedidos do usuário:', error); // Log do erro
    throw new Error('Não foi possível carregar seus pedidos'); // Erro personalizado
  }
};

// Serviço para buscar um pedido específico por ID
export const getOrderById = async (orderId: string): Promise<BackendOrder> => {
  try {
    const response = await api.get(`/orders/${orderId}`); // Busca pedido específico
    return response.data; // Retorna dados do pedido
  } catch (error) {
    console.error('Erro ao buscar pedido:', error); // Log do erro
    throw new Error('Pedido não encontrado'); // Erro personalizado
  }
};

// Função para converter itens do carrinho para formato do backend
export const convertCartItemsToOrderItems = (cartItems: productCartProps[]): OrderItem[] => {
  return cartItems.map(item => ({
    product: item.id, // Converte id para product (corrigido)
    quantity: item.quantity, // Mantém quantidade
    price: item.price || 0, // Usa preço do item ou 0 como fallback
  }));
};

// Função para validar dados do pedido antes de enviar
export const validateOrderData = (orderData: CreateOrderData): string[] => {
  const errors: string[] = []; // Array para armazenar erros de validação
  
  // Validação do nome do cliente
  if (!orderData.customerName || orderData.customerName.trim().length === 0) {
    errors.push('Nome do cliente é obrigatório'); // Erro se nome vazio
  }
  
  // Validação dos itens
  if (!orderData.items || orderData.items.length === 0) {
    errors.push('Pelo menos um item deve ser adicionado ao pedido'); // Erro se sem itens
  }
  
  // Validação de cada item
  orderData.items.forEach((item, index) => {
    if (!item.product || item.quantity <= 0) {
      errors.push(`Item ${index + 1} possui dados inválidos`); // Erro em item específico
    }
  });
  
  return errors; // Retorna array de erros (vazio se tudo válido)
};
