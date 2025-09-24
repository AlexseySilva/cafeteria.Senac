import { create } from "zustand";

// Importa tipos de produtos da API
import { ProductProps } from "@/utils/data/products-api";

import * as cartInMemory from "./helpers/cart-in-memory";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { createJSONStorage, persist } from "zustand/middleware";

// Tipo para produto no carrinho (inclui quantidade e preço)
export type productCartProps = ProductProps & {
  quantity: number;
  price: number; // Adiciona preço obrigatório para cálculos
};

type StateProps = {
  products: productCartProps[]; // Array de produtos no carrinho
  add: (product: ProductProps) => void; // Função para adicionar produto
  remove: (productId: string) => void; // Função para remover produto
  clear: () => void; // Função para limpar carrinho
  getTotalPrice: () => number; // Função para calcular preço total
  getTotalItems: () => number; // Função para contar total de itens
};

export const useCartStore = create(
  persist<StateProps>(
    (set, get) => ({
      products: [], // Array de produtos no carrinho

      // Função para adicionar produto ao carrinho
      add: (product: ProductProps) =>
        set((state) => ({
          products: cartInMemory.add(state.products, product),
        })),

      // Função para remover produto do carrinho
      remove: (productId: string) =>
        set((state) => ({
          products: cartInMemory.remove(state.products, productId),
        })),

      // Função para limpar todo o carrinho
      clear: () => set(() => ({ products: [] })),

      // Função para calcular preço total do carrinho
      getTotalPrice: () => {
        const { products } = get(); // Obtém produtos atuais
        return products.reduce((total, product) => {
          return total + (product.price * product.quantity); // Soma preço * quantidade
        }, 0);
      },

      // Função para contar total de itens no carrinho
      getTotalItems: () => {
        const { products } = get(); // Obtém produtos atuais
        return products.reduce((total, product) => {
          return total + product.quantity; // Soma todas as quantidades
        }, 0);
      },
    }),
    {
      name: "cafezinho:cart", // Nome único para o storage
      storage: createJSONStorage(() => AsyncStorage), // Usa AsyncStorage para persistência
    }
  )
);
