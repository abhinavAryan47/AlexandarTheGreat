import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const client = new OpenAI({
  apiKey: process.env.NVIDIA_NIM_API_KEY || '',
  baseURL: process.env.NVIDIA_NIM_BASE_URL || 'https://integrate.api.nvidia.com/v1'
});

async function listAll() {
  const models = await client.models.list();
  console.log(JSON.stringify(models.data.map((m: any) => m.id), null, 2));
}

listAll();
