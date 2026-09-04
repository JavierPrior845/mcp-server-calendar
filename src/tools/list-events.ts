import { McpTool } from "./index.js";
import { calendarService } from "../services/calendar.service.js";
import { calendarFormatter } from "../formatters/calendar.formatter.js";

export const listEventsTool: McpTool = {
  name: "list_events",
  description: "Lista eventos de Google Calendar. Por defecto muestra la semana actual. Puedes especificar un rango de fechas o un solo día.",
  inputSchema: {
    type: "object",
    properties: {
      date: {
        type: "string",
        description: "Fecha específica (YYYY-MM-DD). Si se proporciona, lista eventos de ese día.",
      },
      startDate: {
        type: "string",
        description: "Fecha de inicio del rango (YYYY-MM-DD).",
      },
      endDate: {
        type: "string",
        description: "Fecha de fin del rango (YYYY-MM-DD).",
      },
    },
  },
  handler: async (args: any) => {
    try {
      const events = await calendarService.listEvents({
        date: args.date,
        startDate: args.startDate,
        endDate: args.endDate,
      });
      const formatted = calendarFormatter.formatEventList(events);
      return {
        content: [{ type: "text", text: formatted }],
      };
    } catch (error: any) {
      const detail = error?.response?.data ? JSON.stringify(error.response.data) : (error?.stack || error?.message);
      return {
        content: [{ type: "text", text: `Error al listar eventos: ${error?.message} | Detalle: ${detail}` }],
        isError: true,
      };
    }
  }
};
