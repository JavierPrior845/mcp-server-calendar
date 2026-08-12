export interface McpPrompt {
  name: string;
  description: string;
  arguments?: Array<{
    name: string;
    description: string;
    required?: boolean;
  }>;
}

// Registro vacío de prompts para extensión futura
export const prompts: McpPrompt[] = [];
