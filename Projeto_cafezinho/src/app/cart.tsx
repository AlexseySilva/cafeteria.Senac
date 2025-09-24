import { View, Text, ScrollView, Alert, Linking, ActivityIndicator } from "react-native";

import { Header } from "@/components/header";

import { productCartProps, useCartStore } from "@/stores/cart-store";

import { Product } from "@/components/products";

import { formatCurrency } from "@/utils/functions/format-currency";

import { Input } from "@/components/input";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { Button } from "@/components/button";

import { Feather } from "@expo/vector-icons";

import { LinkButton } from "@/components/link-button";

import { useState, useEffect } from "react";

import { useNavigation } from "expo-router";

// Importa serviços para pedidos e usuários (versão local)
import { createOrder, convertCartItemsToOrderItems, validateOrderData } from "@/services/orders-local";
import { getCurrentUserId, getUserFromStorage, createOrLoginUser } from "@/services/user-local";

const PHONE_NUMBER = "5519988414402";

export default function Cart() {
  const [address, setAddress] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const cartStore = useCartStore();
  const navigation = useNavigation();

  // Calcula total usando função do store
  const total = formatCurrency(cartStore.getTotalPrice());

  // Effect para carregar dados do usuário
  useEffect(() => {
    loadUserData();
  }, []);

  // Função para carregar dados do usuário
  const loadUserData = async () => {
    try {
      const user = await getUserFromStorage(); // Busca usuário salvo
      if (user) {
        setUserId(user.id); // Define ID do usuário
        setCustomerName(user.name || ''); // Define nome se disponível
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error); // Log do erro
    }
  };

  function handleProductRemove(product: productCartProps) {
    Alert.alert("Remover", `Deseja remover ${product.title} do carrinho?`, [
      {
        text: "Cancelar",
      },
      {
        text: "Remover",
        onPress: () => cartStore.remove(product.id),
      },
    ]);
  }

  // Função para criar usuário se necessário
  const ensureUserExists = async (): Promise<string> => {
    if (userId) {
      return userId; // Retorna ID existente
    }

    // Se não há usuário, cria um temporário
    if (!customerName.trim()) {
      throw new Error('Nome do cliente é obrigatório');
    }

    const user = await createOrLoginUser({
      email: `cliente_${Date.now()}@temp.com`, // Email temporário
      name: customerName.trim(),
    });

    setUserId(user.id); // Salva ID do usuário criado
    return user.id;
  };

  // Função para processar pedido (integração com backend)
  async function handleOrder() {
    // Validações básicas
    if (cartStore.products.length === 0) {
      return Alert.alert("Atenção", "Carrinho está vazio!");
    }

    if (!customerName.trim()) {
      return Alert.alert("Atenção", "Nome do cliente é obrigatório!");
    }

    if (address.trim().length === 0) {
      return Alert.alert("Atenção", "Endereço de entrega é obrigatório!");
    }

    try {
      setLoading(true); // Inicia carregamento

      if (__DEV__) {
        console.log('[Cart] Iniciando criação de pedido...');
        console.log('[Cart] Itens no carrinho:', cartStore.products.length);
      }

      // Garante que usuário existe
      const currentUserId = await ensureUserExists();

      if (__DEV__) {
        console.log('[Cart] Usuário garantido:', currentUserId);
      }

      // Converte itens do carrinho para formato do backend
      const orderItems = convertCartItemsToOrderItems(cartStore.products);

      if (__DEV__) {
        console.log('[Cart] Itens convertidos:', orderItems);
      }

      // Dados do pedido
      const orderData = {
        user_id: currentUserId,
        items: orderItems,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim() || undefined,
        notes: `Entregar em: ${address.trim()}`, // Endereço nas observações
      };

      if (__DEV__) {
        console.log('[Cart] Dados do pedido:', orderData);
      }

      // Valida dados antes de enviar
      const validationErrors = validateOrderData(orderData);
      if (validationErrors.length > 0) {
        if (__DEV__) {
          console.log('[Cart] Erros de validação:', validationErrors);
        }
        return Alert.alert("Erro de Validação", validationErrors.join('\n'));
      }

      if (__DEV__) {
        console.log('[Cart] Criando pedido...');
      }

      // Cria pedido (local)
      const createdOrder = await createOrder(orderData);

      if (__DEV__) {
        console.log('[Cart] Pedido criado com sucesso:', createdOrder.orderNumber);
      }

      // Sucesso - mostra confirmação
      Alert.alert(
        "Pedido Criado!",
        `Seu pedido ${createdOrder.orderNumber} foi criado com sucesso!\n\nTotal: ${formatCurrency(createdOrder.totalAmount)}`,
        [
          {
            text: "Enviar por WhatsApp",
            onPress: () => sendWhatsAppMessage(createdOrder),
          },
          {
            text: "OK",
            onPress: () => {
              cartStore.clear(); // Limpa carrinho
              navigation.goBack(); // Volta para tela anterior
            },
          },
        ]
      );

    } catch (error) {
      console.error('Erro ao criar pedido:', error); // Log do erro

      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      Alert.alert("Erro", `Não foi possível criar o pedido: ${errorMessage}`);
    } finally {
      setLoading(false); // Finaliza carregamento
    }
  }

  // Função para enviar mensagem via WhatsApp (mantém funcionalidade original)
  function sendWhatsAppMessage(order: any) {
    const products = cartStore.products
      .map((product) => `\n ${product.quantity}x ${product.title} - ${formatCurrency(product.price)}`)
      .join("");

    const message = `
🍔 NOVO PEDIDO #${order.orderNumber}

👤 Cliente: ${customerName}
📱 Telefone: ${customerPhone || 'Não informado'}
📍 Entregar em: ${address}

📋 Itens:${products}

💰 Valor total: ${formatCurrency(order.totalAmount)}`;

    Linking.openURL(
      `http://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${encodeURIComponent(message)}`
    );

    cartStore.clear(); // Limpa carrinho após envio
    navigation.goBack(); // Volta para tela anterior
  }

  return (
    <View style={{ flex: 1, paddingTop: 32 }}>
      <KeyboardAwareScrollView
        showsHorizontalScrollIndicator={false}
        extraHeight={100}
      >
        <Header title="Seu Carrinho" />
        <ScrollView>
          <View style={{ padding: 20, flex: 1 }}>
            {cartStore.products.length > 0 ? (
              <View style={{ borderBottomWidth: 1, borderBottomColor: '#e2e8f0' }}>
                {cartStore.products.map((product) => (
                  <Product
                    key={product.id}
                    data={product}
                    onPress={() => handleProductRemove(product)}
                  />
                ))}
              </View>
            ) : (
              <Text style={{ textAlign: 'center', marginVertical: 32, color: '#000' }}>
                Seu carrinho está vazio
              </Text>
            )}

            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 20, marginBottom: 16 }}>
              <Text style={{ color: 'white', fontSize: 20, fontWeight: '600' }}>Total</Text>
              <Text style={{ color: '#84cc16', fontSize: 24, fontWeight: 'bold' }}>
                {total}
              </Text>
            </View>

            {/* Campos de informações do cliente */}
            <View style={{ gap: 12, marginBottom: 16 }}>
              <Input
                placeholder="Nome completo do cliente *"
                value={customerName}
                onChangeText={setCustomerName}
                returnKeyType="next"
              />

              <Input
                placeholder="Telefone do cliente (opcional)"
                value={customerPhone}
                onChangeText={setCustomerPhone}
                keyboardType="phone-pad"
                returnKeyType="next"
              />

              <Input
                placeholder="Endereço completo de entrega *"
                value={address}
                onChangeText={setAddress}
                onSubmitEditing={handleOrder}
                submitBehavior="blurAndSubmit"
                returnKeyType="send"
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>

      <View style={{ padding: 20, gap: 20 }}>
        <Button
          onPress={handleOrder}
          disabled={loading || cartStore.products.length === 0}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <>
              <Button.Text>
                {cartStore.products.length === 0 ? 'Carrinho vazio' : 'Criar pedido'}
              </Button.Text>
              <Button.Icon>
                <Feather name="arrow-right-circle" size={20} />
              </Button.Icon>
            </>
          )}
        </Button>

        <LinkButton title="Voltar ao cardápio" href={"/"} />
      </View>
    </View>
  );
}
