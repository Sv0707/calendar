import { CalendarEvent } from '../types/calendar';
import { STORAGE_KEY, INITIAL_EVENTS } from '../constants/storage';

export const loadEvents = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return INITIAL_EVENTS;
  }

  try {
    return JSON.parse(saved) as CalendarEvent[];
  } catch {
    return INITIAL_EVENTS;
  }
};

export const saveEvents = (events: CalendarEvent[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
};
