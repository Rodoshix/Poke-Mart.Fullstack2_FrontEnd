// src/components/auth/session.js
const AUTH_KEY = "pm_session";
const PROFILE_KEY = "pm_session_profile";
const SESSION_DURATION = 60 * 60 * 1000; // 1 hora

// Evento global para que otros componentes reaccionen (mismo tab)
const emitAuthChange = () => {
  try {
    window.dispatchEvent(new Event("pm:authchange"));
  } catch {
  }
};

export const getAuth = () => {
  try {
    const raw = sessionStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (!session || typeof session !== "object" || !session.token) return null;
    if (session.expiresAt && Date.now() > session.expiresAt) {
      clearAuth();
      return null;
    }
    return session;
  } catch {
    return null;
  }
};

export const getProfile = () => {
  if (window.sessionProfile) return window.sessionProfile;
  try {
    const encoded = sessionStorage.getItem(PROFILE_KEY);
    if (!encoded) return null;
    const profile = JSON.parse(atob(encoded));
    if (!profile || typeof profile !== "object") return null;
    window.sessionProfile = profile;
    return profile;
  } catch {
    sessionStorage.removeItem(PROFILE_KEY);
    return null;
  }
};

export const setAuth = ({
  token,
  expiresAt = Date.now() + SESSION_DURATION,
  profile,
}) => {
  sessionStorage.setItem(AUTH_KEY, JSON.stringify({ token, expiresAt }));

  if (profile) {
    try {
      const encoded = btoa(JSON.stringify(profile));
      sessionStorage.setItem(PROFILE_KEY, encoded);
    } catch {
      sessionStorage.removeItem(PROFILE_KEY);
    }
    window.sessionProfile = profile;
  }

  emitAuthChange();
};

export const clearAuth = () => {
  sessionStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem(PROFILE_KEY);
  window.sessionProfile = null;

  emitAuthChange();
};
