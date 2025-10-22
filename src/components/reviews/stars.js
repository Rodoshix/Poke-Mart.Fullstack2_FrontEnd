// src/components/reviews/stars.js
export const starText = (n) => {
  const full = Math.floor(n);
  const half = (n - full) >= 0.5 ? 1 : 0;
  return "★".repeat(full) + (half ? "☆" : "") + "☆".repeat(5 - full - half);
};
