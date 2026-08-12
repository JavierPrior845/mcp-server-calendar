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
      timeMin = new Date(now.setHours(0,0,0,0));
      timeMax = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      timeMax.setHours(23,59,59,999);
    }

    const response = await this.calendar.events.list({
      calendarId: 'primary',
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      maxResults: 50,
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
}

export const calendarService = new CalendarService();
