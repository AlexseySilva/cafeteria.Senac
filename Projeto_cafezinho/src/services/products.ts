import api from './api';

// Interface para definir estrutura de um produto vindo do backend
export interface BackendProduct {
  _id: string; // ID único do produto no MongoDB
  title: string; // Nome/título do produto
  description: string[]; // Array de descrições do produto
  price: number; // Preço do produto
  category: string; // Categoria do produto (Drinks, Sweets, Savory)
  ingredients: string[]; // Lista de ingredientes
  cover: string; // Nome do arquivo da imagem de capa
  thumbnail: string; // Nome do arquivo da imagem miniatura
  cover_url: string; // URL completa da imagem de capa
  thumbnail_url: string; // URL completa da imagem miniatura
  available: boolean; // Indica se produto está disponível
  createdAt: string; // Data de criação
  updatedAt: string; // Data da última atualização
}

// Interface para produto adaptado para o frontend (compatível com estrutura existente)
export interface AdaptedProduct {
  id: string; // ID do produto (adaptado de _id)
  title: string; // Nome do produto
  description: string[]; // Descrições do produto
  price: number; // Preço do produto
  category: string; // Categoria do produto
  ingredients: string[]; // Lista de ingredientes
  cover: { uri: string } | any; // Imagem de capa (formato compatível com Image do RN)
  thumbnail: { uri: string } | any; // Imagem miniatura (formato compatível com Image do RN)
  available: boolean; // Disponibilidade do produto
}

// Serviço para buscar todos os produtos do backend
export const getProducts = async (): Promise<BackendProduct[]> => {
  try {
    const response = await api.get('/products'); // Faz requisição GET para endpoint de produtos
    return response.data; // Retorna array de produtos
  } catch (error) {
    console.error('Erro ao buscar produtos:', error); // Log do erro
    throw new Error('Não foi possível carregar os produtos'); // Lança erro personalizado
  }
};

// Serviço para buscar produtos por categoria
export const getProductsByCategory = async (category: string): Promise<BackendProduct[]> => {
  try {
    const response = await api.get(`/products?category=${category}`); // Requisição com filtro de categoria
    return response.data; // Retorna produtos filtrados
  } catch (error) {
    console.error('Erro ao buscar produtos por categoria:', error); // Log do erro
    throw new Error(`Não foi possível carregar produtos da categoria ${category}`); // Erro específico
  }
};

// Serviço para buscar um produto específico por ID
export const getProductById = async (id: string): Promise<BackendProduct> => {
  try {
    const response = await api.get(`/products/${id}`); // Requisição para produto específico
    return response.data; // Retorna dados do produto
  } catch (error) {
    console.error('Erro ao buscar produto por ID:', error); // Log do erro
    throw new Error('Produto não encontrado'); // Erro personalizado
  }
};

// Serviço para buscar categorias disponíveis
export const getCategories = async (): Promise<string[]> => {
  try {
    const response = await api.get('/products/meta/categories'); // Requisição para endpoint de categorias
    return response.data; // Retorna array de categorias
  } catch (error) {
    console.error('Erro ao buscar categorias:', error); // Log do erro
    throw new Error('Não foi possível carregar as categorias'); // Erro personalizado
  }
};

// Array de imagens de fallback para usar quando backend não tem imagem
const fallbackImages = {
  covers: [
    require('../assets/products/cover/Coffe_1.png'),
    require('../assets/products/cover/Coffe_2.png'),
    require('../assets/products/cover/Coffe_3.png'),
    require('../assets/products/cover/Coffe_4.png'),
  ],
  thumbnails: [
    require('../assets/products/thumbnail/Coffe1.png'),
    require('../assets/products/thumbnail/Coffe2.png'),
    require('../assets/products/thumbnail/Coffe3.png'),
    require('../assets/products/thumbnail/Coffe4.png'),
  ],
};

// Cache para evitar recriação de objetos de imagem
const imageCache = new Map<string, any>();

// Função para obter imagem de fallback baseada no ID do produto
const getFallbackImage = (productId: string, type: 'cover' | 'thumbnail') => {
  const cacheKey = `${productId}-${type}`;

  // Verifica se já está no cache
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey);
  }

  // Usa hash simples do ID para escolher imagem consistentemente
  const hash = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const imageArray = type === 'cover' ? fallbackImages.covers : fallbackImages.thumbnails;
  const index = hash % imageArray.length; // Garante índice válido
  const image = imageArray[index];

  // Armazena no cache
  imageCache.set(cacheKey, image);
  return image;
};

// Função para obter fonte de imagem com cache
const getImageSource = (url: string | undefined | null, productId: string, type: 'cover' | 'thumbnail') => {
  // Verifica se URL é válida (não null, undefined ou string vazia)
  if (url && url.trim() !== '') {
    const cacheKey = `uri-${url}`;
    if (imageCache.has(cacheKey)) {
      return imageCache.get(cacheKey);
    }
    const uriObject = { uri: url };
    imageCache.set(cacheKey, uriObject);
    return uriObject;
  }
  // Sempre usa fallback local se URL não for válida
  return getFallbackImage(productId, type);
};

// Função para adaptar produto do backend para formato do frontend
export const adaptProductForFrontend = (backendProduct: BackendProduct): AdaptedProduct => {
  return {
    id: backendProduct._id, // Converte _id para id
    title: backendProduct.title, // Mantém título
    description: backendProduct.description, // Mantém descrição
    price: backendProduct.price, // Mantém preço
    category: backendProduct.category, // Mantém categoria
    ingredients: backendProduct.ingredients, // Mantém ingredientes
    // Usa URL do backend se disponível, senão usa imagem de fallback
    cover: getImageSource(backendProduct.cover_url, backendProduct._id, 'cover'),
    thumbnail: getImageSource(backendProduct.thumbnail_url, backendProduct._id, 'thumbnail'),
    available: backendProduct.available, // Mantém disponibilidade
  };
};

// Função para adaptar múltiplos produtos
export const adaptProductsForFrontend = (backendProducts: BackendProduct[]): AdaptedProduct[] => {
  return backendProducts.map(adaptProductForFrontend); // Aplica adaptação em cada produto
};
