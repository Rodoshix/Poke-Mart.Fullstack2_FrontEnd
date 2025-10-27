import usersData from "@/data/users.json";

const MILLISECONDS_PER_DAY = 86_400_000;

const createRegisteredAt = (daysAgo) => new Date(Date.now() - daysAgo * MILLISECONDS_PER_DAY).toISOString();

const seedUsers = (usersData?.users ?? []).map((user, index) => {
  const fullName = `${user.nombre ?? ""} ${user.apellido ?? ""}`.trim() || user.username || `Usuario ${user.id}`;
  const daysAgo = Math.max(0, 14 + index * 6);

  return {
    id: user.id,
    name: fullName,
    email: user.email,
    role: (user.role || "cliente").toLowerCase(),
    registeredAt: createRegisteredAt(daysAgo),
    region: user.region,
    comuna: user.comuna,
  };
});

export { seedUsers };
