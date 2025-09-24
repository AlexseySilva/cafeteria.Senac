import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  getProducts, 
  getCategories, 
  adaptProductsForFrontend, 
  AdaptedProduct,
  BackendProduct 
} from '../../services/products';

// Hook personalizado para gerenciar produtos da API
export const useProducts = () => {
  const [products, setProducts] = useState<AdaptedProduct[]>([]); // Estado para produtos
  const [categories, setCategories] = useState<string[]>([]); // Estado para categorias
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [error, setError] = useState<string | null>(null); // Estado de erro

  // Função para carregar produtos da API
  const loadProducts = async () => {
    try {
      setLoading(true); // Inicia carregamento
      setError(null); // Limpa erros anteriores
      
      const backendProducts = await getProducts(); // Busca produtos do backend
      const adaptedProducts = adaptProductsForFrontend(backendProducts); // Adapta para frontend
      
      setProducts(adaptedProducts); // Atualiza estado dos produtos
      console.log(`[Products] Carregados ${adaptedProducts.length} produtos`); // Log de sucesso
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'; // Extrai mensagem de erro
      setError(errorMessage); // Define erro no estado
      console.error('[Products] Erro ao carregar produtos:', errorMessage); // Log do erro
      
      // Fallback para produtos estáticos em caso de erro
      setProducts(getFallbackProducts()); // Usa produtos de fallback
    } finally {
      setLoading(false); // Finaliza carregamento
    }
  };

  // Função para carregar categorias da API
  const loadCategories = async () => {
    try {
      const backendCategories = await getCategories(); // Busca categorias do backend
      setCategories(backendCategories); // Atualiza estado das categorias
      console.log(`[Categories] Carregadas ${backendCategories.length} categorias`); // Log de sucesso
    } catch (err) {
      console.error('[Categories] Erro ao carregar categorias:', err); // Log do erro
      
      // Fallback para categorias estáticas
      setCategories(['Drinks']); // Categoria padrão
    }
  };

  // Effect para carregar dados quando componente monta
  useEffect(() => {
    loadProducts(); // Carrega produtos
    loadCategories(); // Carrega categorias
  }, []);

  // Função para recarregar dados
  const refresh = () => {
    loadProducts(); // Recarrega produtos
    loadCategories(); // Recarrega categorias
  };

  return {
    products, // Array de produtos adaptados
    categories, // Array de categorias
    loading, // Estado de carregamento
    error, // Mensagem de erro (se houver)
    refresh, // Função para recarregar dados
  };
};

// Função para obter produtos de fallback (dados estáticos como backup)
const getFallbackProducts = (): AdaptedProduct[] => {
  return [
    {
      id: "1",
      title: "Expresso Cappuccino",
      description: ["cappuccino"],
      price: 12.50, // Preço de exemplo
      category: "Drinks",
      cover: require("../../assets/products/cover/Coffe_1.png"),
      thumbnail: require("../../assets/products/thumbnail/Coffe1.png"),
      ingredients: ["Espresso", "Milk", "White Chocolate Syrup", "Caramel Drizzle"],
      available: true,
    },
    {
      id: "2",
      title: "Expresso Latte",
      description: ["Leite vaporizado combinado com uma fina camada final de espuma de leite por cima"],
      price: 10.50, // Preço de exemplo
      category: "Drinks",
      cover: require("../../assets/products/cover/Coffe_2.png"),
      thumbnail: require("../../assets/products/thumbnail/Coffe2.png"),
      ingredients: ["Leite vaporizado", "Combinado com uma fina camada final de espuma de leite por cima"],
      available: true,
    },
    {
      id: "3",
      title: "Expresso Americano",
      description: ["Café expresso diluído em água quente"],
      price: 8.50, // Preço de exemplo
      category: "Drinks",
      cover: require("../../assets/products/cover/Coffe_3.png"),
      thumbnail: require("../../assets/products/thumbnail/Coffe3.png"),
      ingredients: ["Agua", "Cafe expresso"],
      available: true,
    },
    {
      id: "4",
      title: "Expresso Mocha",
      description: ["Café expresso com chocolate e leite vaporizado"],
      price: 14.50, // Preço de exemplo
      category: "Drinks",
      cover: require("../../assets/products/cover/Coffe_4.png"),
      thumbnail: require("../../assets/products/thumbnail/Coffe4.png"),
      ingredients: ["Agua", "Leite vaporizado", "Caramelo"],
      available: true,
    },
  ];
};

// Função para organizar produtos por categoria (compatível com estrutura existente)
export const organizeProductsByCategory = (products: AdaptedProduct[], categories: string[]) => {
  return categories.map(category => ({
    title: category, // Nome da categoria
    data: products.filter(product => product.category === category), // Produtos da categoria
  }));
};

// Função para obter todos os produtos como array plano (compatível com PRODUCTS)
export const getFlatProducts = (products: AdaptedProduct[]): AdaptedProduct[] => {
  return products; // Retorna produtos como estão
};

// Exporta tipos para compatibilidade
export type ProductProps = AdaptedProduct;
