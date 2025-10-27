import rawUsers from "@/data/users.json";

const USER_STORAGE_KEY = "pokemart.admin.users";
const REGISTERED_USER_STORAGE_KEY = "pm_registeredUsers";
const USERS_EVENT = "users-data-changed";

const rawUsersArray = Array.isArray(rawUsers?.users) ? rawUsers.users : Array.isArray(rawUsers) ? rawUsers : [];

const normalizeRole = (role = "") => role.toString().trim().toLowerCase();
const normalizeEmail = (email = "") => email.toString().trim().toLowerCase();

const computeDefaultRegisteredAt = (index) =>
  new Date(Date.now() - index * 7 * 86_400_000).toISOString();

const mapUser = (user, fallbackRegisteredAt) => ({
  id: Number(user.id),
  username: String(user.username ?? "").trim(),
  password: String(user.password ?? "").trim(),
  role: normalizeRole(user.role ?? "cliente"),
  nombre: String(user.nombre ?? "").trim(),
  apellido: String(user.apellido ?? "").trim(),
  run: String(user.run ?? "").trim(),
  fechaNacimiento: String(user.fechaNacimiento ?? "").trim(),
  region: String(user.region ?? "").trim(),
  comuna: String(user.comuna ?? "").trim(),
  direccion: String(user.direccion ?? "").trim(),
  email: normalizeEmail(user.email ?? ""),
  avatarUrl: String(user.avatarUrl ?? "").trim(),
  registeredAt: String(user.registeredAt ?? fallbackRegisteredAt ?? new Date().toISOString()),
});

const baseUsers = rawUsersArray.map((user, index) => mapUser(user, computeDefaultRegisteredAt(index + 1)));

const emitChange = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(USERS_EVENT));
  }
};

const readOverrides = () => {
  if (typeof window === "undefined" || !window.localStorage) {
    return { added: [], updated: {} };
  }
  try {
    const raw = window.localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return { added: [], updated: {} };
    const parsed = JSON.parse(raw);
    const added = Array.isArray(parsed?.added)
      ? parsed.added.map((item, index) => mapUser(item, computeDefaultRegisteredAt(index + 1000)))
      : [];
    const updated =
      parsed?.updated && typeof parsed.updated === "object"
        ? Object.fromEntries(
            Object.entries(parsed.updated).map(([key, value]) => [key, mapUser(value, value.registeredAt)]),
          )
        : {};
    return { added, updated };
  } catch (error) {
    console.warn("No se pudo leer la información de usuarios personalizada", error);
    return { added: [], updated: {} };
  }
};

const writeOverrides = (overrides) => {
  if (typeof window === "undefined" || !window.localStorage) return;
  window.localStorage.setItem(
    USER_STORAGE_KEY,
    JSON.stringify({
      added: overrides.added ?? [],
      updated: overrides.updated ?? {},
    }),
  );
  emitChange();
};

const readRegisteredUsers = () => {
  if (typeof window === "undefined" || !window.localStorage) {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(REGISTERED_USER_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item, index) => mapUser(item, computeDefaultRegisteredAt(index + 2000)))
      .filter((user) => Number.isFinite(user.id));
  } catch (error) {
    console.warn("No se pudo leer la información de usuarios registrados en tienda", error);
    return [];
  }
};

const mergeUsers = () => {
  const overrides = readOverrides();
  const registered = readRegisteredUsers();
  const usersById = new Map();

  baseUsers.forEach((user) => {
    if (Number.isFinite(user.id)) {
      usersById.set(user.id, user);
    }
  });

  registered.forEach((user) => {
    if (!Number.isFinite(user.id)) return;
    const existing = usersById.get(user.id);
    usersById.set(user.id, existing ? { ...existing, ...user, id: user.id } : user);
  });

  Object.values(overrides.updated ?? {}).forEach((override) => {
    if (!Number.isFinite(override.id)) return;
    const existing = usersById.get(override.id);
    usersById.set(override.id, existing ? { ...existing, ...override, id: override.id } : override);
  });

  (overrides.added ?? []).forEach((user) => {
    if (!Number.isFinite(user.id)) return;
    usersById.set(user.id, user);
  });

  return Array.from(usersById.values()).sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
};

