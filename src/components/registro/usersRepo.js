// src/components/registro/usersRepo.js
import { getAllUsers, USERS_EVENT } from "@/services/userService.js";

const LS_KEY = "pm_registeredUsers";

export function getBaseUsers() {
  const users = getAllUsers();
  return Array.isArray(users) ? users : [];
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
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(USERS_EVENT));
  }
}
