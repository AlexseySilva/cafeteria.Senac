import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  getProducts, 
  getCategories, 
  adaptProductsForFrontend, 
  AdaptedProduct,
  BackendProduct 
} from '../../services/products';

// Hook personalizado melhorado para gerenciar produtos da API
export const useProducts = () => {
  const [products, setProducts] = useState<AdaptedProduct[]>([]); // Estado para produtos
  const [categories, setCategories] = useState<string[]>([]); // Estado para categorias
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [error, setError] = useState<string | null>(null); // Estado de erro
  
  // Refs para controlar carregamento e evitar loops
  const isLoadingProducts = useRef(false);
  const isLoadingCategories = useRef(false);
  const hasInitialized = useRef(false);

  // Função para carregar produtos da API (com proteção contra loops)
  const loadProducts = useCallback(async () => {
    if (isLoadingProducts.current) return; // Evita requisições duplicadas
    
    try {
      isLoadingProducts.current = true;
      setLoading(true);
      setError(null);
      
      const backendProducts = await getProducts();
      const adaptedProducts = adaptProductsForFrontend(backendProducts);
      
      setProducts(adaptedProducts);
      if (__DEV__) {
        console.log(`[Products] Carregados ${adaptedProducts.length} produtos`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar produtos';
      setError(errorMessage);
      
      if (__DEV__) {
        console.warn('[Products] Usando fallback:', errorMessage);
      }
      
      // Fallback para produtos estáticos
      setProducts(getFallbackProducts());
    } finally {
      setLoading(false);
      isLoadingProducts.current = false;
    }
  }, []);

  // Função para carregar categorias da API (com proteção contra loops)
  const loadCategories = useCallback(async () => {
    if (isLoadingCategories.current) return; // Evita requisições duplicadas
    
    try {
      isLoadingCategories.current = true;
      const backendCategories = await getCategories();
      setCategories(backendCategories);
      
      if (__DEV__) {
        console.log(`[Categories] Carregadas ${backendCategories.length} categorias`);
      }
    } catch (err) {
      if (__DEV__) {
        console.warn('[Categories] Usando fallback:', err instanceof Error ? err.message : 'Erro');
      }
      
      // Fallback para categorias padrão
      setCategories(['Drinks']);
    } finally {
      isLoadingCategories.current = false;
    }
  }, []);

  // Effect para carregar dados apenas uma vez
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      loadProducts();
      loadCategories();
    }
  }, [loadProducts, loadCategories]);

  // Função para recarregar dados manualmente
  const refresh = useCallback(() => {
    loadProducts();
    loadCategories();
  }, [loadProducts, loadCategories]);

  return {
    products,
    categories,
    loading,
    error,
    refresh,
  };
};

// Produtos de fallback (dados estáticos)
const getFallbackProducts = (): AdaptedProduct[] => {
  return [
    {
      id: "1",
      title: "Expresso Cappuccino",
      description: ["cappuccino"],
      price: 12.50,
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
      price: 10.50,
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
      price: 8.50,
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
      price: 14.50,
      category: "Drinks",
      cover: require("../../assets/products/cover/Coffe_4.png"),
      thumbnail: require("../../assets/products/thumbnail/Coffe4.png"),
      ingredients: ["Agua", "Leite vaporizado", "Caramelo"],
      available: true,
    },
  ];
};

// Função para organizar produtos por categoria
export const organizeProductsByCategory = (products: AdaptedProduct[], categories: string[]) => {
  return categories.map(category => ({
    title: category,
    data: products.filter(product => product.category === category),
  }));
};

// Tipos exportados para compatibilidade
export type { AdaptedProduct, BackendProduct };
export type ProductProps = AdaptedProduct;
