const MAX_NEIGHBORS = 1;

const Paginator = ({ currentPage, totalPages, onPageChange, pageSize, totalItems }) => {
  if (totalPages <= 1) return null;

  const handleChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange?.(page);
  };

  const pages = [];
  const start = Math.max(1, currentPage - MAX_NEIGHBORS);
  const end = Math.min(totalPages, currentPage + MAX_NEIGHBORS);
  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  const hasItems = totalItems > 0;
  const startItem = hasItems ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = hasItems ? Math.min(currentPage * pageSize, totalItems) : 0;

  return (
    <div className="admin-paginator">
      <div className="admin-paginator__info">
        Mostrando {startItem} - {endItem} de {totalItems} productos
      </div>
      <div className="admin-paginator__controls">
        <button
          type="button"
          className="admin-paginator__button"
          onClick={() => handleChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        {start > 1 && (
          <>
            <button type="button" className="admin-paginator__button" onClick={() => handleChange(1)}>
              1
            </button>
            {start > 2 && <span className="admin-paginator__ellipsis">…</span>}
          </>
        )}
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            className={`admin-paginator__button ${page === currentPage ? "is-active" : ""}`}
            onClick={() => handleChange(page)}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        ))}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="admin-paginator__ellipsis">…</span>}
            <button type="button" className="admin-paginator__button" onClick={() => handleChange(totalPages)}>
              {totalPages}
            </button>
          </>
        )}
        <button
          type="button"
          className="admin-paginator__button"
          onClick={() => handleChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Paginator;
