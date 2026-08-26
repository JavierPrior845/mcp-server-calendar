import { McpTool } from "./index.js";
import { calendarService } from "../services/calendar.service.js";
import { calendarFormatter } from "../formatters/calendar.formatter.js";

export const workloadAnalyticsTool: McpTool = {
  name: "get_workload_analytics",
  description: "Analiza la distribución del tiempo agendado en un período y genera métricas sobre cuántas horas se han dedicado a cada área.",
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
      const analytics = await calendarService.getWorkloadAnalytics({
        startDate: args.startDate,
        endDate: args.endDate,
      });

      const formatted = calendarFormatter.formatWorkloadAnalytics(analytics);
      return { content: [{ type: "text", text: formatted }] };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error al calcular analytics de carga de trabajo: ${(error as Error).message}` }],
        isError: true,
      };
    }
  },
};
