import OpenAI from 'openai';
import { nimClient, NimClient } from './nim.client';
import { CAMPUS_AGENT_SYSTEM_PROMPT } from './prompts/campus-agent.prompt';
import { studentRepository, StudentRepository } from '../repositories/student.repository';
import { taskRepository, TaskRepository } from '../repositories/task.repository';
import { opportunityRepository, OpportunityRepository } from '../repositories/opportunity.repository';
import { opportunityService, OpportunityService } from '../services/opportunity.service';
import { TaskPriority } from '../models/task.model';

export interface AgentChatResult {
  message: string;
  toolCallsExecuted: Array<{
    tool: string;
    args: Record<string, any>;
    result: any;
  }>;
}

export class CampusAgentService {
  constructor(
    private nim: NimClient = nimClient,
    private studentRepo: StudentRepository = studentRepository,
    private taskRepo: TaskRepository = taskRepository,
    private oppRepo: OpportunityRepository = opportunityRepository,
    private oppService: OpportunityService = opportunityService
  ) {}

  private getToolDefinitions(): OpenAI.ChatCompletionTool[] {
    return [
      {
        type: 'function',
        function: {
          name: 'get_student_profile',
          description: 'Fetch the student profile including year, branch, CGPA, academic and placement interests.',
          parameters: {
            type: 'object',
            properties: {
              studentId: { type: 'string', description: 'The unique ID of the student' }
            },
            required: ['studentId']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'get_upcoming_tasks',
          description: 'Fetch all pending and upcoming tasks, deadlines, and priorities for the student.',
          parameters: {
            type: 'object',
            properties: {
              studentId: { type: 'string', description: 'The unique ID of the student' }
            },
            required: ['studentId']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'search_opportunities',
          description: 'Search campus opportunities by category (placement, scholarship, event, academic, exam) or get all.',
          parameters: {
            type: 'object',
            properties: {
              category: {
                type: 'string',
                description: 'Optional category filter (placement, scholarship, event, academic)'
              }
            }
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'check_eligibility',
          description: 'Evaluate whether a student is eligible for an opportunity and calculate relevance score.',
          parameters: {
            type: 'object',
            properties: {
              studentId: { type: 'string', description: 'The unique ID of the student' },
              opportunityId: { type: 'string', description: 'The unique ID of the opportunity' }
            },
            required: ['studentId', 'opportunityId']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'create_task',
          description: 'Create and schedule a new actionable task for the student in their planner.',
          parameters: {
            type: 'object',
            properties: {
              studentId: { type: 'string', description: 'The unique ID of the student' },
              title: { type: 'string', description: 'Actionable task title' },
              deadline: { type: 'string', description: 'Optional ISO 8601 deadline' },
              description: { type: 'string', description: 'Optional detailed description' },
              priority: {
                type: 'string',
                enum: ['low', 'medium', 'high', 'critical'],
                description: 'Task urgency/priority level'
              }
            },
            required: ['studentId', 'title']
          }
        }
      }
    ];
  }

  private async executeTool(name: string, args: Record<string, any>): Promise<any> {
    switch (name) {
      case 'get_student_profile': {
        const student = await this.studentRepo.getById(args.studentId);
        return student || { error: `Student with id ${args.studentId} not found` };
      }
      case 'get_upcoming_tasks': {
        const tasks = await this.taskRepo.findByStudentId(args.studentId);
        return { tasks, total: tasks.length };
      }
      case 'search_opportunities': {
        const opportunities = await this.oppRepo.getAll();
        if (args.category) {
          const filtered = opportunities.filter(
            (o) => o.category.toLowerCase() === args.category.toLowerCase()
          );
          return { opportunities: filtered, total: filtered.length };
        }
        return { opportunities, total: opportunities.length };
      }
      case 'check_eligibility': {
        const result = await this.oppService.evaluateForStudent(args.opportunityId, args.studentId);
        return result || { error: 'Could not evaluate eligibility. Check IDs.' };
      }
      case 'create_task': {
        const task = await this.taskRepo.create({
          studentId: args.studentId,
          title: args.title,
          deadline: args.deadline,
          description: args.description,
          status: 'pending',
          priority: (args.priority as TaskPriority) || 'medium'
        });
        return { success: true, task };
      }
      default:
        return { error: `Unknown tool function: ${name}` };
    }
  }

  async chat(studentId: string, userMessage: string): Promise<AgentChatResult> {
    if (!this.nim.isConfigured()) {
      throw new Error('NVIDIA NIM API key is not configured in backend/.env.');
    }

    const model = await this.nim.getActiveModel();
    const tools = this.getToolDefinitions();

    const messages: OpenAI.ChatCompletionMessageParam[] = [
      { role: 'system', content: CAMPUS_AGENT_SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Current Student ID: "${studentId}"\n\nStudent Query: ${userMessage}`
      }
    ];

    const toolCallsExecuted: Array<{
      tool: string;
      args: Record<string, any>;
      result: any;
    }> = [];

    // Up to 3 tool-calling iterations for multi-step reasoning
    for (let i = 0; i < 3; i++) {
      const completion = await this.nim.completeChat(messages, {
        model,
        tools,
        tool_choice: 'auto',
        temperature: 0.2
      });

      const choice = completion.choices[0];
      const assistantMessage = choice?.message;

      if (!assistantMessage) {
        break;
      }

      // If the model called tools
      if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
        messages.push({
          role: 'assistant',
          content: assistantMessage.content || null,
          tool_calls: assistantMessage.tool_calls
        });

        for (const toolCall of assistantMessage.tool_calls) {
          if (toolCall.type !== 'function') continue;
          const fnName = toolCall.function.name;
          let parsedArgs: Record<string, any> = {};
          try {
            parsedArgs = JSON.parse(toolCall.function.arguments);
          } catch {
            parsedArgs = {};
          }

          // Ensure studentId is injected if missing
          if (!parsedArgs.studentId && studentId) {
            parsedArgs.studentId = studentId;
          }

          console.log(`[CampusAgent] Executing tool '${fnName}' with args:`, parsedArgs);
          const toolResult = await this.executeTool(fnName, parsedArgs);
          toolCallsExecuted.push({
            tool: fnName,
            args: parsedArgs,
            result: toolResult
          });

          messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify(toolResult)
          });
        }
      } else {
        // Model provided final answer
        return {
          message: assistantMessage.content || 'I have reviewed your campus records.',
          toolCallsExecuted
        };
      }
    }

    // Final response generation if loop ended
    const finalCompletion = await this.nim.completeChat(messages, {
      model,
      temperature: 0.2
    });

    return {
      message: finalCompletion.choices[0]?.message?.content || 'I have processed your request.',
      toolCallsExecuted
    };
  }
}

export const campusAgentService = new CampusAgentService();
