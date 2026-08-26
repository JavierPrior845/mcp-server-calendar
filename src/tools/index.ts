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
import { findFreeSlotsTool } from "./find-free-slots.js";
import { rescheduleEventTool } from "./reschedule-event.js";
import { deleteEventTool } from "./delete-event.js";
import { detectConflictsTool } from "./detect-conflicts.js";
import { workloadAnalyticsTool } from "./workload-analytics.js";

export const tools: McpTool[] = [
  listEventsTool,
  createEventTool,
  findFreeSlotsTool,
  rescheduleEventTool,
  deleteEventTool,
  detectConflictsTool,
  workloadAnalyticsTool,
];
