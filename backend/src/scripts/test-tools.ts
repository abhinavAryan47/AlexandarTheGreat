import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const client = new OpenAI({
  apiKey: process.env.NVIDIA_NIM_API_KEY || '',
  baseURL: process.env.NVIDIA_NIM_BASE_URL || 'https://integrate.api.nvidia.com/v1'
});

async function testToolCalling() {
  try {
    const res = await client.chat.completions.create({
      model: 'meta/llama-3.2-11b-vision-instruct',
      messages: [{ role: 'user', content: 'What is the profile for student ID stud-101-aarav-cse?' }],
      tools: [
        {
          type: 'function',
          function: {
            name: 'get_student_profile',
            description: 'Get profile details for a student',
            parameters: {
              type: 'object',
              properties: {
                studentId: { type: 'string', description: 'The student ID' }
              },
              required: ['studentId']
            }
          }
        }
      ],
      tool_choice: 'auto'
    });

    console.log('Choice message:', JSON.stringify(res.choices[0]?.message, null, 2));
  } catch (err: any) {
    console.error('Tool calling test error:', err.message);
  }
}

testToolCalling();
