import OpenAI from 'openai';
import { ENV } from '../config/env';

export class NimClient {
  private client: OpenAI | null = null;
  private cachedModel: string | null = null;

  constructor() {
    this.initClient();
  }

  private initClient(): void {
    if (ENV.NVIDIA_NIM_API_KEY && ENV.NVIDIA_NIM_API_KEY.trim() !== '') {
      this.client = new OpenAI({
        apiKey: ENV.NVIDIA_NIM_API_KEY,
        baseURL: ENV.NVIDIA_NIM_BASE_URL
      });
    } else {
      this.client = null;
    }
  }

  isConfigured(): boolean {
    return Boolean(ENV.NVIDIA_NIM_API_KEY && ENV.NVIDIA_NIM_API_KEY.trim() !== '');
  }

  getClient(): OpenAI {
    if (!this.client) {
      this.initClient();
    }
    if (!this.client) {
      throw new Error('NVIDIA_NIM_API_KEY is not configured in backend environment.');
    }
    return this.client;
  }

  async getActiveModel(): Promise<string> {
    if (this.cachedModel) {
      return this.cachedModel;
    }

    if (ENV.NVIDIA_NIM_MODEL && ENV.NVIDIA_NIM_MODEL.trim() !== '') {
      this.cachedModel = ENV.NVIDIA_NIM_MODEL;
      return this.cachedModel;
    }

    // Default high-performance model on NVIDIA NIM
    this.cachedModel = 'meta/llama-3.2-11b-vision-instruct';
    return this.cachedModel;
  }

  async completeChat(
    messages: OpenAI.ChatCompletionMessageParam[],
    options: Partial<OpenAI.ChatCompletionCreateParamsNonStreaming> = {}
  ): Promise<OpenAI.ChatCompletion> {
    const client = this.getClient();
    const model = options.model || (await this.getActiveModel());

    try {
      const response = await client.chat.completions.create({
        model,
        messages,
        temperature: options.temperature ?? 0.1,
        max_tokens: options.max_tokens ?? 2048,
        ...options
      });
      return response;
    } catch (error: any) {
      console.error(`[NimClient] Chat completion failed for model ${model}:`, error.message);
      throw error;
    }
  }
}

export const nimClient = new NimClient();
