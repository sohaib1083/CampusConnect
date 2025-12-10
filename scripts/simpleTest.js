// Simple test script - run with: node scripts/simpleTest.js
require('dotenv').config();
const axios = require('axios');

const apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;

if (!apiKey) {
  console.error('❌ Error: EXPO_PUBLIC_GROQ_API_KEY not found in .env file');
  process.exit(1);
}

console.log('Testing Groq API...\n');

axios.post(
  'https://api.groq.com/openai/v1/chat/completions',
  {
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant.'
      },
      {
        role: 'user',
        content: 'Say hello'
      }
    ],
    temperature: 0.7,
    max_tokens: 100
  },
  {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  }
)
.then(response => {
  console.log('✅ SUCCESS!');
  console.log('Response:', response.data.choices[0].message.content);
  console.log('\nYour API key works! The issue is in the React Native app.\n');
})
.catch(error => {
  console.log('❌ FAILED!');
  if (error.response) {
    console.log('Status:', error.response.status);
    console.log('Error:', JSON.stringify(error.response.data, null, 2));
  } else {
    console.log('Error:', error.message);
  }
});
