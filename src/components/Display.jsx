import { formatDisplay } from "@/logic/decimal";
import { displayTextColor } from "@/utils/styleVariants";

export default function Display({
  expression,
  currentInput,
  error,
  isDarkMode = true,
}) {
  const displayValue = error || formatDisplay(currentInput);

  return (
    <div
      className={`px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 transition-all duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 display-glow"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-50"
      }`}
    >
      {/* Expression Line */}
      <div
        className={`text-sm sm:text-base lg:text-lg mb-2 sm:mb-3 lg:mb-4 h-6 sm:h-7 lg:h-8 overflow-hidden text-right font-light ${
          isDarkMode ? "text-slate-400" : "text-gray-500"
        }`}
        aria-label="Expression"
      >
        {expression || "\u00A0"}
      </div>

      {/* Main Display */}
      <div
        className={`text-right text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight ${displayTextColor(
          { isDark: isDarkMode, hasError: !!error }
        )}`}
        role="status"
        aria-live="polite"
        aria-label="Display"
      >
        {displayValue}
      </div>
    </div>
  );
}
