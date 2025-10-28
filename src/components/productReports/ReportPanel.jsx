const ReportPanel = ({ title, subtitle, children }) => (
  <section className="admin-product-reports__panel">
    <header>
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </header>
    {children}
  </section>
);

export default ReportPanel;


