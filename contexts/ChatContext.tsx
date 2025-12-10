import React, { createContext, useContext, useState, ReactNode } from 'react';
import { IMessage } from 'react-native-gifted-chat';
import { chatService } from '@/services/chatService';

interface ChatContextType {
  messages: IMessage[];
  isTyping: boolean;
  sendMessage: (text: string) => Promise<void>;
  loadHistory: () => Promise<void>;
  clearHistory: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (text: string) => {
    try {
      setIsTyping(true);
      
      // Add user message
      const userMessage: IMessage = {
        _id: Date.now().toString(),
        text,
        createdAt: new Date(),
        user: { _id: 1 },
      };
      
      setMessages((prev) => [userMessage, ...prev]);

      // Get bot response
      const response = await chatService.sendMessage({ text });
      
      // Add bot message
      const botMessage: IMessage = {
        _id: (Date.now() + 1).toString(),
        text: response.message,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Campus Bot',
          avatar: '🎓',
        },
      };
      
      setMessages((prev) => [botMessage, ...prev]);
    } catch (error) {
      console.error('Send message failed:', error);
      // Add error message
      const errorMessage: IMessage = {
        _id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Campus Bot',
          avatar: '🎓',
        },
      };
      setMessages((prev) => [errorMessage, ...prev]);
    } finally {
      setIsTyping(false);
    }
  };

  const loadHistory = async () => {
    try {
      const history = await chatService.getChatHistory('user-id'); // TODO: Get actual user ID
      setMessages(history);
    } catch (error) {
      console.error('Load history failed:', error);
    }
  };

  const clearHistory = async () => {
    try {
      await chatService.clearChatHistory('user-id'); // TODO: Get actual user ID
      setMessages([]);
    } catch (error) {
      console.error('Clear history failed:', error);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        isTyping,
        sendMessage,
        loadHistory,
        clearHistory,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
