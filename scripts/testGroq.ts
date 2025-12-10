/**
 * Test script to verify Groq API connection
 * Run with: npx ts-node scripts/testGroq.ts
 */

import axios from 'axios';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

async function testGroqAPI() {
  console.log('🧪 Testing Groq API connection...\n');

  // Read API key from environment
  const apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;

  if (!apiKey) {
    console.error('❌ Error: EXPO_PUBLIC_GROQ_API_KEY not found in .env file');
    console.log('\nPlease ensure your .env file contains:');
    console.log('EXPO_PUBLIC_GROQ_API_KEY=gsk_your_key_here\n');
    return;
  }

  console.log('✓ API key found:', apiKey.substring(0, 10) + '...\n');

  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant.'
          },
          {
            role: 'user',
            content: 'Say hello in one sentence.'
          }
        ],
        temperature: 0.7,
        max_tokens: 100,
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

    console.log('✅ SUCCESS! Groq API is working!\n');
    console.log('Response:', response.data.choices[0].message.content);
    console.log('\nToken usage:', response.data.usage);
    console.log('\n✨ Your app is ready to use Groq API!\n');

  } catch (error: any) {
    console.error('❌ FAILED! Error connecting to Groq API\n');
    
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Error:', error.response.data);
        
        if (error.response.status === 400) {
          console.log('\n💡 Bad Request - Check your request format');
        } else if (error.response.status === 401) {
          console.log('\n💡 Invalid API Key - Check your EXPO_PUBLIC_GROQ_API_KEY');
          console.log('Get a new key at: https://console.groq.com/keys');
        } else if (error.response.status === 429) {
          console.log('\n💡 Rate Limit - Wait a moment and try again');
        }
      } else {
        console.error('Error:', error.message);
      }
    } else {
      console.error('Error:', error);
    }
  }
}

testGroqAPI();
