import { productCartProps } from '../stores/cart-store';

// Interface para item de pedido
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

// Interface para pedido criado (local)
export interface LocalOrder {
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

// Array para armazenar pedidos em memória (simulação local)
let localOrders: LocalOrder[] = [];

// Contador para números de pedido
let orderCounter = 1;

// Serviço para criar um novo pedido (local)
export const createOrder = async (orderData: CreateOrderData): Promise<LocalOrder> => {
  try {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 500));

    // Calcula total do pedido
    const totalAmount = orderData.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    // Cria pedido local
    const newOrder: LocalOrder = {
      _id: `order_${Date.now()}`, // ID único baseado em timestamp
      user: orderData.user_id,
      items: orderData.items.map(item => ({
        product: {
          _id: item.product,
          title: `Produto ${item.product}`, // Nome genérico
          price: item.price,
          category: 'Drinks'
        },
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount,
      status: 'pending', // Status inicial
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      notes: orderData.notes,
      orderNumber: `#${orderCounter.toString().padStart(4, '0')}`, // Número formatado
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Incrementa contador
    orderCounter++;

    // Adiciona à lista local
    localOrders.push(newOrder);

    // Log de sucesso
    if (__DEV__) {
      console.log(`[Orders] Pedido criado localmente: ${newOrder.orderNumber}`);
    }

    return newOrder;
  } catch (error) {
    console.error('Erro ao criar pedido local:', error);
    throw new Error('Não foi possível criar o pedido. Tente novamente.');
  }
};

// Serviço para buscar pedidos de um usuário (local)
export const getUserOrders = async (userId: string): Promise<LocalOrder[]> => {
  try {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Filtra pedidos do usuário
    const userOrders = localOrders.filter(order => order.user === userId);
    
    return userOrders;
  } catch (error) {
    console.error('Erro ao buscar pedidos do usuário:', error);
    throw new Error('Não foi possível carregar seus pedidos');
  }
};

// Serviço para buscar um pedido específico por ID (local)
export const getOrderById = async (orderId: string): Promise<LocalOrder> => {
  try {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const order = localOrders.find(order => order._id === orderId);
    
    if (!order) {
      throw new Error('Pedido não encontrado');
    }
    
    return order;
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    throw new Error('Pedido não encontrado');
  }
};

// Função para converter itens do carrinho para formato do pedido
export const convertCartItemsToOrderItems = (cartItems: productCartProps[]): OrderItem[] => {
  return cartItems.map(item => ({
    product: item.id, // ID do produto
    quantity: item.quantity, // Quantidade
    price: item.price || 0, // Preço unitário
  }));
};

// Função para validar dados do pedido antes de enviar
export const validateOrderData = (orderData: CreateOrderData): string[] => {
  const errors: string[] = [];
  
  // Validação do nome do cliente
  if (!orderData.customerName || orderData.customerName.trim().length === 0) {
    errors.push('Nome do cliente é obrigatório');
  }
  
  // Validação dos itens
  if (!orderData.items || orderData.items.length === 0) {
    errors.push('Pelo menos um item deve ser adicionado ao pedido');
  }
  
  // Validação de cada item
  orderData.items.forEach((item, index) => {
    if (!item.product || item.quantity <= 0) {
      errors.push(`Item ${index + 1} possui dados inválidos`);
    }
  });
  
  return errors;
};

// Função para obter todos os pedidos (para debug)
export const getAllOrders = (): LocalOrder[] => {
  return localOrders;
};

// Função para limpar todos os pedidos (para debug)
export const clearAllOrders = (): void => {
  localOrders = [];
  orderCounter = 1;
};
