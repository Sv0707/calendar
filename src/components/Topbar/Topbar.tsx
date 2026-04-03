import "./Topbar.css";

export const Topbar = () => {
  return (
    <header className="topbar">
      <div className="topbar__search">
        <span className="topbar__search-icon" aria-hidden="true">⌕</span>
        <input defaultValue="" placeholder="Search transactions, invoices or help" />
      </div>
      <div className="topbar__actions">
        <span className="topbar__dot" />
        <span className="topbar__dot" />
        <span className="topbar__dot topbar__dot--accent" />
        <div className="topbar__user">
          <span>John Doe</span>
          <span className="topbar__caret">⌄</span>
          <span className="topbar__avatar">J</span>
        </div>
      </div>
    </header>
  );
};
