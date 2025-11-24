import { useCallback, useEffect, useMemo, useState } from "react";
import { REGIONES } from "@/data/regiones";
import { formatRun, getComunasByRegion, norm } from "@/components/registro/validators";

const buildInitialState = (initialUser) => ({
  username: initialUser?.username ?? "",
  password: "",
  passwordConfirm: "",
  role: initialUser?.role ?? "cliente",
  nombre: initialUser?.nombre ?? "",
  apellido: initialUser?.apellido ?? "",
  run: initialUser?.run ?? "",
  fechaNacimiento: initialUser?.fechaNacimiento ?? "",
  region: initialUser?.region ?? "",
  comuna: initialUser?.comuna ?? "",
  direccion: initialUser?.direccion ?? "",
  email: initialUser?.email ?? "",
  telefono: initialUser?.telefono ?? "",
  registeredAt: initialUser?.registeredAt ?? new Date().toISOString(),
  active: initialUser?.active ?? true,
});

const useUserFormState = ({ initialUser, isNew }) => {
  const [formState, setFormState] = useState(() => buildInitialState(initialUser));

  useEffect(() => {
    setFormState(buildInitialState(initialUser));
  }, [initialUser]);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    if (name === "region") {
      setFormState((prev) => ({
        ...prev,
        region: value,
        comuna: "",
      }));
      return;
    }
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleRunBlur = useCallback(() => {
    setFormState((prev) => ({
      ...prev,
      run: formatRun(norm.run(prev.run)),
    }));
  }, []);

  const regionOptions = useMemo(
    () => [
      { value: "", label: "Selecciona una región" },
      ...REGIONES.map((region) => ({ value: region.region, label: region.region })),
    ],
    [],
  );

  const comunaOptions = useMemo(() => {
    if (!formState.region) return [];
    return getComunasByRegion(formState.region).map((comuna) => ({
      value: comuna,
      label: comuna,
    }));
  }, [formState.region]);

  const shouldShowPasswordConfirm = useMemo(
    () => isNew || Boolean(formState.password),
    [isNew, formState.password],
  );

  const userId = initialUser?.id ?? null;

  return {
    formState,
    setFormState,
    handleChange,
    handleRunBlur,
    regionOptions,
    comunaOptions,
    shouldShowPasswordConfirm,
    userId,
  };
};

export default useUserFormState;

