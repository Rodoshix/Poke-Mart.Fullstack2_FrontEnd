import { useMemo, useState } from "react";
import "@/assets/styles/reviews.css";

const starText = (n) => {
  const full = Math.floor(n);
  const half = (n - full) >= 0.5 ? 1 : 0;
  return "★".repeat(full) + (half ? "☆" : "") + "☆".repeat(5 - full - half);
};

export function Reviews({ reviews = [], productId, reviewsDict }) {
  const autoFromDict = useMemo(() => {
    if (!productId || !reviewsDict || typeof reviewsDict !== "object") return [];
    const k0 = String(productId).trim();
    const k1 = k0.replace(/^0+/, "");
    const n  = Number(k0);
    const k2 = Number.isFinite(n) ? String(n) : null;

    const candidates = [k0, k1, k2].filter(Boolean);
    for (const k of candidates) {
      const val = reviewsDict[k];
      if (Array.isArray(val)) return val;
    }
    return [];
  }, [productId, reviewsDict]);

  const data = (reviews && reviews.length) ? reviews : autoFromDict;

  const count = data.length;
  const avg = count ? data.reduce((a, r) => a + (r.rating || 0), 0) / count : 0;

  const dist = useMemo(() => {
    const d = { 1:0,2:0,3:0,4:0,5:0 };
    data.forEach(r => { d[r.rating] = (d[r.rating] || 0) + 1; });
    return d;
  }, [data]);

  const [filter, setFilter] = useState("all");
  const filtered = useMemo(() => {
    const base = filter === "all" ? data : data.filter(r => String(r.rating) === filter);
    return base.slice(0, 6);
  }, [data, filter]);

  const showMissingBanner = !reviews?.length && productId && reviewsDict && typeof reviewsDict === "object" && !count;

  return (
    <section className="reviews mt-5">
      {showMissingBanner && (
        <div className="alert alert-warning mb-3" role="alert">
          No hay reseñas en <code>reviews.json</code> para el id <strong>{String(productId)}</strong>.
          Asegúrate de que exista esa clave (por ejemplo <code>"{String(productId)}"</code>) con un array de reseñas.
        </div>
      )}

      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <div className="reviews-summary card p-3 h-100">
            <div className="d-flex align-items-center gap-3">
              <div>
                <div className="reviews-summary__avg display-5 fw-bold">
                  {count ? avg.toFixed(1) : "—"}
                </div>
                <div className="reviews-summary__stars" aria-label="Calificación promedio">
                  {count ? starText(avg) : "☆☆☆☆☆"}
                </div>
                <div className="text-secondary small">
                  {count} calificación{count === 1 ? "" : "es"}
                </div>
              </div>
            </div>

            <hr />

            <div className="reviews-bars">
              {[5,4,3,2,1].map(st => {
                const pct = count ? Math.round((dist[st] || 0) * 100 / count) : 0;
                return (
                  <div className="bar" key={st}>
                    <span className="small" style={{ width: "2rem" }}>{st}★</span>
                    <div className="bar__track"><div className="bar__fill" style={{ width: `${pct}%` }} /></div>
                    <span className="small text-secondary" style={{ width: "3rem", textAlign:"right" }}>{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-8">
          <div className="card p-3 h-100">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="fw-semibold">Opiniones destacadas</div>
              <div className="dropstart">
                <button className="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                  Calificación
                </button>
                <ul className="dropdown-menu">
                  <li><button className="dropdown-item" onClick={() => setFilter("all")}>Todas</button></li>
                  <li><button className="dropdown-item" onClick={() => setFilter("5")}>5 estrellas</button></li>
                  <li><button className="dropdown-item" onClick={() => setFilter("4")}>4 estrellas</button></li>
                  <li><button className="dropdown-item" onClick={() => setFilter("3")}>3 estrellas</button></li>
                  <li><button className="dropdown-item" onClick={() => setFilter("2")}>2 estrellas</button></li>
                  <li><button className="dropdown-item" onClick={() => setFilter("1")}>1 estrella</button></li>
                </ul>
              </div>
            </div>

            <div className="reviews-list">
              {filtered.length ? (
                filtered.map(r => (
                  <article className="review" key={r.id}>
                    <div className="review__stars">{starText(r.rating)}</div>
                    <div className="review__meta">
                      {(r.user || "Comprador verificado")} · {new Date(r.fecha).toLocaleDateString("es-CL", { day:"2-digit", month:"short", year:"numeric" })}
                    </div>
                    <p className="mb-2">{r.texto}</p>
                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="btn btn-sm btn-outline-secondary py-0 px-2"
                        onClick={(e) => {
                          const next = Number(e.currentTarget.nextSibling.textContent || 0) + 1;
                          e.currentTarget.nextSibling.textContent = String(next);
                          e.currentTarget.disabled = true;
                        }}
                      >
                        Es útil
                      </button>
                      <span className="review__help">{r.util || 0}</span>
                    </div>
                  </article>
                ))
              ) : (
                <div className="text-secondary small">No hay opiniones para este filtro.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
