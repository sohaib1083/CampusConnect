import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { GiftedChat, IMessage, Send, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { askGroq, GroqMessage } from '@/services/groqApi';

/**
 * ChatScreen - Full chat interface using react-native-gifted-chat
 * Connected to Groq API for AI responses
 */
export default function ChatScreen() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<GroqMessage[]>([]);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: IMessage = {
      _id: 'welcome',
      text: '👋 Hello! I\'m CampusConnect AI, your personal student assistant.\n\nI can help you with:\n• Academic rules & policies\n• Registration dates & deadlines\n• Exam schedules & information\n• CGPA calculation & grading\n• General university guidance\n\nWhat would you like to know?',
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'CampusConnect AI',
        avatar: '🎓',
      },
    };
    
    setMessages([welcomeMessage]);
  }, []);

  /**
   * Handle sending user messages
   */
  const onSend = useCallback(async (newMessages: IMessage[] = []) => {
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
      const aiResponse = await askGroq(userText, conversationHistory);

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
