import { NAV_ITEMS } from "../../constants/navigation";
import "./Sidebar.css";
import { ICONS } from "../../constants/icons";

export const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">IMPEKABLE</div>

      <nav className="sidebar__nav">
        {NAV_ITEMS.map((item) => {
          const Icon = ICONS[item];

          return (
            <button
              key={item}
              type="button"
              className={`sidebar__item ${
                item === "Calendar" ? "sidebar__item--active" : ""
              }`}
            >
              <span className="sidebar__icon">
                {Icon && <img src={Icon} alt={item} aria-hidden="true" />}
              </span>

              <span className="sidebar__label">{item}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
