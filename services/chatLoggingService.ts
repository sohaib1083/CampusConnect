import { collection, addDoc, query, where, orderBy, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';

export interface ChatMessage {
  id?: string;
  userId: string;
  message: string;
  response: string;
  timestamp: Date;
  conversationId?: string;
  messageType: 'user' | 'ai';
  metadata?: {
    model?: string;
    responseTime?: number;
    tokenUsage?: {
      prompt: number;
      completion: number;
      total: number;
    };
  };
}

export interface ChatConversation {
  id?: string;
  userId: string;
  title: string;
  createdAt: Date;
  lastMessageAt: Date;
  messageCount: number;
}

class ChatLoggingService {
  private readonly MESSAGES_COLLECTION = 'chatMessages';
  private readonly CONVERSATIONS_COLLECTION = 'chatConversations';

  /**
   * Log a chat message and AI response
   */
  async logChatMessage(
    userId: string,
    userMessage: string,
    aiResponse: string,
    conversationId?: string,
    metadata?: ChatMessage['metadata']
  ): Promise<string> {
    try {
      const messageData = {
        userId,
        message: userMessage,
        response: aiResponse,
        timestamp: serverTimestamp(),
        conversationId: conversationId || null,
        messageType: 'user' as const,
        metadata: metadata || null,
      };

      const docRef = await addDoc(collection(db, this.MESSAGES_COLLECTION), messageData);
      
      // Update conversation if provided
      if (conversationId) {
        await this.updateConversationLastMessage(conversationId);
      }

      return docRef.id;
    } catch (error) {
      console.error('Error logging chat message:', error);
      throw error;
    }
  }

  /**
   * Create a new conversation
   */
  async createConversation(userId: string, title: string): Promise<string> {
    try {
      const conversationData = {
        userId,
        title,
        createdAt: serverTimestamp(),
        lastMessageAt: serverTimestamp(),
        messageCount: 0,
      };

      const docRef = await addDoc(collection(db, this.CONVERSATIONS_COLLECTION), conversationData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  /**
   * Get user's chat history
   */
  async getUserChatHistory(userId: string, limit?: number): Promise<ChatMessage[]> {
    try {
      let q = query(
        collection(db, this.MESSAGES_COLLECTION),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc')
      );

      if (limit) {
        q = query(q, orderBy('timestamp', 'desc'));
      }

      const querySnapshot = await getDocs(q);
      const messages: ChatMessage[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        messages.push({
          id: doc.id,
          userId: data.userId,
          message: data.message,
          response: data.response,
          timestamp: data.timestamp?.toDate() || new Date(),
          conversationId: data.conversationId,
          messageType: data.messageType,
          metadata: data.metadata,
        });
      });

      return messages;
    } catch (error) {
      console.error('Error fetching chat history:', error);
      throw error;
    }
  }

  /**
   * Get messages from a specific conversation
   */
  async getConversationMessages(conversationId: string): Promise<ChatMessage[]> {
    try {
      const q = query(
        collection(db, this.MESSAGES_COLLECTION),
        where('conversationId', '==', conversationId),
        orderBy('timestamp', 'asc')
      );

      const querySnapshot = await getDocs(q);
      const messages: ChatMessage[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        messages.push({
          id: doc.id,
          userId: data.userId,
          message: data.message,
          response: data.response,
          timestamp: data.timestamp?.toDate() || new Date(),
          conversationId: data.conversationId,
          messageType: data.messageType,
          metadata: data.metadata,
        });
      });

      return messages;
    } catch (error) {
      console.error('Error fetching conversation messages:', error);
      throw error;
    }
  }

  /**
   * Get user's conversations
   */
  async getUserConversations(userId: string): Promise<ChatConversation[]> {
    try {
      const q = query(
        collection(db, this.CONVERSATIONS_COLLECTION),
        where('userId', '==', userId),
        orderBy('lastMessageAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const conversations: ChatConversation[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        conversations.push({
          id: doc.id,
          userId: data.userId,
          title: data.title,
          createdAt: data.createdAt?.toDate() || new Date(),
          lastMessageAt: data.lastMessageAt?.toDate() || new Date(),
          messageCount: data.messageCount || 0,
        });
      });

      return conversations;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  }

  /**
   * Update conversation's last message timestamp
   */
  private async updateConversationLastMessage(conversationId: string): Promise<void> {
    try {
      // This would require additional Firestore operation to increment message count
      // and update lastMessageAt. For simplicity, we'll skip this in the basic implementation
      // In production, you might want to use Firestore Functions for this
    } catch (error) {
      console.error('Error updating conversation:', error);
    }
  }

  /**
   * Search chat messages
   */
  async searchChatMessages(userId: string, searchTerm: string): Promise<ChatMessage[]> {
    try {
      // Note: Firestore doesn't support full-text search natively
      // This is a basic implementation. For production, consider using Algolia or similar
      const messages = await this.getUserChatHistory(userId);
      
      return messages.filter(
        message => 
          message.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message.response.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching messages:', error);
      throw error;
    }
  }

  /**
   * Get chat analytics for user
   */
  async getChatAnalytics(userId: string): Promise<{
    totalMessages: number;
    totalConversations: number;
    averageMessagesPerConversation: number;
    mostRecentActivity: Date | null;
  }> {
    try {
      const messages = await this.getUserChatHistory(userId);
      const conversations = await this.getUserConversations(userId);

      return {
        totalMessages: messages.length,
        totalConversations: conversations.length,
        averageMessagesPerConversation: conversations.length > 0 ? messages.length / conversations.length : 0,
        mostRecentActivity: messages.length > 0 ? messages[0].timestamp : null,
      };
    } catch (error) {
      console.error('Error getting chat analytics:', error);
      throw error;
    }
  }
}

export const chatLoggingService = new ChatLoggingService();