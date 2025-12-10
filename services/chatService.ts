import apiClient from './api';
import { IMessage } from 'react-native-gifted-chat';

export interface ChatMessage {
  text: string;
  userId?: string;
  context?: string;
}

export interface ChatResponse {
  message: string;
  suggestions?: string[];
  category?: string;
}

export const chatService = {
  sendMessage: async (message: ChatMessage): Promise<ChatResponse> => {
    try {
      const response = await apiClient.post('/chat/message', message);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getChatHistory: async (userId: string, limit: number = 50): Promise<IMessage[]> => {
    try {
      const response = await apiClient.get(`/chat/history/${userId}`, {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  saveChatMessage: async (message: IMessage): Promise<void> => {
    try {
      await apiClient.post('/chat/save', message);
    } catch (error) {
      throw error;
    }
  },

  clearChatHistory: async (userId: string): Promise<void> => {
    try {
      await apiClient.delete(`/chat/history/${userId}`);
    } catch (error) {
      throw error;
    }
  },

  getQuickReplies: async (): Promise<string[]> => {
    try {
      const response = await apiClient.get('/chat/quick-replies');
      return response.data;
    } catch (error) {
      return [
        'Tell me about courses',
        'Upcoming events',
        'Campus facilities',
        'Academic calendar',
      ];
    }
  },
};
