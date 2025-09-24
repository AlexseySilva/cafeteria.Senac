// Script de debug para testar sistema de pedidos
console.log('=== TESTE DO SISTEMA DE PEDIDOS ===');

// Simula dados do carrinho
const cartItems = [
  {
    id: "1",
    title: "Expresso Cappuccino",
    price: 8.50,
    quantity: 2
  },
  {
    id: "2", 
    title: "Expresso Latte",
    price: 7.50,
    quantity: 1
  }
];

// Simula dados do cliente
const customerData = {
  customerName: "João Silva",
  customerPhone: "11999999999",
  address: "Rua das Flores, 123"
};

console.log('Itens do carrinho:', cartItems);
console.log('Dados do cliente:', customerData);

// Calcula total
const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
console.log('Total calculado:', total);

// Simula conversão para formato de pedido
const orderItems = cartItems.map(item => ({
  product: item.id,
  quantity: item.quantity,
  price: item.price
}));

console.log('Itens convertidos para pedido:', orderItems);

// Simula dados do pedido
const orderData = {
  user_id: "user_123",
  items: orderItems,
  customerName: customerData.customerName,
  customerPhone: customerData.customerPhone,
  notes: `Entregar em: ${customerData.address}`
};

console.log('Dados do pedido final:', orderData);

// Validações
const validations = [];

if (!orderData.customerName || orderData.customerName.trim().length === 0) {
  validations.push('Nome do cliente é obrigatório');
}

if (!orderData.items || orderData.items.length === 0) {
  validations.push('Pelo menos um item deve ser adicionado ao pedido');
}

orderData.items.forEach((item, index) => {
  if (!item.product || item.quantity <= 0) {
    validations.push(`Item ${index + 1} possui dados inválidos`);
  }
});

console.log('Validações:', validations.length === 0 ? 'TODAS PASSARAM' : validations);

console.log('=== FIM DO TESTE ===');
