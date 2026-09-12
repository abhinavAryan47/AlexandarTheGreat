import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const client = new OpenAI({
  apiKey: process.env.NVIDIA_NIM_API_KEY || '',
  baseURL: process.env.NVIDIA_NIM_BASE_URL || 'https://integrate.api.nvidia.com/v1'
});

async function test() {
  try {
    console.log('Testing models list...');
    const models = await client.models.list();
    console.log('Found models count:', models.data.length);
    const modelIds = models.data.map((m: any) => m.id);
    console.log('Sample models:', modelIds.slice(0, 10));
    
    // Check if preferred models are available
    const preferred = [
      'meta/llama-3.1-70b-instruct',
      'meta/llama-3.3-70b-instruct',
      'meta/llama-3.1-8b-instruct',
      'mistralai/mixtral-8x7b-instruct-v0.1',
      'nvidia/llama-3.1-nemotron-70b-instruct'
    ];
    
    const matched = preferred.find(p => modelIds.includes(p)) || modelIds[0];
    console.log('Matched model:', matched);

    console.log('Testing chat completion...');
    const response = await client.chat.completions.create({
      model: matched,
      messages: [{ role: 'user', content: 'Say hello in 5 words' }],
      max_tokens: 50
    });
    console.log('Response:', response.choices[0]?.message?.content);
  } catch (err: any) {
    console.error('NIM Test Error:', err.message, err.response?.data || err);
  }
}

test();
