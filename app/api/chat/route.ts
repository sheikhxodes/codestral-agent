import { createMistral } from '@ai-sdk/mistral';
import { streamText, tool } from 'ai';
import { Sandbox } from '@e2b/code-interpreter';
import { z } from 'zod';

export const maxDuration = 60;

const codestral = createMistral({
  baseURL: 'https://codestral.mistral.ai/v1',
  apiKey: process.env.MISTRAL_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: codestral('codestral-latest'),
      system: `You are an expert Python developer and data analyst.
You can execute Python code using the execute_python tool.
When users ask you to analyze data, solve problems, or create visualizations:
1. Write clear, well-commented Python code
2. Execute it using the tool
3. Explain the results

Available libraries: pandas, numpy, matplotlib, seaborn, scipy, sklearn.`,
      messages,
      tools: {
        execute_python: tool({
          description: 'Execute Python code in a secure sandbox environment.',
          parameters: z.object({ code: z.string().describe('The Python code to execute') }),
          execute: async ({ code }) => {
            let sandbox: Sandbox | null = null;
            try {
              sandbox = await Sandbox.create();
              const execution = await sandbox.runCode(code);
              const results = execution.results.map((r) => {
                if (r.png) return { type: 'image', data: r.png };
                if (r.text) return { type: 'text', data: r.text };
                return { type: 'data', data: JSON.stringify(r) };
              });
              if (execution.error) {
                return { success: false, error: { name: execution.error.name, message: execution.error.value, traceback: execution.error.traceback } };
              }
              return { success: true, stdout: execution.logs.stdout.join('\n'), stderr: execution.logs.stderr.join('\n'), results };
            } catch (error) {
              return { success: false, error: { name: 'SandboxError', message: error instanceof Error ? error.message : 'Unknown error' } };
            } finally {
              if (sandbox) await sandbox.kill().catch(console.error);
            }
          },
        }),
      },
      maxSteps: 5,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process request' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}