import { McpTool } from "./index.js";
import { calendarService } from "../services/calendar.service.js";
import { calendarFormatter } from "../formatters/calendar.formatter.js";

export const findFreeSlotsTool: McpTool = {
  name: "find_free_slots",
  description: "Busca ventanas de tiempo libres disponibles en el calendario respetando una duración requerida y una franja horaria laboral opcional.",
  inputSchema: {
    type: "object",
    properties: {
      startDate: {
        type: "string",
        description: "Fecha de inicio del rango (YYYY-MM-DD)",
      },
      endDate: {
        type: "string",
        description: "Fecha de fin del rango (YYYY-MM-DD)",
      },
      durationMinutes: {
        type: "number",
        description: "Duración mínima en minutos que debe tener el hueco libre (ej. 60 para 1 hora)",
      },
      startHour: {
        type: "number",
        description: "Hora de inicio de la jornada diaria (ej. 9 para las 09:00, opcional, por defecto 9)",
      },
      endHour: {
        type: "number",
        description: "Hora de fin de la jornada diaria (ej. 21 para las 21:00, opcional, por defecto 21)",
      },
    },
    required: ["startDate", "endDate", "durationMinutes"],
  },
  handler: async (args: any) => {
    if (!args.startDate || !args.endDate || typeof args.durationMinutes !== 'number') {
      return {
        content: [{ type: "text", text: "Faltan parámetros obligatorios: startDate, endDate o durationMinutes." }],
        isError: true,
      };
    }

    try {
      const slots = await calendarService.findFreeSlots({
        startDate: args.startDate,
        endDate: args.endDate,
        durationMinutes: args.durationMinutes,
        startHour: args.startHour,
        endHour: args.endHour,
      });

      const formatted = calendarFormatter.formatFreeSlots(slots, args.durationMinutes);
      return { content: [{ type: "text", text: formatted }] };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error al buscar huecos libres: ${(error as Error).message}` }],
        isError: true,
      };
    }
  },
};
