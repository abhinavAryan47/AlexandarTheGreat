import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const client = new OpenAI({
  apiKey: process.env.NVIDIA_NIM_API_KEY || '',
  baseURL: process.env.NVIDIA_NIM_BASE_URL || 'https://integrate.api.nvidia.com/v1'
});

async function findWorkingModel() {
  const models = await client.models.list();
  const modelIds = models.data.map((m: any) => m.id);
  console.log('Total models:', modelIds.length);
  
  // Popular instruction models to test first
  const candidates = [
    'meta/llama-3.3-70b-instruct',
    'meta/llama-3.1-70b-instruct',
    'meta/llama-3.1-8b-instruct',
    'meta/llama3-70b-instruct',
    'meta/llama3-8b-instruct',
    'mistralai/mistral-7b-instruct-v0.3',
    'mistralai/mistral-large-2-instruct',
    'mistralai/mixtral-8x7b-instruct-v0.1',
    'mistralai/mixtral-8x22b-instruct-v0.1',
    'qwen/qwen2.5-72b-instruct',
    'deepseek-ai/deepseek-r1',
    'deepseek-ai/deepseek-v3',
    ...modelIds
  ];

  const uniqueCandidates = [...new Set(candidates)].filter(id => modelIds.includes(id));

  for (const model of uniqueCandidates) {
    try {
      console.log(`Trying ${model}...`);
      const res = await client.chat.completions.create({
        model,
        messages: [{ role: 'user', content: 'Say OK' }],
        max_tokens: 10
      });
      console.log(`✅ SUCCESS with ${model}:`, res.choices[0]?.message?.content);
      return model;
    } catch (err: any) {
      console.log(`❌ Failed ${model}: ${err.message?.slice(0, 80)}`);
    }
  }
}

findWorkingModel();
