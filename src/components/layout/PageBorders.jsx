// src/components/common/PageBorders.jsx
export default function PageBorders({
  src = "/src/assets/img/background-logo.png",
  leftClass = "left-border",
  rightClass = "right-border",
}) {
  return (
    <>
      <img src={src} className={leftClass} alt="" aria-hidden="true" decoding="async" loading="lazy" />
      <img src={src} className={rightClass} alt="" aria-hidden="true" decoding="async" loading="lazy" />
    </>
  );
}
