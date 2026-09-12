import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const client = new OpenAI({
  apiKey: process.env.NVIDIA_NIM_API_KEY || '',
  baseURL: process.env.NVIDIA_NIM_BASE_URL || 'https://integrate.api.nvidia.com/v1'
});

const candidates = [
  'meta/llama-3.2-11b-vision-instruct',
  'meta/llama-3.2-90b-vision-instruct',
  'nv-mistralai/mistral-nemo-12b-instruct',
  'nvidia/mistral-nemo-minitron-8b-8k-instruct',
  'ibm/granite-3.0-8b-instruct',
  'google/gemma-3-12b-it',
  'google/gemma-3-4b-it',
  'mistralai/codestral-22b-instruct-v0.1',
  'meta/codellama-70b',
  'meta/llama2-70b'
];

async function checkCandidates() {
  for (const model of candidates) {
    try {
      const res = await client.chat.completions.create({
        model,
        messages: [{ role: 'user', content: 'Say {"status":"ok"}' }],
        max_tokens: 20
      });
      console.log(`✅ WORKING: ${model} -> ${res.choices[0]?.message?.content?.trim()}`);
    } catch (err: any) {
      console.log(`❌ Failed ${model}: ${err.message?.slice(0, 100)}`);
    }
  }
}

checkCandidates();
