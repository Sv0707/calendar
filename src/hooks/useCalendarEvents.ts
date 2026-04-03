import { useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { CalendarEvent, EventFormValues } from '../types/calendar';
import { addHour, combineDateAndTime, toLocalDateTimeString } from '../utils/date';
import { loadEvents, saveEvents } from '../utils/storage';

export const useCalendarEvents = () => {
  const [events, setEvents] = useState<CalendarEvent[]>(() => loadEvents());

  useEffect(() => {
    saveEvents(events);
  }, [events]);

  const sortedEvents = useMemo(
    () =>
      [...events].sort(
        (first, second) => new Date(first.start).getTime() - new Date(second.start).getTime(),
      ),
    [events],
  );

  const addEvent = (values: EventFormValues) => {
    const start = combineDateAndTime(values.date, values.time);
    const end = addHour(start);

    const nextEvent: CalendarEvent = {
      id: uuid(),
      title: values.title.trim(),
      start: toLocalDateTimeString(start),
      end: toLocalDateTimeString(end),
      color: values.color,
    };

    setEvents((current) => [...current, nextEvent]);
  };

  const updateEvent = (values: EventFormValues) => {
    if (!values.id) {
      return;
    }

    const start = combineDateAndTime(values.date, values.time);
    const end = addHour(start);

    setEvents((current) =>
      current.map((event) =>
        event.id === values.id
          ? {
              ...event,
              title: values.title.trim(),
              start: toLocalDateTimeString(start),
              end: toLocalDateTimeString(end),
              color: values.color,
            }
          : event,
      ),
    );
  };

  const deleteEvent = (id?: string) => {
    if (!id) {
      return;
    }

    setEvents((current) => current.filter((event) => event.id !== id));
  };

  const moveEvent = (id: string, start: Date, end: Date | null) => {
    setEvents((current) =>
      current.map((event) =>
        event.id === id
          ? {
              ...event,
              start: toLocalDateTimeString(start),
              end: toLocalDateTimeString(end ?? addHour(start)),
            }
          : event,
      ),
    );
  };

  return {
    events: sortedEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    moveEvent,
  };
};
