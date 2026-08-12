export interface McpTool {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, any>;
    required?: string[];
  };
  handler: (args: any) => Promise<{
    content: Array<{ type: "text"; text: string }>;
    isError?: boolean;
  }>;
}

import { listEventsTool } from "./list-events.js";
import { createEventTool } from "./create-event.js";

export const tools: McpTool[] = [
  listEventsTool,
  createEventTool
];
