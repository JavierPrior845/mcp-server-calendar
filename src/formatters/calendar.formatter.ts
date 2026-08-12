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
      
      const startStr = this.formatDateTimeString(start);
      const endStr = this.formatDateTimeString(end);

      return `- **${summary}**\n  - 🕒 *Horario:* ${startStr} - ${endStr}\n  - 🔗 *Enlace:* ${event.htmlLink || 'N/A'}`;
    });

    return `### 📅 Eventos en el Calendario\n\nSe encontraron ${events.length} evento(s):\n\n${lines.join('\n')}`;
  }

  formatEventCreated(event: calendar_v3.Schema$Event): string {
    const summary = event.summary || 'Sin título';
    const start = event.start?.dateTime || event.start?.date || 'Sin fecha';
    const startStr = this.formatDateTimeString(start);
    
    return `✅ **Evento creado exitosamente**\n\n* **Título:** ${summary}\n* **Inicio:** ${startStr}\n* **Enlace Google Calendar:** [Ver Evento](${event.htmlLink})`;
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
