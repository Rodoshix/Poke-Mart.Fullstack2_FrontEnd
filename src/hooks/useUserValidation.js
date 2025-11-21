import { useCallback } from "react";
import {
  norm,
  validate as validateRegistration,
  validateEmail,
  validateRun,
} from "@/components/registro/validators";
import { getAllUsers } from "@/services/userService.js";

const useUserValidation = ({ formState, isNew }) =>
  useCallback(() => {
    if (isNew) {
      const data = {
        nombre: formState.nombre.trim(),
        apellido: formState.apellido.trim(),
        run: norm.run(formState.run),
        fechaNacimiento: formState.fechaNacimiento,
        region: formState.region,
        comuna: formState.comuna,
        direccion: formState.direccion.replace(/\s+/g, " ").trim(),
        username: formState.username.trim(),
        email: norm.email(formState.email),
        password: formState.password,
        passwordConfirm: formState.passwordConfirm,
        telefono: formState.telefono.trim(),
      };
      const issues = validateRegistration(getAllUsers(), data);
      return Array.isArray(issues) ? issues.map((issue) => issue.message) : [];
    }

    const validationErrors = [];
    const username = formState.username.trim();
    const role = formState.role.trim();
    const nombre = formState.nombre.trim();
    const apellido = formState.apellido.trim();
    const run = formState.run.trim();
    const fechaNacimiento = formState.fechaNacimiento.trim();
    const region = formState.region.trim();
    const comuna = formState.comuna.trim();
    const direccion = formState.direccion.trim();
    const email = formState.email.trim();
    const telefono = formState.telefono.trim();
    const password = formState.password;
    const passwordConfirm = formState.passwordConfirm;

    if (!username) validationErrors.push("El nombre de usuario es requerido.");
    if (!role) validationErrors.push("El rol es requerido.");
    if (!nombre) validationErrors.push("El nombre es requerido.");
    if (!apellido) validationErrors.push("El apellido es requerido.");
    if (!run) validationErrors.push("El RUN es requerido.");
    if (!fechaNacimiento) validationErrors.push("La fecha de nacimiento es requerida.");
    if (!region) validationErrors.push("La region es requerida.");
    if (!comuna) validationErrors.push("La comuna es requerida.");
    if (!direccion) validationErrors.push("La direccion es requerida.");
    if (!email) validationErrors.push("El correo electronico es requerido.");
    if (!telefono) validationErrors.push("El telefono es requerido.");

    if (password.trim() && !passwordConfirm.trim()) {
      validationErrors.push("Confirma la nueva contrasena.");
    }
    if (password && passwordConfirm && password !== passwordConfirm) {
      validationErrors.push("Las contrasenas no coinciden.");
    }

    const runValidation = validateRun(norm.run(run));
    if (!runValidation.valid) validationErrors.push(runValidation.message);

    const emailValidation = validateEmail(norm.email(email));
    if (!emailValidation.valid) validationErrors.push(emailValidation.message);

    const phoneDigits = telefono.replace(/\D+/g, "");
    if (phoneDigits && phoneDigits.length < 8) {
      validationErrors.push("Ingresa un telefono valido (min 8 digitos).");
    }

    return validationErrors;
  }, [formState, isNew]);

export default useUserValidation;
