import AsyncStorage from '@react-native-async-storage/async-storage';

// Chave para armazenar dados do usuário no AsyncStorage
const USER_STORAGE_KEY = '@cafezinho:user';

// Interface para dados do usuário
export interface User {
  id: string; // ID único do usuário
  email: string; // Email do usuário
  name?: string; // Nome do usuário (opcional)
  createdAt?: string; // Data de criação (opcional)
}

// Interface para dados de criação/login de usuário
export interface UserData {
  email: string; // Email para identificação
  name?: string; // Nome do usuário (opcional)
}

// Serviço para criar ou fazer login de usuário (versão local)
export const createOrLoginUser = async (userData: UserData): Promise<User> => {
  try {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 200));

    // Cria usuário local sempre
    const newUser: User = {
      id: generateTempUserId(), // Gera ID temporário
      email: userData.email, // Usa email fornecido
      name: userData.name || 'Cliente', // Usa nome fornecido ou padrão
      createdAt: new Date().toISOString(), // Data atual
    };
    
    await saveUserToStorage(newUser); // Salva usuário no storage local
    
    if (__DEV__) {
      console.log(`[User] Usuário criado localmente: ${newUser.name} (${newUser.id})`);
    }
    
    return newUser; // Retorna usuário criado
  } catch (error) {
    console.error('Erro ao criar usuário local:', error);
    throw new Error('Não foi possível criar usuário');
  }
};

// Função para gerar ID temporário de usuário
const generateTempUserId = (): string => {
  const timestamp = Date.now().toString(); // Timestamp atual
  const random = Math.random().toString(36).substring(2, 8); // String aleatória
  return `user_${timestamp}_${random}`; // Combina timestamp e random
};

// Função para salvar usuário no AsyncStorage
const saveUserToStorage = async (user: User): Promise<void> => {
  try {
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user)); // Salva como JSON
    if (__DEV__) {
      console.log('[User] Usuário salvo no storage local');
    }
  } catch (error) {
    console.error('Erro ao salvar usuário no storage:', error); // Log do erro
    // Não lança erro para não quebrar o fluxo
  }
};

// Função para recuperar usuário do AsyncStorage
export const getUserFromStorage = async (): Promise<User | null> => {
  try {
    const userData = await AsyncStorage.getItem(USER_STORAGE_KEY); // Busca dados
    if (userData) {
      const user = JSON.parse(userData) as User; // Converte de JSON
      if (__DEV__) {
        console.log('[User] Usuário recuperado do storage:', user.name);
      }
      return user; // Retorna usuário encontrado
    }
    return null; // Retorna null se não encontrado
  } catch (error) {
    console.error('Erro ao recuperar usuário do storage:', error); // Log do erro
    return null; // Retorna null em caso de erro
  }
};

// Função para obter ID do usuário atual
export const getCurrentUserId = async (): Promise<string | null> => {
  try {
    const user = await getUserFromStorage(); // Busca usuário no storage
    return user?.id || null; // Retorna ID ou null
  } catch (error) {
    console.error('Erro ao obter ID do usuário atual:', error); // Log do erro
    return null; // Retorna null em caso de erro
  }
};

// Função para limpar dados do usuário (logout)
export const clearUserData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_STORAGE_KEY); // Remove dados do storage
    if (__DEV__) {
      console.log('[User] Dados do usuário limpos');
    }
  } catch (error) {
    console.error('Erro ao limpar dados do usuário:', error); // Log do erro
  }
};

// Função para atualizar dados do usuário
export const updateUser = async (userData: Partial<User>): Promise<User | null> => {
  try {
    const currentUser = await getUserFromStorage(); // Busca usuário atual
    if (!currentUser) {
      throw new Error('Usuário não encontrado');
    }

    const updatedUser: User = {
      ...currentUser, // Mantém dados existentes
      ...userData, // Sobrescreve com novos dados
      updatedAt: new Date().toISOString(), // Adiciona timestamp de atualização
    };

    await saveUserToStorage(updatedUser); // Salva usuário atualizado
    
    if (__DEV__) {
      console.log('[User] Usuário atualizado:', updatedUser.name);
    }
    
    return updatedUser; // Retorna usuário atualizado
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error); // Log do erro
    return null; // Retorna null em caso de erro
  }
};

// Função para verificar se usuário está logado
export const isUserLoggedIn = async (): Promise<boolean> => {
  try {
    const user = await getUserFromStorage(); // Busca usuário no storage
    return user !== null; // Retorna true se usuário existe
  } catch (error) {
    console.error('Erro ao verificar login do usuário:', error); // Log do erro
    return false; // Retorna false em caso de erro
  }
};
