import { CalendarEvent } from '../types/calendar';

export const STORAGE_KEY = 'impekable-calendar-events';

export const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: 'seed-1',
    title: 'Event name',
    start: '2026-04-02T00:00:00',
    end: '2026-04-02T01:00:00',
    color: '#3B86FF',
  },
  {
    id: 'seed-2',
    title: 'Event name',
    start: '2026-04-04T00:00:00',
    end: '2026-04-04T01:00:00',
    color: '#3B86FF',
  },
  {
    id: 'seed-3',
    title: 'Event name',
    start: '2026-04-05T00:00:00',
    end: '2026-04-05T01:00:00',
    color: '#3B86FF',
  },
  {
    id: 'seed-4',
    title: 'Event name',
    start: '2026-04-05T01:00:00',
    end: '2026-04-05T02:00:00',
    color: '#3B86FF',
  },
  {
    id: 'seed-5',
    title: 'Event name',
    start: '2026-04-14T00:00:00',
    end: '2026-04-14T01:00:00',
    color: '#3B86FF',
  },
  {
    id: 'seed-6',
    title: 'Event name',
    start: '2026-04-20T00:00:00',
    end: '2026-04-20T01:00:00',
    color: '#3B86FF',
  }
];
