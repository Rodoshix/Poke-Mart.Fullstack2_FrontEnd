import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "bootstrap/js/dist/modal";

let modalInstance = null;

export const CartGuardModal = () => {
  const elRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    modalInstance = Modal.getOrCreateInstance(elRef.current, { backdrop: "static" });
    return () => {
      modalInstance?.dispose();
      modalInstance = null;
    };
  }, []);

  return (
    <div className="modal fade poke-modal" id="guardModal" tabIndex={-1} aria-hidden="true" ref={elRef}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title fs-5">Acceso restringido</h2>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
          </div>
          <div className="modal-body">
            <p>Debes iniciar sesion para acceder al carrito.</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                modalInstance?.hide();
                navigate("/login?redirect=carrito");
              }}
            >
              Iniciar sesion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const showCartGuardModal = () => {
  modalInstance?.show();
};
