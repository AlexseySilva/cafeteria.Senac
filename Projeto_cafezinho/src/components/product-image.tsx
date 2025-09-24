import React, { useState, useCallback, useMemo } from 'react';
import { Image, ImageProps, ImageSourcePropType } from 'react-native';

// Interface para props do componente ProductImage
interface ProductImageProps extends Omit<ImageProps, 'source'> {
  source: ImageSourcePropType; // Fonte da imagem (pode ser URI ou require)
  fallbackSource?: ImageSourcePropType; // Imagem de fallback opcional
  productId?: string; // ID do produto para fallback automático
}

// Array de imagens de fallback padrão
const defaultFallbacks = [
  require('../assets/products/cover/Coffe_1.png'),
  require('../assets/products/cover/Coffe_2.png'),
  require('../assets/products/cover/Coffe_3.png'),
  require('../assets/products/cover/Coffe_4.png'),
];

// Função para obter fallback baseado no ID do produto
const getFallbackByProductId = (productId: string): ImageSourcePropType => {
  // Usa hash simples do ID para escolher imagem consistentemente
  const hash = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = hash % defaultFallbacks.length; // Garante índice válido
  return defaultFallbacks[index];
};

// Componente para exibir imagens de produtos com fallback automático
export function ProductImage({
  source,
  fallbackSource,
  productId,
  onError,
  ...props
}: ProductImageProps) {
  const [hasError, setHasError] = useState(false); // Estado para controlar erro de carregamento

  // Memoiza a função de erro para evitar re-criações desnecessárias
  const handleError = useCallback((error: any) => {
    // Log simplificado apenas com a mensagem de erro relevante (apenas em desenvolvimento)
    if (__DEV__) {
      const errorMessage = error?.nativeEvent?.error || 'Erro ao carregar imagem';
      console.warn('[ProductImage] Fallback para imagem local:', errorMessage);
    }
    setHasError(true); // Marca que houve erro

    if (onError) {
      onError(error); // Chama callback de erro se fornecido
    }
  }, [onError]);

  // Memoiza a função de sucesso para evitar re-criações desnecessárias
  const handleLoad = useCallback(() => {
    setHasError(false); // Garante que não há erro
  }, []);

  // Memoiza a fonte da imagem para evitar mudanças desnecessárias
  const imageSource = useMemo((): ImageSourcePropType => {
    // Se houve erro, usa fallback
    if (hasError) {
      // Prioridade: fallbackSource > fallback por ID > primeiro fallback padrão
      if (fallbackSource) {
        return fallbackSource;
      }
      if (productId) {
        return getFallbackByProductId(productId);
      }
      return defaultFallbacks[0]; // Usa primeira imagem como último recurso
    }

    // Se não houve erro, usa fonte original
    return source;
  }, [hasError, source, fallbackSource, productId]);

  return (
    <Image
      {...props} // Espalha todas as outras props
      source={imageSource} // Usa fonte memoizada
      onError={handleError} // Configura handler de erro memoizado
      onLoad={handleLoad} // Configura handler de sucesso memoizado
    />
  );
}

// Componente específico para thumbnail de produtos
export function ProductThumbnail(props: ProductImageProps) {
  return (
    <ProductImage
      {...props}
      style={[
        { width: 100, height: 100, borderRadius: 8 }, // Estilo padrão para thumbnail
        props.style, // Permite override do estilo
      ]}
    />
  );
}

// Componente específico para capa de produtos
export function ProductCover(props: ProductImageProps) {
  return (
    <ProductImage
      {...props}
      style={[
        { width: '100%', height: 200 }, // Estilo padrão para capa
        props.style, // Permite override do estilo
      ]}
      resizeMode="cover" // Modo de redimensionamento padrão
    />
  );
}

// Componente que força uso de imagens locais (sem tentar carregar URLs)
export function LocalProductImage({ productId, type = 'thumbnail', ...props }: {
  productId: string;
  type?: 'cover' | 'thumbnail';
} & Omit<ProductImageProps, 'source' | 'productId'>) {
  // Usa diretamente a imagem de fallback sem tentar carregar URL
  const localImage = useMemo(() => {
    const hash = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const imageArray = type === 'cover' ? defaultFallbacks : defaultFallbacks;
    const index = hash % imageArray.length;
    return imageArray[index];
  }, [productId, type]);

  return (
    <Image
      {...props}
      source={localImage}
    />
  );
}
