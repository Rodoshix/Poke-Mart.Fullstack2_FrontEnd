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
    const password = formState.password;
    const passwordConfirm = formState.passwordConfirm;

    if (!username) validationErrors.push("El nombre de usuario es requerido.");
    if (!role) validationErrors.push("El rol es requerido.");
    if (!nombre) validationErrors.push("El nombre es requerido.");
    if (!apellido) validationErrors.push("El apellido es requerido.");
    if (!run) validationErrors.push("El RUN es requerido.");
    if (!fechaNacimiento) validationErrors.push("La fecha de nacimiento es requerida.");
    if (!region) validationErrors.push("La región es requerida.");
    if (!comuna) validationErrors.push("La comuna es requerida.");
    if (!direccion) validationErrors.push("La dirección es requerida.");
    if (!email) validationErrors.push("El correo electrónico es requerido.");

    if (password.trim() && !passwordConfirm.trim()) {
      validationErrors.push("Confirma la nueva contraseña.");
    }
    if (password && passwordConfirm && password !== passwordConfirm) {
      validationErrors.push("Las contraseñas no coinciden.");
    }

    const runValidation = validateRun(norm.run(run));
    if (!runValidation.valid) validationErrors.push(runValidation.message);

    const emailValidation = validateEmail(norm.email(email));
    if (!emailValidation.valid) validationErrors.push(emailValidation.message);

    return validationErrors;
  }, [formState, isNew]);

export default useUserValidation;

