import { FormEvent, useEffect, useState, useRef } from "react";
import { EventColor, EventFormValues } from "../../types/calendar";
import "./EventModal.css";

type EventModalPosition = {
  top: number;
  left: number;
};

type EventModalProps = {
  isOpen: boolean;
  title: string;
  initialValues: EventFormValues;
  colors: EventColor[];
  position: EventModalPosition | null;
  onClose: () => void;
  onSubmit: (values: EventFormValues) => void;
  onDelete?: (id?: string) => void;
};

export const EventModal = ({
  isOpen,
  title,
  initialValues,
  colors,
  position,
  onClose,
  onSubmit,
  onDelete,
}: EventModalProps) => {
  const [values, setValues] = useState<EventFormValues>(initialValues);
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValues(initialValues);
    setError("");
  }, [initialValues]);

  useEffect(() => {
    if (isOpen) {
      if (dialogRef.current && !dialogRef.current.open) {
        dialogRef.current.show();
      }
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!values.title.trim()) {
      setError("Event name is required");
      return;
    }

    if (values.title.trim().length > 30) {
      setError("Event name can be max 30 characters");
      return;
    }

    onSubmit({
      ...values,
      title: values.title.trim(),
    });
  };

  const openDatePicker = () => {
    const input = dateInputRef.current;
    if (!input) return;

    input.focus();
    if ("showPicker" in input) {
      input.showPicker();
    }
  };

  const openTimePicker = () => {
    const input = timeInputRef.current;
    if (!input) return;

    input.focus();
    if ("showPicker" in input) {
      input.showPicker();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="event-modal-dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onCancel={onClose}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          onClose();
        }
      }}
      style={
        position
          ? {
              position: "fixed",
              top: `${position.top}px`,
              left: `${position.left}px`,
              margin: 0,
            }
          : undefined
      }
      tabIndex={-1}
    >
      <div className="event-modal">
        <button
          className="event-modal__close"
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          title="Close (Esc)"
        >
          ×
        </button>

        <form onSubmit={handleSubmit}>
          <div className="event-modal__field">
            <input
              id="event-title"
              maxLength={30}
              placeholder="event name"
              value={values.title}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              autoFocus
            />
          </div>

          <div
            className="event-modal__field event-modal__field--date"
            role="button"
            tabIndex={0}
            onClick={openDatePicker}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDatePicker(); } }}
          >
            <input
              ref={dateInputRef}
              id="event-date"
              type="date"
              value={values.date}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  date: event.target.value,
                }))
              }
              required
            />
          </div>

          <div
            className="event-modal__field event-modal__field--time"
            role="button"
            tabIndex={0}
            onClick={openTimePicker}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openTimePicker(); } }}
          >
            <input
              ref={timeInputRef}
              id="event-time"
              type="time"
              value={values.time}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  time: event.target.value,
                }))
              }
              required
            />
          </div>

          <div className="event-modal__field event-modal__field--colors">
            <div className="event-modal__colors">
              {colors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  title={color.label}
                  aria-label={`Select ${color.label} color`}
                  className={
                    values.color === color.value
                      ? "color-swatch color-swatch--active"
                      : "color-swatch"
                  }
                  style={{ backgroundColor: color.value }}
                  onClick={() =>
                    setValues((current) => ({ ...current, color: color.value }))
                  }
                />
              ))}
            </div>
          </div>

          {error ? (
            <div className="event-modal__error" role="alert">
              {error}
            </div>
          ) : null}

          <div className="event-modal__actions">
            {values.id ? (
              <button
                type="button"
                className="event-modal__delete"
                onClick={() => {
                  onDelete?.(values.id);
                  onClose();
                }}
                aria-label="Delete event"
              >
                Delete
              </button>
            ) : (
              <button
                type="button"
                className="event-modal__delete"
                onClick={onClose}
                aria-label="Cancel"
              >
                Cancel
              </button>
            )}
            <button type="submit" className="event-modal__submit">
              {title}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};
