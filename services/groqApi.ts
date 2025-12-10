import axios from 'axios';

/**
 * Groq API Configuration
 * Using llama-3.3-70b-versatile model (Dec 2025)
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// System message for CampusConnect AI
const SYSTEM_MESSAGE = {
  role: 'system' as const,
  content: `You are CampusConnect AI, a student helpdesk assistant for academic rules, registration dates, exam info, CGPA policies, and general university guidance. Always answer clearly and accurately based on Malaysian university practices.`
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
    // Get API key from environment
    const apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;
    
    if (!apiKey) {
      throw new Error('Groq API key not found. Please add EXPO_PUBLIC_GROQ_API_KEY to your .env file');
    }

    // Build messages array with system prompt, history, and current message
    const messages: GroqMessage[] = [
      SYSTEM_MESSAGE,
      ...conversationHistory,
      {
        role: 'user',
        content: message
      }
    ];

    console.log('Sending request to Groq API...');

    // Make API request to Groq
    const response = await axios.post<GroqResponse>(
      GROQ_API_URL,
      {
        model: 'llama-3.3-70b-versatile',
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

    // Log token usage for monitoring
    console.log('✅ Groq API success:', response.data.usage);

    return aiResponse.trim();

  } catch (error) {
    console.error('❌ Groq API Error:', error);

    // Handle specific error types
    if (axios.isAxiosError(error)) {
      // Log detailed error information
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }

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
 * Alternative function using llama3-70b model for higher quality responses
 * @param message - User's question
 * @param conversationHistory - Previous messages for context (optional)
 * @returns Promise<string> - AI response text
 */
export async function askGroqPro(
  message: string,
  conversationHistory: GroqMessage[] = []
): Promise<string> {
  try {
    const apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;
    
    if (!apiKey) {
      throw new Error('Groq API key not found');
    }

    const messages: GroqMessage[] = [
      SYSTEM_MESSAGE,
      ...conversationHistory,
      {
        role: 'user',
        content: message
      }
    ];

    const response = await axios.post<GroqResponse>(
      GROQ_API_URL,
      {
        model: 'llama-3.3-70b-versatile', // High quality model
        messages: messages,
        temperature: 0.7,
        max_tokens: 2048, // More tokens for detailed responses
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

    const aiResponse = response.data.choices[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    console.log('Groq Pro API usage:', response.data.usage);

    return aiResponse.trim();

  } catch (error) {
    console.error('Groq Pro API Error:', error);
    throw new Error('Failed to get response from AI. Please try again.');
  }
}

// Export message type for use in other files
export type { GroqMessage };
