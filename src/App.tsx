import { useMemo, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import { DateClickArg } from '@fullcalendar/interaction';
import { CalendarApi, EventClickArg } from '@fullcalendar/core';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Topbar } from './components/Topbar/Topbar';
import { CalendarPanel } from './components/CalendarPanel/CalendarPanel';
import { EventModal } from './components/EventModal/EventModal';
import { useCalendarEvents } from './hooks/useCalendarEvents';
import { CalendarView, EventFormValues } from './types/calendar';
import { formatHeaderTitle, toInputDate, toInputTime } from './utils/date';
import { COLORS } from './constants/colors';

const createFormValues = (date: Date): EventFormValues => ({
  title: '',
  date: toInputDate(date),
  time: toInputTime(date),
  color: COLORS[0].value,
});

const fromExistingEvent = (event: { id: string; title: string; start: Date | null; backgroundColor: string }) => {
  const start = event.start ?? new Date();

  return {
    id: event.id,
    title: event.title,
    date: toInputDate(start),
    time: toInputTime(start),
    color: event.backgroundColor || COLORS[0].value,
  } satisfies EventFormValues;
};

function App() {
  const calendarRef = useRef<FullCalendar>(null);
  const { events, addEvent, updateEvent, deleteEvent, moveEvent } = useCalendarEvents();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<CalendarView>('dayGridMonth');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formValues, setFormValues] = useState<EventFormValues>(createFormValues(new Date('2026-01-02T08:00:00')));
  const [modalPosition, setModalPosition] = useState<{ top: number; left: number } | null>(null);

  const headerTitle = useMemo(() => formatHeaderTitle(currentDate, currentView), [currentDate, currentView]);

  const getCalendarApi = (): CalendarApi | null => calendarRef.current?.getApi() ?? null;

  const syncFromCalendar = () => {
    const api = getCalendarApi();
    if (!api) {
      return;
    }

    setCurrentDate(api.getDate());
    setCurrentView(api.view.type as CalendarView);
  };

  const handleViewChange = (view: CalendarView) => {
    const api = getCalendarApi();
    if (!api) {
      return;
    }

    api.changeView(view);
    syncFromCalendar();
  };

  const handlePrev = () => {
    const api = getCalendarApi();
    if (!api) {
      return;
    }

    api.prev();
    syncFromCalendar();
  };

  const handleNext = () => {
    const api = getCalendarApi();
    if (!api) {
      return;
    }

    api.next();
    syncFromCalendar();
  };

  const handleToday = () => {
    const api = getCalendarApi();
    if (!api) {
      return;
    }

    api.today();
    syncFromCalendar();
    setCurrentDate(new Date());
  };

  const handleDateClick = (arg: DateClickArg) => {
    setModalMode('create');
    setFormValues(createFormValues(arg.date));
    
    const rect = arg.dayEl.getBoundingClientRect();
    const modalWidth = 340;
    let leftPos = rect.left + rect.width / 2 - modalWidth / 2;
    
    leftPos = Math.max(8, Math.min(leftPos, window.innerWidth - modalWidth - 8));
    
    setModalPosition({
      top: rect.bottom - 30,
      left: leftPos,
    });
    
    setIsModalOpen(true);
  };

  const handleEventClick = (arg: EventClickArg) => {
    setModalMode('edit');
    setFormValues(fromExistingEvent(arg.event));
    
    const rect = arg.el.getBoundingClientRect();
    const modalWidth = 340;
    let leftPos = rect.left + rect.width / 2 - modalWidth / 2;
    
    leftPos = Math.max(8, Math.min(leftPos, window.innerWidth - modalWidth - 8));
    
    setModalPosition({
      top: rect.bottom - 30,
      left: leftPos,
    });
    
    setIsModalOpen(true);
  };

  const handleEventChange = (eventId: string, start: Date, end: Date | null) => {
    moveEvent(eventId, start, end);
  };

  const handleSubmit = (values: EventFormValues) => {
    if (modalMode === 'create') {
      addEvent(values);
    } else {
      updateEvent(values);
    }

    setIsModalOpen(false);
  };

  console.log(modalPosition)

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-shell__main">
        <Topbar />
        <main className="page-content">
          <h1 className="page-title">Calendar</h1>
          <CalendarPanel
            calendarRef={calendarRef}
            events={events}
            currentDate={currentDate}
            currentView={currentView}
            headerTitle={headerTitle}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
            onEventChange={handleEventChange}
            onViewChange={handleViewChange}
            onPrev={handlePrev}
            onNext={handleNext}
            onToday={handleToday}
          />
        </main>
      </div>

      <EventModal
        isOpen={isModalOpen}
        title={modalMode === 'create' ? 'Save' : 'Update'}
        initialValues={formValues}
        colors={COLORS}
        position={modalPosition}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        onDelete={deleteEvent}
      />
    </div>
  );
}

export default App;
