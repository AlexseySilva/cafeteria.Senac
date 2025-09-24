import { View, Text, FlatList, SectionList, ActivityIndicator, Alert } from "react-native";
import { Header } from "@/components/header";
import { CategoryButton } from "@/components/category-button";

// Importa hook personalizado para produtos (versão local sem rede)
import { useProducts, organizeProductsByCategory, ProductProps } from "@/utils/data/products-local";

import { Product } from "@/components/products";

import { useState, useRef, useEffect } from "react";

import { Link } from "expo-router";

import { useCartStore } from "@/stores/cart-store";

export default function Home() {
  const cartStore = useCartStore();

  // Hook para gerenciar produtos da API
  const { products, categories, loading, error, refresh } = useProducts();

  // Estado para categoria selecionada (usa primeira categoria disponível)
  const [category, setCategory] = useState<string>('');

  const sectionListRef = useRef<SectionList<ProductProps>>(null);

  const cartQuantityItems = cartStore.products.reduce(
    (total, product) => total + product.quantity,
    0
  );

  // Effect para definir categoria inicial quando categorias carregam 
  useEffect(() => {
    if (categories.length > 0 && !category) {
      setCategory(categories[0]); // Define primeira categoria como padrão
    }
  }, [categories, category]);

  function handleCategorySelect(selectedCategory: string) {
    setCategory(selectedCategory);

    // Encontra índice da categoria selecionada no array de categorias da API
    const sectionIndex = categories.findIndex(
      (cat) => cat === selectedCategory
    );

    if (sectionListRef.current && sectionIndex >= 0) {
      sectionListRef.current.scrollToLocation({
        animated: true,
        sectionIndex,
        itemIndex: 0,
      });
    }
  }

  // Função para lidar com erro de carregamento
  const handleRetry = () => {
    Alert.alert(
      'Recarregar Produtos',
      'Deseja tentar carregar os produtos novamente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Tentar Novamente', onPress: refresh }
      ]
    );
  };

  // Organiza produtos por categoria para exibição
  const menuSections = organizeProductsByCategory(products, categories);

  // Exibe indicador de carregamento enquanto busca dados
  if (loading) {
    return (
      <View style={{ flex: 1, paddingTop: 32, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#C7410B" />
        <Text style={{ color: 'white', marginTop: 16 }}>Carregando produtos...</Text>
      </View>
    );
  }

  // Exibe mensagem de erro com opção de tentar novamente
  if (error) {
    return (
      <View style={{ flex: 1, paddingTop: 32, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }}>
        <Text style={{ color: 'white', textAlign: 'center', marginBottom: 16 }}>
          Erro ao carregar produtos: {error}
        </Text>
        <Text
          style={{ color: '#f97316', textAlign: 'center', textDecorationLine: 'underline' }}
          onPress={handleRetry}
        >
          Tentar Novamente
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, paddingTop: 32 }}>
      <Header title="Faça um pedido" cartQuantityItem={cartQuantityItems} />

      {/* Lista de categorias - só exibe se há categorias carregadas */}
      {categories.length > 0 && (
        <FlatList
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <CategoryButton
              title={item}
              isSelected={item === category}
              onPress={() => handleCategorySelect(item)}
            />
          )}
          horizontal
          style={{ maxHeight: 40, marginTop: 20 }}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingHorizontal: 20 }}
        />
      )}

      {/* Lista de produtos organizados por categoria */}
      <SectionList
        ref={sectionListRef}
        sections={menuSections}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        renderItem={({ item }) => (
          <Link href={`/product/${item.id}`} asChild>
            <Product data={item} />
          </Link>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold', marginTop: 32, marginBottom: 12 }}>
            {title}
          </Text>
        )}
        style={{ flex: 1, padding: 20 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        // Adiciona pull-to-refresh para recarregar produtos
        refreshing={loading}
        onRefresh={refresh}
      />
    </View>
  );
}
