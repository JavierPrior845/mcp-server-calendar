import { calendar_v3 } from 'googleapis';

export class CalendarFormatter {
  formatEventList(events: calendar_v3.Schema$Event[]): string {
    if (events.length === 0) {
      return '📅 **No hay eventos registrados en este período.**';
    }

    const lines = events.map((event) => {
      const start = event.start?.dateTime || event.start?.date || 'Sin fecha';
      const end = event.end?.dateTime || event.end?.date || 'Sin fecha';
      const summary = event.summary || 'Sin título';
      const id = event.id || '';
      
      const startStr = this.formatDateTimeString(start);
      const endStr = this.formatDateTimeString(end);

      return `- **${summary}** (ID: \`${id}\`)\n  - 🕒 *Horario:* ${startStr} - ${endStr}\n  - 🔗 *Enlace:* ${event.htmlLink || 'N/A'}`;
    });

    return `### 📅 Eventos en el Calendario\n\nSe encontraron ${events.length} evento(s):\n\n${lines.join('\n')}`;
  }

  formatEventCreated(event: calendar_v3.Schema$Event): string {
    const summary = event.summary || 'Sin título';
    const start = event.start?.dateTime || event.start?.date || 'Sin fecha';
    const startStr = this.formatDateTimeString(start);
    
    return `✅ **Evento creado exitosamente**\n\n* **Título:** ${summary}\n* **ID:** \`${event.id}\`\n* **Inicio:** ${startStr}\n* **Enlace Google Calendar:** [Ver Evento](${event.htmlLink})`;
  }

  formatFreeSlots(slots: Array<{ start: Date; end: Date }>, durationMinutes: number): string {
    if (slots.length === 0) {
      return `⏳ **No se encontraron huecos libres de al menos ${durationMinutes} minutos en el rango especificado.**`;
    }

    const lines = slots.map((slot) => {
      const startStr = this.formatDateTimeString(slot.start.toISOString());
      const endStr = this.formatDateTimeString(slot.end.toISOString());
      const diffMs = slot.end.getTime() - slot.start.getTime();
      const diffMins = Math.round(diffMs / (1000 * 60));
      return `- 🟢 **${startStr}** ➔ **${endStr}** (${diffMins} min disponibles)`;
    });

    return `### 🟢 Franjas Libres Disponibles (Min. ${durationMinutes} min)\n\nSe encontraron ${slots.length} hueco(s) disponible(s):\n\n${lines.join('\n')}`;
  }

  formatEventRescheduled(event: calendar_v3.Schema$Event): string {
    const summary = event.summary || 'Sin título';
    const start = event.start?.dateTime || event.start?.date || '';
    const end = event.end?.dateTime || event.end?.date || '';
    
    return `🔄 **Evento reprogramado exitosamente**\n\n* **Título:** ${summary}\n* **ID:** \`${event.id}\`\n* **Nuevo Horario:** ${this.formatDateTimeString(start)} - ${this.formatDateTimeString(end)}\n* **Enlace:** [Ver Evento](${event.htmlLink})`;
  }

  formatEventDeleted(eventId: string): string {
    return `🗑️ **Evento eliminado exitosamente**\n\nEl evento con ID \`${eventId}\` ha sido eliminado del calendario.`;
  }

  formatConflicts(conflicts: Array<{ event1: calendar_v3.Schema$Event; event2: calendar_v3.Schema$Event }>): string {
    if (conflicts.length === 0) {
      return '✅ **No se detectaron solapamientos ni conflictos de horarios en el período analizado.**';
    }

    const lines = conflicts.map((c, i) => {
      const e1Start = this.formatDateTimeString(c.event1.start?.dateTime || c.event1.start?.date || '');
      const e1End = this.formatDateTimeString(c.event1.end?.dateTime || c.event1.end?.date || '');
      const e2Start = this.formatDateTimeString(c.event2.start?.dateTime || c.event2.start?.date || '');
      const e2End = this.formatDateTimeString(c.event2.end?.dateTime || c.event2.end?.date || '');

      return `### Conflict #${i + 1}\n- ⚠️ **Evento A:** ${c.event1.summary} (\`${c.event1.id}\`)\n  - 🕒 ${e1Start} - ${e1End}\n- ⚠️ **Evento B:** ${c.event2.summary} (\`${c.event2.id}\`)\n  - 🕒 ${e2Start} - ${e2End}`;
    });

    return `### ⚠️ Solapamientos de Horario Detectados (${conflicts.length})\n\n${lines.join('\n\n')}`;
  }

  formatWorkloadAnalytics(analytics: { totalHours: number; breakdown: Record<string, number>; eventCount: number }): string {
    if (analytics.eventCount === 0) {
      return '📊 **No se encontraron eventos para analizar en el período seleccionado.**';
    }

    const breakdownLines = Object.entries(analytics.breakdown).map(([category, hours]) => {
      const pct = analytics.totalHours > 0 ? ((hours / analytics.totalHours) * 100).toFixed(1) : '0';
      return `- **${category}**: ${hours.toFixed(1)} hrs (${pct}%)`;
    });

    return `### 📊 Análisis de Carga de Trabajo (Workload Analytics)\n\n* **Total de Eventos Analizados:** ${analytics.eventCount}\n* **Horas Totales Agendadas:** ${analytics.totalHours.toFixed(1)} hrs\n\n#### 📈 Desglose por Categoría:\n${breakdownLines.join('\n')}`;
  }

  private formatDateTimeString(isoString: string): string {
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return isoString;
      
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      
      if (isoString.length <= 10) {
        return `${day}/${month}/${year}`;
      }

      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch {
      return isoString;
    }
  }
}

export const calendarFormatter = new CalendarFormatter();
