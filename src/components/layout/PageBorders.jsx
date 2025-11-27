// src/components/common/PageBorders.jsx
import { backgroundLogo } from "@/assets/images.js";

export default function PageBorders({
  src = backgroundLogo,
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
