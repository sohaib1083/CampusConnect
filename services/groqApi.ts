import axios from 'axios';
import { RAGService } from './ragService';

/**
 * Groq API Configuration with RAG Enhancement
 * Using llama-3.1-8b-instant model with knowledge base integration
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Enhanced System message for CampusConnect AI with RAG context
const SYSTEM_MESSAGE = {
  role: 'system' as const,
  content: `You are CampusConnect AI, an expert student helpdesk assistant for Universiti Putra Malaysia (UPM) universities. You have access to a comprehensive knowledge base about academic rules, registration procedures, examination policies, CGPA requirements, and student services.

INSTRUCTIONS:
1. Always prioritize information from the provided university knowledge base when available
2. Give specific, accurate answers based on the context provided
3. If asked about dates, policies, or procedures, refer to the specific information given
4. Be helpful, friendly, and professional in your responses
5. If information is not in the knowledge base, provide general guidance based on common Malaysian university practices
6. Always mention when students should verify information with their specific university for the most current details

Your expertise covers: Academic policies, Registration procedures, Examination schedules, CGPA calculations, Student services, Campus facilities, Graduation requirements, and General university guidance.`
};

interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Ask Groq AI a question and get a response
 * @param message - User's question
 * @param conversationHistory - Previous messages for context (optional)
 * @returns Promise<string> - AI response text
 */
export async function askGroq(
  message: string,
  conversationHistory: GroqMessage[] = []
): Promise<string> {
  try {
    
    const apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;
    
 if (!apiKey) {
      throw new Error('Groq API key not found. Please add EXPO_PUBLIC_GROQ_API_KEY to your .env file');
    }

    // 🧠 RAG ENHANCEMENT: Get relevant context from knowledge base
    const ragContext = RAGService.getContextForPrompt(message);

    // Enhanced user message with RAG context
    const enhancedUserMessage = `${ragContext}\n\nUser Question: ${message}`;

    // Build messages array with system prompt, history, and enhanced user message
    const messages: GroqMessage[] = [
      SYSTEM_MESSAGE,
      ...conversationHistory,
      {
        role: 'user',
        content: enhancedUserMessage
      }
    ];

    // Make API request to Groq
    const response = await axios.post<GroqResponse>(
      GROQ_API_URL,
      {
        model: 'llama-3.1-8b-instant', // Using working model instead of decommissioned one
        messages: messages,
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1,
        stream: false
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    // Extract the AI's response
    const aiResponse = response.data.choices[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    return aiResponse.trim();

  } catch (error: any) {
    // Handle specific error types
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        const errorMsg = error.response?.data?.error?.message || 'Invalid request';
        throw new Error(`Bad request: ${errorMsg}`);
      } else if (error.response?.status === 401) {
        throw new Error('Invalid API key. Please check your Groq API credentials.');
      } else if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      } else if (error.response?.status === 500) {
        throw new Error('Groq service error. Please try again later.');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please check your connection and try again.');
      }
    }

    // Generic error
    throw new Error('Failed to get response from AI. Please try again.');
  }
}

/**
 * Quick knowledge search without AI processing (faster response)
 * @param query - User's question
 * @returns Promise<string> - Direct knowledge base response
 */
export async function searchKnowledgeBase(query: string): Promise<string> {
  try {
    console.log('📚 Knowledge Base Search:', query);
    
    // Get relevant knowledge from RAG service
    const searchResults = RAGService.searchRelevantKnowledge(query, 3, 0.2);
    
    if (searchResults.length === 0) {
      return "I don't have specific information about that in my knowledge base. Please try asking about academic policies, registration, exams, CGPA requirements, or student services.";
    }
    
    let response = "Based on university policies:\n\n";
    
    searchResults.forEach((result, index) => {
      const { item } = result;
      response += `**${item.topic}** (${item.category}):\n`;
      response += `${item.answer}\n\n`;
    });
    
    response += "💡 *This information is based on general Malaysian university practices. Please verify with your specific institution for the most current details.*";
    
    return response;
    
  } catch (error) {
    console.error('Knowledge base search error:', error);
    return "Sorry, I encountered an error while searching the knowledge base. Please try again.";
  }
}

/**
 * Get quick facts for new users
 */
export function getWelcomeMessage(): string {
  const quickFacts = RAGService.getQuickFacts();
  
  let welcome = "👋 Welcome to CampusConnect AI! I'm here to help with university questions.\n\n";
  welcome += "🎓 **Quick Facts:**\n";
  
  quickFacts.slice(0, 3).forEach((fact, index) => {
    welcome += `${index + 1}. **${fact.topic}**: ${fact.answer.substring(0, 100)}...\n`;
  });
  
  welcome += "\n💬 Ask me about academic policies, registration, exams, CGPA, student services, and more!";
  
  return welcome;
}


// Export message type for use in other files
export type { GroqMessage };
