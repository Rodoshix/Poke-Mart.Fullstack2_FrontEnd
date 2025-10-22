// usado por LoginPage.jsx
// src/components/auth/ForgotPasswordDialog.jsx
import { useEffect, useRef } from "react";

export default function ForgotPasswordDialog({
  open,
  onClose,
  step, // 'email' | 'code'
  forgotEmail, setForgotEmail,
  forgotErr,
  demoCode,
  onSubmitEmail,
  onConfirmCode,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg || typeof dlg.showModal !== "function") return;
    if (open && !dlg.open) dlg.showModal();
    if (!open && dlg.open) dlg.close();
  }, [open]);

  return (
    <dialog ref={ref} style={{ border: "none", borderRadius: 12, padding: 0, maxWidth: 420, width: "92vw" }}>
      <div style={{ padding: 16 }}>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h3 className="m-0 fs-5">Recuperar contraseña</h3>
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onClose}>Cerrar</button>
        </div>

        {step === "email" && (
          <form onSubmit={onSubmitEmail} className="modal-body p-0">
            <p className="mb-2">Ingresa tu correo y te enviaremos un código de recuperación.</p>
            <div className="mb-3">
              <label htmlFor="forgotEmail" className="form-label">Correo</label>
              <input
                id="forgotEmail"
                type="email"
                className="form-control"
                placeholder="tu@email.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
              />
            </div>
            {forgotErr ? <p className="m-0" style={{ color: "#b00020" }}>{forgotErr}</p> : null}
            <div className="d-flex justify-content-end gap-2 mt-3">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-primary">Enviar código</button>
            </div>
          </form>
        )}

        {step === "code" && (
          <div className="modal-body p-0">
            <p>Se ha enviado un código de recuperación a tu correo.</p>
            <p className="small text-muted m-0">(Para la demo, tu código es <strong>{demoCode}</strong>)</p>

            <div className="d-flex align-items-center gap-2 mt-3">
              <input
                id="forgotCode"
                type="text"
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                className="form-control"
                placeholder="000000"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const input = e.currentTarget;
                    onConfirmCode((input.value || "").trim());
                  }
                }}
              />
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  const input = document.getElementById("forgotCode");
                  const value = input && "value" in input ? input.value : "";
                  onConfirmCode((value || "").trim());
                }}
              >
                Confirmar
              </button>
            </div>

            {forgotErr ? <p className="m-0 mt-2" style={{ color: "#b00020" }}>{forgotErr}</p> : null}
          </div>
        )}
      </div>
    </dialog>
  );
}
