import { CalendarView } from '../../types/calendar';
import { VIEW_BUTTONS } from '../../constants/views';
import './ViewSwitcher.css';

type ViewSwitcherProps = {
  currentView: CalendarView;
  onChange: (view: CalendarView) => void;
};

export const ViewSwitcher = ({ currentView, onChange }: ViewSwitcherProps) => {
  return (
    <div className="view-switcher">
      {VIEW_BUTTONS.map((button) => (
        <button
          key={button.value}
          type="button"
          className={button.value === currentView ? 'view-switcher__button view-switcher__button--active' : 'view-switcher__button'}
          onClick={() => onChange(button.value)}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
};
