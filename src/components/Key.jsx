import { useState, useEffect } from "react";
import { buttonBase, keyVariants } from "@/utils/styleVariants";

export default function Key({
  label,
  value,
  onClick,
  variant = "default",
  className = "",
  ariaLabel,
  gridArea,
  isDarkMode = true,
}) {
  const [isPressed, setIsPressed] = useState(false);

  const variants = keyVariants(isDarkMode);

  const handleClick = () => {
    // Only use animation in non-test environments
    if (process.env.NODE_ENV !== "test") {
      setIsPressed(true);
      setTimeout(() => setIsPressed(false), 100);
    }
    onClick(value);
  };

  return (
    <button
      className={`${buttonBase} ${variants[variant]} ${className} ${
        isPressed ? "scale-95 shadow-md" : ""
      }`}
      onClick={handleClick}
      aria-label={ariaLabel || label}
      role="button"
      style={gridArea ? { gridArea } : undefined}
    >
      {label}
    </button>
  );
}
