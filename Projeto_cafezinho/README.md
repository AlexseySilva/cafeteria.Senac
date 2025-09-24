# ☕ Cafeteria Senac - App Mobile

Um aplicativo mobile de cafeteria desenvolvido com React Native e Expo, criado como projeto educacional para o Senac.

## 📱 Sobre o Projeto

Este é um aplicativo de delivery de cafeteria que permite aos usuários:
- Visualizar cardápio de produtos
- Adicionar itens ao carrinho
- Fazer pedidos
- Interface moderna e responsiva

## 🛠️ Tecnologias Utilizadas

- **React Native** - Framework para desenvolvimento mobile
- **Expo** - Plataforma de desenvolvimento
- **TypeScript** - Linguagem de programação
- **Expo Router** - Navegação
- **Zustand** - Gerenciamento de estado
- **Axios** - Requisições HTTP

## 🚀 Como Executar

### Pré-requisitos
- Node.js instalado
- Expo CLI
- Expo Go (no celular) ou emulador

### Instalação
```bash
# Clone o repositório
git clone https://github.com/AlexseySilva/cafeteria.Senac.git

# Entre no diretório
cd cafeteria.Senac

# Instale as dependências
npm install

# Execute o projeto
npx expo start
```

### 📱 Executando no Celular
1. Instale o **Expo Go** na Play Store ou App Store
2. Execute `npx expo start`
3. Escaneie o QR code que aparece no terminal

### 🌐 Executando no Navegador
- Acesse: http://localhost:8081

## 🏗️ Estrutura do Projeto

```
src/
├── app/                 # Páginas da aplicação
├── components/          # Componentes reutilizáveis
├── stores/             # Gerenciamento de estado
├── utils/              # Utilitários e helpers
└── assets/             # Imagens e recursos
```

## 🎯 Funcionalidades

- ✅ Listagem de produtos por categoria
- ✅ Carrinho de compras
- ✅ Cálculo de totais
- ✅ Interface responsiva
- ✅ Navegação fluida
- ✅ Gerenciamento de estado

## 🔧 Backend

O projeto inclui um backend simples em Node.js/Express para servir os dados dos produtos.

### Executando o Backend
```bash
cd aircnc_backend-main
npm install
node simple-server.js
```

O servidor estará disponível em: http://localhost:3335

## 📝 Licença

Este projeto foi desenvolvido para fins educacionais no Senac.

## 👨‍💻 Desenvolvedor

**Alexsey Silva**
- GitHub: [@AlexseySilva](https://github.com/AlexseySilva)

---

Desenvolvido com ❤️ para o Senac
