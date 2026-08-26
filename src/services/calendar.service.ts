import { calendar_v3 } from 'googleapis';
import { getCalendarClient } from '../calendar.js';

export interface ListEventsOptions {
  date?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateEventOptions {
  summary: string;
  description?: string;
  startTime: string;
  endTime: string;
}

export interface FindFreeSlotsOptions {
  startDate: string;
  endDate: string;
  durationMinutes: number;
  startHour?: number;
  endHour?: number;
}

export interface RescheduleEventOptions {
  eventId: string;
  startTime: string;
  endTime: string;
}

export interface DeleteEventOptions {
  eventId: string;
}

export interface DetectConflictsOptions {
  startDate?: string;
  endDate?: string;
}

export interface WorkloadAnalyticsOptions {
  startDate?: string;
  endDate?: string;
}

export class CalendarService {
  private calendar: calendar_v3.Calendar;

  constructor() {
    this.calendar = getCalendarClient();
  }

  async listEvents(options: ListEventsOptions): Promise<calendar_v3.Schema$Event[]> {
    let timeMin: Date;
    let timeMax: Date;

    if (options.date) {
      timeMin = new Date(`${options.date}T00:00:00.000Z`);
      timeMax = new Date(`${options.date}T23:59:59.999Z`);
    } else if (options.startDate && options.endDate) {
      timeMin = new Date(`${options.startDate}T00:00:00.000Z`);
      timeMax = new Date(`${options.endDate}T23:59:59.999Z`);
    } else {
      const now = new Date();
      timeMin = new Date(now.setHours(0, 0, 0, 0));
      timeMax = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      timeMax.setHours(23, 59, 59, 999);
    }

    const response = await this.calendar.events.list({
      calendarId: 'primary',
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      maxResults: 100,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return response.data.items || [];
  }

  async createEvent(options: CreateEventOptions): Promise<calendar_v3.Schema$Event> {
    const event: calendar_v3.Schema$Event = {
      summary: options.summary,
      description: options.description || '',
      start: { dateTime: options.startTime },
      end: { dateTime: options.endTime },
    };

    const response = await this.calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });

    return response.data;
  }

  async findFreeSlots(options: FindFreeSlotsOptions): Promise<Array<{ start: Date; end: Date }>> {
    const startHour = options.startHour ?? 9;
    const endHour = options.endHour ?? 21;
    const durationMs = options.durationMinutes * 60 * 1000;

    const events = await this.listEvents({
      startDate: options.startDate,
      endDate: options.endDate,
    });

    const freeSlots: Array<{ start: Date; end: Date }> = [];
    const startDateObj = new Date(`${options.startDate}T00:00:00.000Z`);
    const endDateObj = new Date(`${options.endDate}T23:59:59.999Z`);

    for (let d = new Date(startDateObj); d <= endDateObj; d.setDate(d.getDate() + 1)) {
      const dayStart = new Date(d);
      dayStart.setHours(startHour, 0, 0, 0);

      const dayEnd = new Date(d);
      dayEnd.setHours(endHour, 0, 0, 0);

      const dayEvents = events.filter(e => {
        const eStart = new Date(e.start?.dateTime || e.start?.date || '').getTime();
        const eEnd = new Date(e.end?.dateTime || e.end?.date || '').getTime();
        return eStart < dayEnd.getTime() && eEnd > dayStart.getTime();
      }).sort((a, b) => {
        const aStart = new Date(a.start?.dateTime || a.start?.date || '').getTime();
        const bStart = new Date(b.start?.dateTime || b.start?.date || '').getTime();
        return aStart - bStart;
      });

      let cursor = dayStart.getTime();

      for (const event of dayEvents) {
        const eventStart = new Date(event.start?.dateTime || event.start?.date || '').getTime();
        const eventEnd = new Date(event.end?.dateTime || event.end?.date || '').getTime();

        if (eventStart > cursor) {
          const gap = eventStart - cursor;
          if (gap >= durationMs) {
            freeSlots.push({ start: new Date(cursor), end: new Date(eventStart) });
          }
        }
        if (eventEnd > cursor) {
          cursor = eventEnd;
        }
      }

      if (dayEnd.getTime() - cursor >= durationMs) {
        freeSlots.push({ start: new Date(cursor), end: new Date(dayEnd.getTime()) });
      }
    }

    return freeSlots;
  }

  async rescheduleEvent(options: RescheduleEventOptions): Promise<calendar_v3.Schema$Event> {
    const response = await this.calendar.events.patch({
      calendarId: 'primary',
      eventId: options.eventId,
      requestBody: {
        start: { dateTime: options.startTime },
        end: { dateTime: options.endTime },
      },
    });
    return response.data;
  }

  async deleteOrCancelEvent(options: DeleteEventOptions): Promise<void> {
    await this.calendar.events.delete({
      calendarId: 'primary',
      eventId: options.eventId,
    });
  }

  async detectConflicts(options: DetectConflictsOptions): Promise<Array<{ event1: calendar_v3.Schema$Event; event2: calendar_v3.Schema$Event }>> {
    const events = await this.listEvents(options);
    const conflicts: Array<{ event1: calendar_v3.Schema$Event; event2: calendar_v3.Schema$Event }> = [];

    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        const e1 = events[i];
        const e2 = events[j];

        const start1 = new Date(e1.start?.dateTime || e1.start?.date || '').getTime();
        const end1 = new Date(e1.end?.dateTime || e1.end?.date || '').getTime();
        const start2 = new Date(e2.start?.dateTime || e2.start?.date || '').getTime();
        const end2 = new Date(e2.end?.dateTime || e2.end?.date || '').getTime();

        if (start1 < end2 && start2 < end1) {
          conflicts.push({ event1: e1, event2: e2 });
        }
      }
    }
    return conflicts;
  }

  async getWorkloadAnalytics(options: WorkloadAnalyticsOptions): Promise<{
    totalHours: number;
    breakdown: Record<string, number>;
    eventCount: number;
  }> {
    const events = await this.listEvents(options);
    let totalHours = 0;
    const breakdown: Record<string, number> = {};

    for (const event of events) {
      const start = new Date(event.start?.dateTime || event.start?.date || '').getTime();
      const end = new Date(event.end?.dateTime || event.end?.date || '').getTime();

      if (isNaN(start) || isNaN(end) || end <= start) continue;

      const durationHours = (end - start) / (1000 * 60 * 60);
      totalHours += durationHours;

      const summary = event.summary || 'Sin título';
      let category = 'OTROS';

      const match = summary.match(/\[(.*?)\]/);
      if (match && match[1]) {
        category = match[1].toUpperCase();
      } else if (summary.toLowerCase().includes('freelance') || summary.toLowerCase().includes('cliente')) {
        category = 'FREELANCE';
      } else if (summary.toLowerCase().includes('formacion') || summary.toLowerCase().includes('estudio') || summary.toLowerCase().includes('curso')) {
        category = 'FORMACION';
      } else if (summary.toLowerCase().includes('trabajo') || summary.toLowerCase().includes('backend')) {
        category = 'TRABAJO';
      }

      breakdown[category] = (breakdown[category] || 0) + durationHours;
    }

    return { totalHours, breakdown, eventCount: events.length };
  }
}

export const calendarService = new CalendarService();
