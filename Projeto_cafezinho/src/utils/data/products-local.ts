import { useState, useEffect } from 'react';

// Tipo para produto adaptado (compatível com o frontend)
export interface AdaptedProduct {
  id: string;
  title: string;
  description: string | string[];
  price: number;
  category: string;
  ingredients: string[];
  cover: any;
  thumbnail: any;
  available: boolean;
}

// Hook que usa apenas dados locais (sem requisições de rede)
export const useProducts = () => {
  const [products, setProducts] = useState<AdaptedProduct[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simula carregamento rápido
    const timer = setTimeout(() => {
      setProducts(getLocalProducts());
      setCategories(['Drinks']);
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const refresh = () => {
    setLoading(true);
    setTimeout(() => {
      setProducts(getLocalProducts());
      setCategories(['Drinks']);
      setLoading(false);
    }, 100);
  };

  return {
    products,
    categories,
    loading,
    error,
    refresh,
  };
};

// Produtos locais (sem requisições de rede)
const getLocalProducts = (): AdaptedProduct[] => {
  return [
    {
      id: "1",
      title: "Expresso Cappuccino",
      description: ["Café cremoso com espuma de leite"],
      price: 8.50,
      category: "Drinks",
      cover: require("../../assets/products/cover/Coffe_1.png"),
      thumbnail: require("../../assets/products/thumbnail/Coffe1.png"),
      ingredients: ["Espresso", "Leite", "Espuma de leite"],
      available: true,
    },
    {
      id: "2",
      title: "Expresso Latte",
      description: ["Café cremoso com leite vaporizado"],
      price: 7.50,
      category: "Drinks",
      cover: require("../../assets/products/cover/Coffe_2.png"),
      thumbnail: require("../../assets/products/thumbnail/Coffe2.png"),
      ingredients: ["Espresso", "Leite vaporizado"],
      available: true,
    },
    {
      id: "3",
      title: "Expresso Americano",
      description: ["Café americano tradicional"],
      price: 6.00,
      category: "Drinks",
      cover: require("../../assets/products/cover/Coffe_3.png"),
      thumbnail: require("../../assets/products/thumbnail/Coffe3.png"),
      ingredients: ["Espresso", "Água quente"],
      available: true,
    },
    {
      id: "4",
      title: "Expresso Mocha",
      description: ["Café com chocolate"],
      price: 9.00,
      category: "Drinks",
      cover: require("../../assets/products/cover/Coffe_4.png"),
      thumbnail: require("../../assets/products/thumbnail/Coffe4.png"),
      ingredients: ["Espresso", "Chocolate", "Leite vaporizado"],
      available: true,
    },
  ];
};

// Função para buscar produto por ID (local)
export const getProductById = (id: string): AdaptedProduct | undefined => {
  const products = getLocalProducts();
  return products.find(product => product.id === id);
};

// Função para organizar produtos por categoria
export const organizeProductsByCategory = (products: AdaptedProduct[], categories: string[]) => {
  return categories.map(category => ({
    title: category,
    data: products.filter(product => product.category === category),
  }));
};

// Tipos exportados para compatibilidade
export type ProductProps = AdaptedProduct;
