// src/components/auth/LoginForm.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import LoginForm from "./LoginForm";

function renderWithRouter(ui) {
  return render(<MemoryRouter initialEntries={["/login"]}>{ui}</MemoryRouter>);
}

describe("Testing LoginForm", () => {
  let setUsername, setPassword, setRemember, onSubmit, onOpenForgot;

  beforeEach(() => {
    setUsername = vi.fn();
    setPassword = vi.fn();
    setRemember = vi.fn();
    onSubmit = vi.fn((e) => e?.preventDefault?.());
    onOpenForgot = vi.fn();
  });

  it("CP-Login1: Renderiza logo, títulos y relaciona aria-labelledby con el <section>", () => {
    const { container } = renderWithRouter(
      <LoginForm
        logoSrc="/logo.png"
        username=""
        setUsername={setUsername}
        password=""
        setPassword={setPassword}
        remember={false}
        setRemember={setRemember}
        error=""
        onSubmit={onSubmit}
        onOpenForgot={onOpenForgot}
      />
    );

    const logo = screen.getByRole("img", { name: /logo poké mart/i });
    expect(logo).toHaveAttribute("src", "/logo.png");
    expect(screen.getByText("Poké Mart")).toBeInTheDocument();

    const h2 = screen.getByRole("heading", { level: 2, name: /login/i });
    const section = container.querySelector("section.login__wrapper");
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute("aria-labelledby", h2.id || "loginTitle");
  });

  it("CP-Login2: Cambia username y password llamando a sus setters", () => {
    renderWithRouter(
      <LoginForm
        logoSrc="/logo.png"
        username=""
        setUsername={setUsername}
        password=""
        setPassword={setPassword}
        remember={false}
        setRemember={setRemember}
        error=""
        onSubmit={onSubmit}
        onOpenForgot={onOpenForgot}
      />
    );

    const userInput = screen.getByPlaceholderText(/username/i);
    const passInput = screen.getByPlaceholderText(/password/i);

    fireEvent.change(userInput, { target: { value: "ash" } });
    expect(setUsername).toHaveBeenCalledWith("ash");

    fireEvent.change(passInput, { target: { value: "pikachu123" } });
    expect(setPassword).toHaveBeenCalledWith("pikachu123");
  });

  it("CP-Login3: Toggle 'Recuérdame' llama a setRemember con checked", () => {
    renderWithRouter(
      <LoginForm
        logoSrc="/logo.png"
        username=""
        setUsername={setUsername}
        password=""
        setPassword={setPassword}
        remember={false}
        setRemember={setRemember}
        error=""
        onSubmit={onSubmit}
        onOpenForgot={onOpenForgot}
      />
    );

    const rememberCheckbox = screen.getByRole("checkbox", { name: /recuérdame/i });
    fireEvent.click(rememberCheckbox);
    expect(setRemember).toHaveBeenCalledWith(true);
  });

  it("CP-Login4: Botón '¿Olvidaste tu contraseña?' dispara onOpenForgot", () => {
    renderWithRouter(
      <LoginForm
        logoSrc="/logo.png"
        username=""
        setUsername={setUsername}
        password=""
        setPassword={setPassword}
        remember={false}
        setRemember={setRemember}
        error=""
        onSubmit={onSubmit}
        onOpenForgot={onOpenForgot}
      />
    );

    const forgotBtn = screen.getByRole("button", { name: /¿olvidaste tu contraseña\?/i });
    fireEvent.click(forgotBtn);
    expect(onOpenForgot).toHaveBeenCalledTimes(1);
  });

  it("CP-Login5: Enviar el formulario llama a onSubmit", () => {
    renderWithRouter(
      <LoginForm
        logoSrc="/logo.png"
        username="misty"
        setUsername={setUsername}
        password="starmie"
        setPassword={setPassword}
        remember={true}
        setRemember={setRemember}
        error=""
        onSubmit={onSubmit}
        onOpenForgot={onOpenForgot}
      />
    );

    const submitBtn = screen.getByRole("button", { name: /^login$/i });
    fireEvent.click(submitBtn);
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("CP-Login6: Muestra mensaje de error cuando 'error' tiene contenido", () => {
    renderWithRouter(
      <LoginForm
        logoSrc="/logo.png"
        username=""
        setUsername={setUsername}
        password=""
        setPassword={setPassword}
        remember={false}
        setRemember={setRemember}
        error="Credenciales inválidas"
        onSubmit={onSubmit}
        onOpenForgot={onOpenForgot}
      />
    );

    expect(screen.getByText(/credenciales inválidas/i)).toBeInTheDocument();
  });

  it("CP-Login7: Link a registro apunta a /registro", () => {
    renderWithRouter(
      <LoginForm
        logoSrc="/logo.png"
        username=""
        setUsername={setUsername}
        password=""
        setPassword={setPassword}
        remember={false}
        setRemember={setRemember}
        error=""
        onSubmit={onSubmit}
        onOpenForgot={onOpenForgot}
      />
    );

    const regLink = screen.getByRole("link", { name: /registrar/i });
    expect(regLink).toHaveAttribute("href", "/registro");
  });

});
