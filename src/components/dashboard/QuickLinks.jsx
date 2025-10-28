import { Link } from "react-router-dom";

const QuickLinks = ({ links }) => {
  if (!Array.isArray(links) || links.length === 0) {
    return null;
  }

  return (
    <div className="admin-quick-links">
      {links.map(({ id, to, title, description, icon }) => (
        <Link key={id ?? to} to={to} className="admin-quick-link-card">
          {icon && (
            <span className="admin-quick-link-card__icon" aria-hidden="true">
              {icon}
            </span>
          )}
          <div className="admin-quick-link-card__content">
            <span className="admin-quick-link-card__title">{title}</span>
            {description && <span className="admin-quick-link-card__description">{description}</span>}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default QuickLinks;
