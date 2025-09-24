import React, { forwardRef } from "react";

import {
  TouchableOpacity,
  TouchableOpacityProps,
  ImageProps,
  ImageSourcePropType,
  View,
  Text,
} from "react-native";

// Importa componente personalizado para imagens de produtos
import { ProductThumbnail, LocalProductImage } from "./product-image";

// Importa função para formatação de moeda
import { formatCurrency } from "@/utils/functions/format-currency";

type ProductDataProps = {
  id: string; // ID do produto
  title: string; // Nome do produto
  description: string | string[]; // Descrição (pode ser string ou array)
  thumbnail: ImageSourcePropType; // Fonte da imagem thumbnail
  price?: number; // Preço do produto (opcional)
  quantity?: number; // Quantidade no carrinho (opcional)
  available?: boolean; // Disponibilidade do produto (opcional)
};

type ProductProps = TouchableOpacityProps & {
  data: ProductDataProps;
};

export const Product = React.memo(forwardRef<
  React.ComponentRef<typeof TouchableOpacity>,
  ProductProps
>(({ data, ...rest }, ref) => {
  // Formata descrição para exibição (converte array em string se necessário)
  const formattedDescription = Array.isArray(data.description)
    ? data.description.join('. ')
    : data.description;

  return (
    <TouchableOpacity
      ref={ref}
      style={{ width: '100%', flexDirection: 'row', alignItems: 'center', paddingBottom: 16 }}
      {...rest}
    >
      <View style={{ flex: 1, marginLeft: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: 'black', fontWeight: '500', fontSize: 16, flex: 1 }}>
            {data.title}
          </Text>
          {data.quantity && (
            <Text style={{ color: 'black', fontWeight: '500', fontSize: 14 }}>
              x {data.quantity}
            </Text>
          )}
        </View>

        {/* Exibe preço se disponível */}
        {data.price && (
          <Text style={{ color: '#f97316', fontWeight: '600', fontSize: 14 }}>
            {formatCurrency(data.price)}
          </Text>
        )}

        <Text style={{ color: 'black', fontSize: 12, lineHeight: 20, marginTop: 2 }}>
          {formattedDescription}
        </Text>

        {/* Indicador de indisponibilidade */}
        {data.available === false && (
          <Text style={{ color: '#ef4444', fontSize: 12, fontWeight: '600', marginTop: 4 }}>
            Indisponível
          </Text>
        )}
      </View>

      {/* Usa componente local para evitar erros de rede */}
      <LocalProductImage
        productId={data.id}
        type="thumbnail"
        style={{ width: 80, height: 80, borderRadius: 6 }}
      />
    </TouchableOpacity>
  );
}));
