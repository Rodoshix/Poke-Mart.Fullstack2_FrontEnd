import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCount } from "@/lib/cartStore";

export default function CartButton() {
  const [count, setCount] = useState(() => {
    try { return getCount(); } catch { return parseInt(localStorage.getItem("cartCount") || "0", 10); }
  });

  useEffect(() => {
    const update = () => {
      try { setCount(getCount()); }
      catch { setCount(parseInt(localStorage.getItem("cartCount") || "0", 10)); }
    };
    window.addEventListener("cart:updated", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("cart:updated", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  return (
    <Link to="/carrito" className="btn btn-outline-primary position-relative" aria-label="Ver carrito">
      <span aria-hidden="true">🛒</span>
      <span
        className="badge text-bg-danger position-absolute top-0 start-100 translate-middle rounded-pill"
        style={{ minWidth: 18 }}
      >
        {count}
      </span>
    </Link>
  );
}
