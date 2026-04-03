import { CalendarView } from '../types/calendar';

export const VIEW_BUTTONS: Array<{ label: string; value: CalendarView }> = [
  { label: 'Month', value: 'dayGridMonth' },
  { label: 'Week', value: 'timeGridWeek' },
  { label: 'Day', value: 'timeGridDay' },
  { label: 'Agenda', value: 'listWeek' },
];
