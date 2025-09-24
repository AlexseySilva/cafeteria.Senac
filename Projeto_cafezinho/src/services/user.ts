import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

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

// Serviço para criar ou fazer login de usuário
export const createOrLoginUser = async (userData: UserData): Promise<User> => {
  try {
    // Primeiro tenta fazer login/buscar usuário existente
    const response = await api.post('/session', userData);
    return response.data; // Retorna dados do usuário
  } catch (error) {
    console.error('Erro ao fazer login/criar usuário:', error); // Log do erro
    
    // Se usuário não existe, cria um novo (simulação)
    if (error.response?.status === 404) {
      // Para este projeto, vamos criar um usuário temporário local
      const tempUser: User = {
        id: generateTempUserId(), // Gera ID temporário
        email: userData.email, // Usa email fornecido
        name: userData.name || 'Cliente', // Usa nome fornecido ou padrão
        createdAt: new Date().toISOString(), // Data atual
      };
      
      await saveUserToStorage(tempUser); // Salva usuário no storage local
      return tempUser; // Retorna usuário criado
    }
    
    throw new Error('Não foi possível fazer login'); // Erro genérico
  }
};

// Função para gerar ID temporário de usuário
const generateTempUserId = (): string => {
  const timestamp = Date.now().toString(); // Timestamp atual
  const random = Math.floor(Math.random() * 1000).toString(); // Número aleatório
  return `temp_${timestamp}_${random}`; // ID temporário único
};

// Função para salvar usuário no AsyncStorage
export const saveUserToStorage = async (user: User): Promise<void> => {
  try {
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user)); // Salva como JSON
    console.log('Usuário salvo no storage:', user.email); // Log de sucesso
  } catch (error) {
    console.error('Erro ao salvar usuário no storage:', error); // Log do erro
  }
};

// Função para recuperar usuário do AsyncStorage
export const getUserFromStorage = async (): Promise<User | null> => {
  try {
    const userData = await AsyncStorage.getItem(USER_STORAGE_KEY); // Busca dados do storage
    
    if (userData) {
      const user = JSON.parse(userData) as User; // Converte JSON para objeto
      console.log('Usuário recuperado do storage:', user.email); // Log de sucesso
      return user; // Retorna usuário encontrado
    }
    
    return null; // Retorna null se não encontrado
  } catch (error) {
    console.error('Erro ao recuperar usuário do storage:', error); // Log do erro
    return null; // Retorna null em caso de erro
  }
};

// Função para remover usuário do AsyncStorage (logout)
export const removeUserFromStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_STORAGE_KEY); // Remove dados do storage
    console.log('Usuário removido do storage'); // Log de sucesso
  } catch (error) {
    console.error('Erro ao remover usuário do storage:', error); // Log do erro
  }
};

// Função para verificar se usuário está logado
export const isUserLoggedIn = async (): Promise<boolean> => {
  const user = await getUserFromStorage(); // Busca usuário no storage
  return user !== null; // Retorna true se usuário existe
};

// Função para obter ID do usuário atual
export const getCurrentUserId = async (): Promise<string | null> => {
  const user = await getUserFromStorage(); // Busca usuário no storage
  return user?.id || null; // Retorna ID ou null
};

// Função para atualizar dados do usuário
export const updateUser = async (userData: Partial<UserData>): Promise<User | null> => {
  try {
    const currentUser = await getUserFromStorage(); // Busca usuário atual
    
    if (!currentUser) {
      throw new Error('Usuário não encontrado'); // Erro se não logado
    }
    
    // Atualiza dados do usuário
    const updatedUser: User = {
      ...currentUser, // Mantém dados existentes
      ...userData, // Aplica atualizações
    };
    
    await saveUserToStorage(updatedUser); // Salva usuário atualizado
    return updatedUser; // Retorna usuário atualizado
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error); // Log do erro
    return null; // Retorna null em caso de erro
  }
};
