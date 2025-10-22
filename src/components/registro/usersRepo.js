// src/components/registro/usersRepo.js
import usersJson from "@/data/users.json";

const LS_KEY = "pm_registeredUsers";

export function getBaseUsers() {
  const fromFile = Array.isArray(usersJson?.users) ? usersJson.users : [];
  let locals = [];
  try {
    locals = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
    if (!Array.isArray(locals)) locals = [];
  } catch {
    locals = [];
  }
  // fusion simple por id/username/email
  const map = new Map();
  [...fromFile, ...locals].forEach((u) => {
    if (!u || typeof u !== "object") return;
    const key = Number(u.id) || u.username || u.email;
    map.set(key, u);
  });
  return Array.from(map.values());
}

export function getNextId(baseUsers) {
  const maxId = baseUsers.reduce((max, u) => Math.max(max, Number(u.id) || 0), 0);
  return (maxId || 0) + 1;
}

export function saveUser(newUser) {
  let list = [];
  try {
    list = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
    if (!Array.isArray(list)) list = [];
  } catch {
    list = [];
  }
  list.push(newUser);
  localStorage.setItem(LS_KEY, JSON.stringify(list));
}