const getAllUsers = () => mergeUsers();

const getUserById = (id) => {
  const numericId = Number(id);
  if (Number.isNaN(numericId)) return undefined;
  return getAllUsers().find((user) => user.id === numericId);
};

const getUserRoles = () => {
  const roles = new Set();
  getAllUsers().forEach((user) => {
    if (user?.role) roles.add(user.role);
  });
  return Array.from(roles).sort((a, b) => a.localeCompare(b));
};

const getUserRegions = () => {
  const regions = new Set();
  getAllUsers().forEach((user) => {
    if (user?.region) regions.add(user.region);
  });
  return Array.from(regions).sort((a, b) => a.localeCompare(b));
};

const getNextUserId = () => {
  const all = getAllUsers();
  const maxId = all.reduce((max, user) => Math.max(max, Number(user.id) || 0), 0);
  return maxId + 1;
};

const ensureUniqueCredentials = (users, { username, email }, currentId) => {
  const normalizedUsername = String(username ?? "").trim().toLowerCase();
  const normalizedEmail = normalizeEmail(email);

  if (
    normalizedUsername &&
    users.some((user) => user.username.toLowerCase() === normalizedUsername && user.id !== currentId)
  ) {
    throw new Error("Ya existe un usuario con ese nombre de usuario.");
  }
  if (
    normalizedEmail &&
    users.some((user) => user.email === normalizedEmail && user.id !== currentId)
  ) {
    throw new Error("Ya existe un usuario con ese correo electrónico.");
  }
};

const createUser = (userData) => {
  const all = getAllUsers();
  ensureUniqueCredentials(all, userData);

  const newUser = mapUser(
    {
      ...userData,
      id: getNextUserId(),
      registeredAt: userData.registeredAt ?? new Date().toISOString(),
    },
    userData.registeredAt,
  );

  const overrides = readOverrides();
  overrides.added = [...(overrides.added ?? []), newUser];
  writeOverrides(overrides);
  return newUser;
};

const updateUser = (userId, changes) => {
  const numericId = Number(userId);
  if (Number.isNaN(numericId)) {
    throw new Error("ID de usuario inválido");
  }
  const existing = getUserById(numericId);
  if (!existing) {
    throw new Error(`No se encontró el usuario ${numericId}`);
  }

  ensureUniqueCredentials(getAllUsers(), changes, numericId);

  const overrides = readOverrides();
  overrides.updated = {
    ...(overrides.updated ?? {}),
    [numericId]: {
      ...existing,
      ...changes,
      id: numericId,
      registeredAt: changes.registeredAt ?? existing.registeredAt,
    },
  };
  writeOverrides(overrides);
  return getUserById(numericId);
};

const resetUsers = ({ includeRegistered = false } = {}) => {
  if (typeof window === "undefined" || !window.localStorage) return;
  window.localStorage.removeItem(USER_STORAGE_KEY);
  if (includeRegistered) {
    window.localStorage.removeItem(REGISTERED_USER_STORAGE_KEY);
  }
  emitChange();
};

const subscribeToUserChanges = (callback) => {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback?.();
  window.addEventListener(USERS_EVENT, handler);
  return () => window.removeEventListener(USERS_EVENT, handler);
};

export {
  getAllUsers,
  getUserById,
  getUserRoles,
  getUserRegions,
  getNextUserId,
  createUser,
  updateUser,
  resetUsers,
  subscribeToUserChanges,
  USERS_EVENT,
  USER_STORAGE_KEY,
  REGISTERED_USER_STORAGE_KEY,
};
