// Importa tipos de produtos da API
import { ProductProps } from "@/utils/data/products-api";

import { productCartProps } from "../cart-store";

// Função para adicionar produto ao carrinho
export function add(products: productCartProps[], newProduct: ProductProps) {
  const existingProduct = products.find(({ id }) => newProduct.id === id);

  // Se produto já existe no carrinho, incrementa quantidade
  if (existingProduct) {
    return products.map((product) =>
      product.id === existingProduct.id
        ? { ...product, quantity: product.quantity + 1 }
        : product
    );
  }

  // Se produto não existe, adiciona com quantidade 1 e preço
  return [...products, {
    ...newProduct,
    quantity: 1,
    price: newProduct.price || 0 // Garante que preço seja definido
  }];
}

// Função para remover produto do carrinho (decrementa quantidade)
export function remove(products: productCartProps[], productRemoveId: string) {
  const updatedProducts = products.map((product) =>
    product.id === productRemoveId
      ? {
          ...product,
          quantity: product.quantity > 1 ? product.quantity - 1 : 0,
        }
      : product
  );

  // Remove produtos com quantidade zero
  return updatedProducts.filter((product) => product.quantity > 0);
}
