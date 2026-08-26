import { McpTool } from "./index.js";
import { calendarService } from "../services/calendar.service.js";
import { calendarFormatter } from "../formatters/calendar.formatter.js";

export const deleteEventTool: McpTool = {
  name: "delete_or_cancel_event",
  description: "Elimina o cancela un evento del calendario usando su ID.",
  inputSchema: {
    type: "object",
    properties: {
      eventId: {
        type: "string",
        description: "ID del evento a eliminar",
      },
    },
    required: ["eventId"],
  },
  handler: async (args: any) => {
    if (!args.eventId) {
      return {
        content: [{ type: "text", text: "Falta el parámetro obligatorio: eventId." }],
        isError: true,
      };
    }

    try {
      await calendarService.deleteOrCancelEvent({ eventId: args.eventId });
      const formatted = calendarFormatter.formatEventDeleted(args.eventId);
      return { content: [{ type: "text", text: formatted }] };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error al eliminar el evento: ${(error as Error).message}` }],
        isError: true,
      };
    }
  },
};
