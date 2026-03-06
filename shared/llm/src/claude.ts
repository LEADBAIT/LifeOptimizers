import Anthropic from "@anthropic-ai/sdk";

export interface AskOptions {
  /** Model to use. Defaults to claude-sonnet-4-6. */
  model?: string;
  /** Max tokens in the response. Defaults to 1024. */
  maxTokens?: number;
  /** System prompt to prepend. */
  system?: string;
}

/**
 * Creates and returns an Anthropic client instance.
 * Reads ANTHROPIC_API_KEY from the environment.
 */
export function createClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set in the environment.");
  }
  return new Anthropic({ apiKey });
}

/**
 * Sends a prompt to Claude and returns the text response.
 *
 * @param prompt - The user message to send.
 * @param options - Optional model, maxTokens, and system prompt overrides.
 * @returns The assistant's text reply.
 */
export async function ask(
  prompt: string,
  options: AskOptions = {}
): Promise<string> {
  const {
    model = "claude-sonnet-4-6",
    maxTokens = 1024,
    system,
  } = options;

  const client = createClient();

  const response = await client.messages.create({
    model,
    max_tokens: maxTokens,
    ...(system ? { system } : {}),
    messages: [{ role: "user", content: prompt }],
  });

  const block = response.content[0];
  if (block.type !== "text") {
    throw new Error(`Unexpected response content type: ${block.type}`);
  }

  return block.text;
}
