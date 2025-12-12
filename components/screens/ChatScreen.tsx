import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform, Alert, View, Text } from 'react-native';
import { GiftedChat, IMessage, Send, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { askGroq, GroqMessage } from '@/services/groqApi';
import { useAuth } from '@/contexts/SimpleFirebaseAuthContext';
import { chatLoggingService } from '@/services/chatLoggingService';
import { Theme } from '@/constants/Theme';

/**
 * Modern ChatScreen - Beautiful AI chat interface with gradient design
 * Connected to Groq API for AI responses with complete chat logging
 */
const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<GroqMessage[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  
  const { user, isAuthenticated } = useAuth();

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: IMessage = {
      _id: 'welcome',
      text: isAuthenticated 
        ? `👋 Hello ${user?.displayName || 'Student'}! I'm CampusConnect AI, your personal student assistant.\n\nI can help you with:\n• Academic rules & policies\n• Registration dates & deadlines\n• Exam schedules & information\n• CGPA calculation & grading\n• General university guidance\n\nWhat would you like to know?`
        : '👋 Hello! I\'m CampusConnect AI, your personal student assistant.\n\nPlease login to start chatting and access personalized features.\n\nI can help you with:\n• Academic rules & policies\n• Registration dates & deadlines\n• Exam schedules & information\n• CGPA calculation & grading\n• General university guidance',
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
            model: 'llama-3.3-70b-versatile',
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
  }, [conversationHistory, isAuthenticated, user, currentConversationId]);

  /**
   * Customize send button with gradient background
   */
  const renderSend = (props: any) => {
    return (
      <Send {...props}>
        <View style={styles.sendButtonContainer}>
          <LinearGradient
            colors={[Theme.colors.primary, Theme.colors.secondary] as [string, string]}
            style={styles.sendButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="send" size={20} color={Theme.colors.textInverse} />
          </LinearGradient>
        </View>
      </Send>
    );
  };

  /**
   * Customize chat bubbles with modern design
   */
  const renderBubble = (props: any) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: Theme.colors.primary,
            borderRadius: Theme.borderRadius.xl,
            padding: Theme.spacing.xs,
            marginVertical: Theme.spacing.xs,
            ...Theme.shadows.sm,
          },
          left: {
            backgroundColor: Theme.colors.surface,
            borderRadius: Theme.borderRadius.xl,
            padding: Theme.spacing.xs,
            marginVertical: Theme.spacing.xs,
            borderWidth: 1,
            borderColor: Theme.colors.border,
          },
        }}
        textStyle={{
          right: {
            color: Theme.colors.textInverse,
            fontSize: Theme.typography.body1.fontSize,
            lineHeight: Theme.typography.body1.lineHeight,
            fontWeight: Theme.typography.body1.fontWeight,
          },
          left: {
            color: Theme.colors.text,
            fontSize: Theme.typography.body1.fontSize,
            lineHeight: Theme.typography.body1.lineHeight,
            fontWeight: Theme.typography.body1.fontWeight,
          },
        }}
      />
    );
  };

  /**
   * Customize input toolbar with modern styling
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
      {/* Chat Interface */}
      <View style={styles.chatContainer}>
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
            left: { color: Theme.colors.textSecondary, fontSize: Theme.typography.caption.fontSize },
            right: { color: Theme.colors.textInverse, fontSize: Theme.typography.caption.fontSize, opacity: 0.8 },
          }}
        />
        {Platform.OS === 'android' && <KeyboardAvoidingView behavior="padding" />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    paddingTop: 45,
    paddingBottom: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
    ...Theme.shadows.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuButton: {
    padding: Theme.spacing.sm,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Theme.typography.h3.fontSize,
    fontWeight: Theme.typography.h3.fontWeight,
    color: Theme.colors.textInverse,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: Theme.typography.caption.fontSize,
    fontWeight: Theme.typography.caption.fontWeight,
    color: Theme.colors.textInverse,
    opacity: 0.9,
  },
  statusIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
  },
  onlineIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: Theme.colors.textInverse,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  sendButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.sm,
  },
  inputToolbar: {
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
    backgroundColor: Theme.colors.surface,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    minHeight: 60,
  },
  inputPrimary: {
    alignItems: 'center',
  },
});

export default ChatScreen;