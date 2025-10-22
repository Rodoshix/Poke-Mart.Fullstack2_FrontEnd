// src/utils/money.js
export const money = (v) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" })
    .format(v ?? 0);
