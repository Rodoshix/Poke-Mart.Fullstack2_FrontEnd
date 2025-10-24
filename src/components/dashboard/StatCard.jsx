const StatCard = ({
  title,
  icon,
  primaryValue,
  primaryLabel,
  secondaryValue,
  secondaryLabel,
  trend,
  tone = "neutral",
}) => (
  <article className={`admin-stat-card admin-stat-card--${tone}`}>
    <header className="admin-stat-card__header">
      {icon && (
        <span className="admin-stat-card__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <h2 className="admin-stat-card__title">{title}</h2>
    </header>

    <div className="admin-stat-card__body">
      <p className="admin-stat-card__primary">
        <span className="admin-stat-card__primary-value">{primaryValue}</span>
        {primaryLabel && <span className="admin-stat-card__primary-label">{primaryLabel}</span>}
      </p>

      {(secondaryValue || secondaryLabel) && (
        <p className="admin-stat-card__secondary">
          {secondaryLabel && <span className="admin-stat-card__secondary-label">{secondaryLabel}</span>}
          {secondaryValue && <span className="admin-stat-card__secondary-value">{secondaryValue}</span>}
        </p>
      )}
    </div>

    {trend && (
      <footer
        className={`admin-stat-card__trend ${
          trend.variant ? `admin-stat-card__trend--${trend.variant}` : "admin-stat-card__trend--neutral"
        }`}
      >
        {trend.label && <span className="admin-stat-card__trend-label">{trend.label}</span>}
        {trend.value && <span className="admin-stat-card__trend-value">{trend.value}</span>}
      </footer>
    )}
  </article>
);

export default StatCard;
