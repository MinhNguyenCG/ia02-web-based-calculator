import { useState } from "react";
import { buttonBase, memoryButtonHover } from "@/utils/styleVariants";

export default function MemoryButton({
  label,
  value,
  onClick,
  tooltip,
  isDarkMode = true,
  className = "",
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  const buttonStyles = memoryButtonHover(isDarkMode);

  const handleClick = () => {
    onClick(value);
  };

  return (
    <div className="relative">
      <button
        className={`${buttonBase} relative ${buttonStyles} ${className}`}
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        aria-label={tooltip}
      >
        {label}
      </button>

      {showTooltip && (
        <div
          className={`tooltip-panel ${
            isDarkMode
              ? "bg-slate-800 text-white border border-slate-600"
              : "bg-gray-800 text-white border border-gray-600"
          }`}
        >
          {tooltip}
          <div
            className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
              isDarkMode ? "border-t-slate-800" : "border-t-gray-800"
            }`}
          />
        </div>
      )}
    </div>
  );
}
