import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin, {
  DateClickArg,
} from "@fullcalendar/interaction";
import {
  EventClickArg,
  EventContentArg,
  EventDropArg,
} from "@fullcalendar/core";
import { CalendarEvent, CalendarView } from "../../types/calendar";
import "./CalendarPanel.css";

type DateSelectArg = {
  start: Date;
  end: Date;
  jsEvent: MouseEvent | null;
};

const renderEventContent = (arg: EventContentArg) => {
  const background = arg.event.backgroundColor || "#3B86FF";

  return (
    <div className="fc-event-custom" style={{ backgroundColor: background }}>
      <span>{arg.event.title}</span>
    </div>
  );
};

type CalendarPanelProps = {
  calendarRef: React.RefObject<FullCalendar>;
  events: CalendarEvent[];
  currentDate: Date;
  currentView: CalendarView;
  headerTitle: string;
  onDateClick: (arg: DateClickArg) => void;
  onDateSelect: (arg: DateSelectArg) => void;
  onEventClick: (arg: EventClickArg) => void;
  onEventChange: (eventId: string, start: Date, end: Date | null) => void;
  onViewChange: (view: CalendarView) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
};

export const CalendarPanel = ({
  calendarRef,
  events,
  currentDate,
  currentView,
  headerTitle,
  onDateClick,
  onDateSelect,
  onEventClick,
  onEventChange,
  onViewChange,
  onPrev,
  onNext,
  onToday,
}: CalendarPanelProps) => {
  const isToday = (() => {
    const today = new Date();

    if (currentView === "dayGridMonth") {
      return (
        currentDate.getFullYear() === today.getFullYear() &&
        currentDate.getMonth() === today.getMonth()
      );
    }

    if (currentView === "timeGridWeek" || currentView === "listWeek") {
      const api = calendarRef.current?.getApi();
      if (!api) return false;

      const start = api.view.activeStart;
      const end = api.view.activeEnd;

      return today >= start && today < end;
    }

    if (currentView === "timeGridDay") {
      return currentDate.toDateString() === today.toDateString();
    }

    return false;
  })();

  return (
    <section className="calendar-card">
      <div className="calendar-card__header">
        <div className="calendar-card__subheader">
          <div className="calendar-card__subheading">Calendar View</div>
          <div className="calendar-card__view-buttons">
            <button
              type="button"
              className={
                currentView === "dayGridMonth"
                  ? "calendar-card__view-button calendar-card__view-button--active"
                  : "calendar-card__view-button"
              }
              onClick={() => onViewChange("dayGridMonth")}
            >
              Month
            </button>
            <button
              type="button"
              className={
                currentView === "timeGridWeek"
                  ? "calendar-card__view-button calendar-card__view-button--active"
                  : "calendar-card__view-button"
              }
              onClick={() => onViewChange("timeGridWeek")}
            >
              Week
            </button>
            <button
              type="button"
              className={
                currentView === "timeGridDay"
                  ? "calendar-card__view-button calendar-card__view-button--active"
                  : "calendar-card__view-button"
              }
              onClick={() => onViewChange("timeGridDay")}
            >
              Day
            </button>
            <button
              type="button"
              className={
                currentView === "listWeek"
                  ? "calendar-card__view-button calendar-card__view-button--active"
                  : "calendar-card__view-button"
              }
              onClick={() => onViewChange("listWeek")}
            >
              Agenda
            </button>
          </div>
        </div>

        <div className="calendar-card__header-row">
          <div className="calendar-card__controls">
            <button
              type="button"
              className={
                isToday
                  ? "calendar-card__view-button calendar-card__view-button--active"
                  : "calendar-card__view-button"
              }
              onClick={onToday}
            >
              Today
            </button>
            <button type="button" onClick={onPrev}>
              Back
            </button>
            <button type="button" onClick={onNext}>
              Next
            </button>
          </div>
          <div className="calendar-card__title-wrap">
            <div className="calendar-card__title">{headerTitle}</div>
          </div>
        </div>
      </div>

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialDate={currentDate}
        initialView={currentView}
        headerToolbar={false}
        height="auto"
        allDaySlot
        editable
        selectable
        selectMirror
        selectMinDistance={0}
        unselectAuto={false}
        eventStartEditable
        eventDurationEditable
        dayMaxEvents={3}
        eventOrder="start,-duration,allDay,title"
        slotEventOverlap
        nowIndicator
        firstDay={0}
        events={events}
        dateClick={currentView === "dayGridMonth" ? onDateClick : undefined}
        select={onDateSelect}
        eventClick={onEventClick}
        eventDrop={(arg: EventDropArg) =>
          onEventChange(
            arg.event.id,
            arg.event.start ?? new Date(),
            arg.event.end,
          )
        }
        eventResizeStop={(arg: any) =>
          onEventChange(
            arg.event.id,
            arg.event.start ?? new Date(),
            arg.event.end,
          )
        }
        eventContent={renderEventContent}
        displayEventTime={false}
        slotLabelFormat={{
          hour: "numeric",
          minute: "2-digit",
          meridiem: "short",
        }}
        dayHeaderFormat={
          currentView === "dayGridMonth"
            ? { weekday: "short" }
            : { weekday: "short", month: "2-digit", day: "2-digit" }
        }
        buttonText={{ today: "Today" }}
      />
    </section>
  );
};
