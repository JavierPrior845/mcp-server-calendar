import { McpTool } from "./index.js";
import { calendarService } from "../services/calendar.service.js";
import { calendarFormatter } from "../formatters/calendar.formatter.js";

export const rescheduleEventTool: McpTool = {
  name: "reschedule_event",
  description: "Reprograma o mueve un evento existente a una nueva fecha y hora usando su ID de evento.",
  inputSchema: {
    type: "object",
    properties: {
      eventId: {
        type: "string",
        description: "ID del evento a reprogramar",
      },
      startTime: {
        type: "string",
        description: "Nueva fecha y hora de inicio en formato ISO 8601 (ej. 2026-08-20T16:00:00+02:00)",
      },
      endTime: {
        type: "string",
        description: "Nueva fecha y hora de fin en formato ISO 8601 (ej. 2026-08-20T17:30:00+02:00)",
      },
    },
    required: ["eventId", "startTime", "endTime"],
  },
  handler: async (args: any) => {
    if (!args.eventId || !args.startTime || !args.endTime) {
      return {
        content: [{ type: "text", text: "Faltan parámetros obligatorios: eventId, startTime o endTime." }],
        isError: true,
      };
    }

    try {
      const event = await calendarService.rescheduleEvent({
        eventId: args.eventId,
        startTime: args.startTime,
        endTime: args.endTime,
      });

      const formatted = calendarFormatter.formatEventRescheduled(event);
      return { content: [{ type: "text", text: formatted }] };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error al reprogramar el evento: ${(error as Error).message}` }],
        isError: true,
      };
    }
  },
};
