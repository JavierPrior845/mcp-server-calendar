import { McpTool } from "./index.js";
import { calendarService } from "../services/calendar.service.js";
import { calendarFormatter } from "../formatters/calendar.formatter.js";

export const detectConflictsTool: McpTool = {
  name: "detect_conflicts",
  description: "Examina el calendario para detectar solapamientos y conflictos de horario entre eventos.",
  inputSchema: {
    type: "object",
    properties: {
      startDate: {
        type: "string",
        description: "Fecha de inicio del rango (YYYY-MM-DD, opcional)",
      },
      endDate: {
        type: "string",
        description: "Fecha de fin del rango (YYYY-MM-DD, opcional)",
      },
    },
  },
  handler: async (args: any) => {
    try {
      const conflicts = await calendarService.detectConflicts({
        startDate: args.startDate,
        endDate: args.endDate,
      });

      const formatted = calendarFormatter.formatConflicts(conflicts);
      return { content: [{ type: "text", text: formatted }] };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error al detectar conflictos: ${(error as Error).message}` }],
        isError: true,
      };
    }
  },
};
