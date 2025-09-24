import { Image, Text, View, ActivityIndicator, Alert } from "react-native";
import { LocalProductImage } from "@/components/product-image";

import { useLocalSearchParams, useNavigation, Redirect } from "expo-router";

// Importa serviços locais para buscar produto específico (sem rede)
import { getProductById, AdaptedProduct } from "@/utils/data/products-local";

import { formatCurrency } from "@/utils/functions/format-currency";

import { Button } from "@/components/button";

import { Feather } from "@expo/vector-icons";

import { LinkButton } from "@/components/link-button";

import { useCartStore } from "@/stores/cart-store";

import { useState, useEffect } from "react";

export default function Product() {
  const cartStore = useCartStore();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();

  // Estados para gerenciar produto da API
  const [product, setProduct] = useState<AdaptedProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Effect para carregar produto quando componente monta
  useEffect(() => {
    loadProduct();
  }, [id]);

  // Função para carregar produto (local, sem rede)
  const loadProduct = () => {
    if (!id || typeof id !== 'string') {
      setError('ID do produto inválido');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const foundProduct = getProductById(id); // Busca produto local

      if (foundProduct) {
        setProduct(foundProduct); // Define produto no estado
        if (__DEV__) {
          console.log(`[Product] Produto carregado: ${foundProduct.title}`); // Log de sucesso
        }
      } else {
        setError('Produto não encontrado');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage); // Define erro no estado
      if (__DEV__) {
        console.error('[Product] Erro ao carregar produto:', errorMessage); // Log do erro
      }
    } finally {
      setLoading(false); // Finaliza carregamento
    }
  };

  function handleAddToCart() {
    if (!product) return; // Verifica se produto existe

    cartStore.add(product); // Adiciona produto ao carrinho
    navigation.goBack(); // Volta para tela anterior
  }

  // Exibe indicador de carregamento
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#C7410B" />
        <Text className="text-black mt-4">Carregando produto...</Text>
      </View>
    );
  }

  // Exibe mensagem de erro
  if (error || !product) {
    return (
      <View className="flex-1 justify-center items-center px-8">
        <Text className="text-black text-center mb-4">
          {error || 'Produto não encontrado'}
        </Text>
        <LinkButton title="Voltar ao cardápio" href={"/"} />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <LocalProductImage
        productId={product.id}
        type="cover"
        className="w-full h-52"
        resizeMode="cover"
      />

      <View className="p-5 mt-8 flex-1">
        <Text className="text-black text-xl font-heading">{product.title}</Text>

        {/* Exibe preço se disponível */}
        {product.price && (
          <Text className="text-orange-500 text-lg font-semibold mb-2">
            {formatCurrency(product.price)}
          </Text>
        )}

        {/* Exibe descrição como array ou string */}
        <Text className="text-black font-body text-base leading-6 mb-6">
          {Array.isArray(product.description)
            ? product.description.join('. ')
            : product.description}
        </Text>

        {/* Lista de ingredientes */}
        {product.ingredients && product.ingredients.length > 0 && (
          <>
            <Text className="text-black font-heading text-lg mb-2">Ingredientes:</Text>
            {product.ingredients.map((ingredient, index) => (
              <Text
                key={`${ingredient}-${index}`}
                className="text-black font-body text-base leading-6"
              >
                {"\u2022"} {ingredient}
              </Text>
            ))}
          </>
        )}

        {/* Indicador de disponibilidade */}
        {!product.available && (
          <Text className="text-red-500 font-semibold mt-4">
            Produto temporariamente indisponível
          </Text>
        )}
      </View>

      <View className="p-5 pb-8 gap-5 items-center">
        <Button
          onPress={handleAddToCart}
          className="w-[90%] self-center"
          disabled={!product.available} // Desabilita se produto indisponível
        >
          <Button.Icon>
            <Feather name="plus-circle" size={20} />
          </Button.Icon>
          <Button.Text>
            {product.available ? 'Adicionar ao pedido' : 'Indisponível'}
          </Button.Text>
        </Button>

        <LinkButton title="Voltar ao cardápio" href={"/"} />
      </View>
    </View>
  );
}
