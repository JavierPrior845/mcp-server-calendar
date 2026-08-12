import { McpTool } from "./index.js";
import { calendarService } from "../services/calendar.service.js";
import { calendarFormatter } from "../formatters/calendar.formatter.js";

export const createEventTool: McpTool = {
  name: "create_event",
  description: "Crea un nuevo evento en Google Calendar.",
  inputSchema: {
    type: "object",
    properties: {
      summary: {
        type: "string",
        description: "Título del evento",
      },
      description: {
        type: "string",
        description: "Descripción del evento (opcional)",
      },
      startTime: {
        type: "string",
        description: "Fecha y hora de inicio en formato ISO 8601 (ej. 2026-08-12T10:00:00+02:00)",
      },
      endTime: {
        type: "string",
        description: "Fecha y hora de fin en formato ISO 8601 (ej. 2026-08-12T11:00:00+02:00)",
      },
    },
    required: ["summary", "startTime", "endTime"],
  },
  handler: async (args: any) => {
    if (!args.summary || !args.startTime || !args.endTime) {
      return {
        content: [{ type: "text", text: "Faltan parámetros obligatorios: summary, startTime, o endTime." }],
        isError: true,
      };
    }

    try {
      const event = await calendarService.createEvent({
        summary: args.summary,
        description: args.description,
        startTime: args.startTime,
        endTime: args.endTime,
      });
      const formatted = calendarFormatter.formatEventCreated(event);
      return {
        content: [{ type: "text", text: formatted }],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error al crear el evento: ${(error as Error).message}` }],
        isError: true,
      };
    }
  }
};
