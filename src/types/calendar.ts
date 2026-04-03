export type CalendarView = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';

export type EventColor = {
  value: string;
  label: string;
};

export type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  color: string;
};

export type EventFormValues = {
  id?: string;
  title: string;
  date: string;
  time: string;
  color: string;
};
