import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform, Alert, TouchableOpacity, Text } from 'react-native';
import { GiftedChat, IMessage, Send, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { askGroq, GroqMessage, searchKnowledgeBase, getWelcomeMessage } from '@/services/groqApi';
import { useAuth } from '@/contexts/SimpleFirebaseAuthContext';
import { chatLoggingService } from '@/services/chatLoggingService';

/**
 * ChatScreen - Full chat interface using react-native-gifted-chat
 * Connected to Groq API for AI responses
 */
function ChatScreen() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<GroqMessage[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  
  const { user, isAuthenticated } = useAuth();

  // Initialize with enhanced welcome message
  useEffect(() => {
    const welcomeText = isAuthenticated 
      ? `👋 Hello ${user?.displayName || 'Student'}! ${getWelcomeMessage()}`
      : `👋 Hello! I'm CampusConnect AI, your personal student assistant.\n\nPlease login to start chatting and access personalized features.\n\n${getWelcomeMessage()}`;
    
    const welcomeMessage: IMessage = {
      _id: 'welcome',
      text: welcomeText,
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'CampusConnect AI',
        avatar: '🎓',
      },
    };
    
    setMessages([welcomeMessage]);
    
    // Create conversation if user is logged in
    if (isAuthenticated && user && !currentConversationId) {
      createNewConversation();
    }
  }, [isAuthenticated, user]);

  const createNewConversation = async () => {
    if (!user) return;
    
    try {
      const conversationId = await chatLoggingService.createConversation(
        user.uid, 
        `Chat Session - ${new Date().toLocaleDateString()}`
      );
      setCurrentConversationId(conversationId);
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  /**
   * Handle sending user messages
   */
  const onSend = useCallback(async (newMessages: IMessage[] = []) => {
    if (!isAuthenticated) {
      Alert.alert('Please Login', 'You need to be logged in to chat with the AI assistant.');
      return;
    }

    const userMessage = newMessages[0];
    
    // Add user message to chat
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, newMessages)
    );

    // Show typing indicator
    setIsTyping(true);

    try {
      // Get AI response from Groq
      const userText = userMessage.text;
      const startTime = Date.now();
      const aiResponse = await askGroq(userText, conversationHistory);
      const responseTime = Date.now() - startTime;

      // Log the chat message if user is authenticated
      if (user) {
        await chatLoggingService.logChatMessage(
          user.uid,
          userText,
          aiResponse,
          currentConversationId || undefined,
          {
            model: 'llama-3.1-8b-instant',
            responseTime,
          }
        );
      }

      // Update conversation history for context
      setConversationHistory(prev => [
        ...prev,
        { role: 'user', content: userText },
        { role: 'assistant', content: aiResponse }
      ]);

      // Create bot message
      const botMessage: IMessage = {
        _id: Date.now().toString(),
        text: aiResponse,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'CampusConnect AI',
          avatar: '🎓',
        },
      };

      // Add bot message to chat
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, [botMessage])
      );

      // Log interaction for analytics
      console.log('📝 Chat logged:', { userText, aiResponse: aiResponse.substring(0, 50) });

    } catch (error) {
      console.error('Chat error:', error);
      
      // Show error message to user
      const errorMessage: IMessage = {
        _id: Date.now().toString(),
        text: `❌ ${error instanceof Error ? error.message : 'Sorry, I encountered an error. Please try again.'}`,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'CampusConnect AI',
          avatar: '🎓',
        },
      };

      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, [errorMessage])
      );
    } finally {
      setIsTyping(false);
    }
  }, [conversationHistory]);

  /**
   * Quick knowledge base search (faster than full AI processing)
   */
  const handleQuickSearch = async () => {
    Alert.prompt(
      'Quick Search',
      'What would you like to know about?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Search',
          onPress: async (query?: string) => {
            if (!query || query.trim().length === 0) return;
            
            try {
              setIsTyping(true);
              
              // Add user query to chat
              const userMessage: IMessage = {
                _id: Date.now().toString(),
                text: query,
                createdAt: new Date(),
                user: {
                  _id: 1,
                },
              };

              setMessages(previousMessages =>
                GiftedChat.append(previousMessages, [userMessage])
              );
              
              // Get quick response from knowledge base
              const quickResponse = await searchKnowledgeBase(query);
              
              // Add bot response
              const botMessage: IMessage = {
                _id: (Date.now() + 1).toString(),
                text: `⚡ **Quick Search Result**\n\n${quickResponse}`,
                createdAt: new Date(),
                user: {
                  _id: 2,
                  name: 'CampusConnect AI',
                  avatar: '🎓',
                },
              };

              setMessages(previousMessages =>
                GiftedChat.append(previousMessages, [botMessage])
              );
              
            } catch (error) {
              console.error('Quick search error:', error);
              
              const errorMessage: IMessage = {
                _id: Date.now().toString(),
                text: `⚡ Quick Search Error: ${error instanceof Error ? error.message : 'Failed to search knowledge base'}`,
                createdAt: new Date(),
                user: {
                  _id: 2,
                  name: 'CampusConnect AI',
                  avatar: '🎓',
                },
              };

              setMessages(previousMessages =>
                GiftedChat.append(previousMessages, [errorMessage])
              );
            } finally {
              setIsTyping(false);
            }
          }
        }
      ],
      'plain-text'
    );
  };

  /**
   * Customize send button
   */
  const renderSend = (props: any) => {
    return (
      <Send {...props}>
        <View style={styles.sendButton}>
          <FontAwesome name="send" size={20} color="#2563eb" />
        </View>
      </Send>
    );
  };

  /**
   * Customize chat bubbles with rounded corners and soft colors
   */
  const renderBubble = (props: any) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#2563eb',
            borderRadius: 16,
            padding: 4,
          },
          left: {
            backgroundColor: '#f1f5f9',
            borderRadius: 16,
            padding: 4,
          },
        }}
        textStyle={{
          right: {
            color: '#fff',
            fontSize: 16,
            lineHeight: 22,
          },
          left: {
            color: '#1e293b',
            fontSize: 16,
            lineHeight: 22,
          },
        }}
      />
    );
  };

  /**
   * Customize input toolbar
   */
  const renderInputToolbar = (props: any) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={styles.inputToolbar}
        primaryStyle={styles.inputPrimary}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* Quick Search Button */}
      <View style={styles.quickSearchContainer}>
        <TouchableOpacity style={styles.quickSearchButton} onPress={handleQuickSearch}>
          <FontAwesome name="search" size={14} color="#fff" />
          <Text style={styles.quickButtonText}>Quick</Text>
        </TouchableOpacity>
      </View>

      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
        }}
        renderSend={renderSend}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        isTyping={isTyping}
        timeTextStyle={{
          left: { color: '#64748b', fontSize: 12 },
          right: { color: '#e0e7ff', fontSize: 12 },
        }}
      />
      {Platform.OS === 'android' && <KeyboardAvoidingView behavior="padding" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  quickSearchContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1000,
  },
  quickSearchButton: {
    backgroundColor: '#059669',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  quickButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 8,
    width: 40,
    height: 40,
  },
  inputToolbar: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#fff',
    paddingVertical: 4,
  },
  inputPrimary: {
    alignItems: 'center',
  },
});

export default ChatScreen;
