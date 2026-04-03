import { useEffect, useMemo, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import { DateClickArg } from "@fullcalendar/interaction";
import { CalendarApi, EventClickArg } from "@fullcalendar/core";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { Topbar } from "./components/Topbar/Topbar";
import { CalendarPanel } from "./components/CalendarPanel/CalendarPanel";
import { EventModal } from "./components/EventModal/EventModal";
import { useCalendarEvents } from "./hooks/useCalendarEvents";
import { CalendarView, EventFormValues } from "./types/calendar";
import { formatHeaderTitle, toInputDate, toInputTime } from "./utils/date";
import { COLORS } from "./constants/colors";

type DateSelectArg = {
  start: Date;
  end: Date;
  jsEvent: MouseEvent | null;
};

const createFormValues = (date: Date): EventFormValues => ({
  title: "",
  date: toInputDate(date),
  time: toInputTime(date),
  color: COLORS[0].value,
});

const fromExistingEvent = (event: {
  id: string;
  title: string;
  start: Date | null;
  backgroundColor: string;
}) => {
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
  const { events, addEvent, updateEvent, deleteEvent, moveEvent } =
    useCalendarEvents();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<CalendarView>("dayGridMonth");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [formValues, setFormValues] = useState<EventFormValues>(
    createFormValues(new Date("2026-01-02T08:00:00")),
  );
  const [modalPosition, setModalPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const headerTitle = useMemo(
    () => formatHeaderTitle(currentDate, currentView),
    [currentDate, currentView],
  );

  const getCalendarApi = (): CalendarApi | null =>
    calendarRef.current?.getApi() ?? null;

  const closeModal = () => {
    calendarRef.current?.getApi().unselect();
    setIsModalOpen(false);
    setModalPosition(null);
  };

  const syncFromCalendar = () => {
    const api = getCalendarApi();
    if (!api) return;

    setCurrentDate(api.getDate());
    setCurrentView(api.view.type as CalendarView);
  };

  useEffect(() => {
    if (!isModalOpen) return;

    const handleScroll = () => {
      closeModal();
    };

    const handleResize = () => {
      closeModal();
    };

    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [isModalOpen]);

  const handleViewChange = (view: CalendarView) => {
    closeModal();

    const api = getCalendarApi();
    if (!api) return;

    api.changeView(view);
    syncFromCalendar();
  };

  const handlePrev = () => {
    closeModal();

    const api = getCalendarApi();
    if (!api) return;

    api.prev();
    syncFromCalendar();
  };

  const handleNext = () => {
    closeModal();

    const api = getCalendarApi();
    if (!api) return;

    api.next();
    syncFromCalendar();
  };

  const handleToday = () => {
    closeModal();

    const api = getCalendarApi();
    if (!api) return;

    api.today();
    syncFromCalendar();
    setCurrentDate(new Date());
  };

  const setModalPositionFromPoint = (x: number, y: number) => {
    const modalWidth = 200;
    const modalHeight = 300;
    const gutter = 8;

    const left = Math.max(
      gutter,
      Math.min(x - modalWidth / 2, window.innerWidth - modalWidth - gutter),
    );

    const top = Math.max(
      gutter,
      Math.min(y + 12, window.innerHeight - modalHeight - gutter),
    );

    setModalPosition({ top, left });
  };

  const setModalPositionFromRect = (rect?: DOMRect) => {
    if (!rect) {
      setModalPosition({
        top: Math.max(8, window.innerHeight / 2 - 150),
        left: Math.max(8, window.innerWidth / 2 - 100),
      });
      return;
    }

    const modalWidth = 200;
    const modalHeight = 300;
    const gutter = 8;

    const left = Math.max(
      gutter,
      Math.min(
        rect.left + rect.width / 2 - modalWidth / 2,
        window.innerWidth - modalWidth - gutter,
      ),
    );

    const top = Math.max(
      gutter,
      Math.min(rect.bottom - 5, window.innerHeight - modalHeight - gutter),
    );

    setModalPosition({ top, left });
  };

  const openCreateModal = (date: Date) => {
    setModalMode("create");
    setFormValues(createFormValues(date));
    setIsModalOpen(true);
  };

  const handleDateClick = (arg: DateClickArg) => {
    const target = arg.jsEvent.target as HTMLElement | null;
    const anchorEl =
      target?.closest(".fc-timegrid-slot") ||
      target?.closest(".fc-timegrid-slot-lane") ||
      target?.closest(".fc-timegrid-col") ||
      target?.closest(".fc-daygrid-day") ||
      arg.dayEl;

    const rect = anchorEl?.getBoundingClientRect?.();
    setModalPositionFromRect(rect);
    openCreateModal(arg.date);
  };

  const handleDateSelect = (arg: DateSelectArg) => {
    if (arg.jsEvent) {
      setModalPositionFromPoint(arg.jsEvent.clientX, arg.jsEvent.clientY);
    } else {
      setModalPositionFromRect(undefined);
    }
    openCreateModal(arg.start);
  };

  const handleEventClick = (arg: EventClickArg) => {
    setModalMode("edit");
    setFormValues(fromExistingEvent(arg.event));

    const rect = arg.el.getBoundingClientRect();
    setModalPositionFromRect(rect);

    setIsModalOpen(true);
  };

  const handleEventChange = (
    eventId: string,
    start: Date,
    end: Date | null,
  ) => {
    closeModal();
    moveEvent(eventId, start, end);
  };

  const handleSubmit = (values: EventFormValues) => {
    if (modalMode === "create") {
      addEvent(values);
    } else {
      updateEvent(values);
    }

    closeModal();
  };

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
            onDateSelect={handleDateSelect}
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
        title={modalMode === "create" ? "Save" : "Update"}
        initialValues={formValues}
        colors={COLORS}
        position={modalPosition}
        onClose={closeModal}
        onSubmit={handleSubmit}
        onDelete={deleteEvent}
      />
    </div>
  );
}

export default App;
