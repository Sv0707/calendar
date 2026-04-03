export const pad = (value: number) => String(value).padStart(2, '0');

export const toInputDate = (date: Date) => {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());

  return `${year}-${month}-${day}`;
};

export const toInputTime = (date: Date) => `${pad(date.getHours())}:${pad(date.getMinutes())}`;

export const combineDateAndTime = (date: string, time: string) => new Date(`${date}T${time}:00`);

export const addHour = (date: Date) => {
  const next = new Date(date);
  next.setHours(next.getHours() + 1);
  return next;
};

export const formatHeaderTitle = (date: Date, view: string) => {
  const locale = 'en-US';

  if (view === 'dayGridMonth') {
    return date.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
  }

  if (view === 'timeGridDay') {
    return date.toLocaleDateString(locale, { weekday: 'long', month: 'short', day: 'numeric' });
  }

  if (view === 'listWeek' || view === 'timeGridWeek') {
    const start = startOfWeek(date);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const startMonth = start.toLocaleDateString(locale, { month: 'short' });
    const endMonth = end.toLocaleDateString(locale, { month: 'short' });
    const startDay = start.getDate();
    const endDay = end.getDate();

    return startMonth === endMonth
      ? `${startMonth} ${startDay} - ${endDay}`
      : `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
  }

  return date.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
};

export const startOfWeek = (date: Date) => {
  const start = new Date(date);
  const day = start.getDay();
  start.setDate(start.getDate() - day);
  start.setHours(0, 0, 0, 0);
  return start;
};

export const toLocalDateTimeString = (date: Date) => `${toInputDate(date)}T${toInputTime(date)}:00`;
