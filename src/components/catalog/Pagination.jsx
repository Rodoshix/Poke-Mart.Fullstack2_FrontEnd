// usado en CatalogPage.jsx
// src/components/catalog/Pagination.jsx
export default function Pagination({ page, maxPage, onPrev, onNext }) {
  return (
    <nav className="products__pagination d-flex justify-content-center mt-4">
      <ul className="pagination">
        <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
          <button className="page-link" type="button" onClick={onPrev}>Anterior</button>
        </li>
        <li className="page-item disabled">
          <span className="page-link">{page}</span>
        </li>
        <li className={`page-item ${page === maxPage ? "disabled" : ""}`}>
          <button className="page-link" type="button" onClick={onNext}>Siguiente</button>
        </li>
      </ul>
    </nav>
  );
}
