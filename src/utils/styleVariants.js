import { colors, radii, transitions, focusRing } from "@/constants/uiTokens";

export const buttonBase = `w-full calc-key font-medium ${radii.sm} ${transitions.base} ${focusRing} active:scale-95 transform`;

export function keyVariants(isDark) {
  return {
    default: isDark
      ? "bg-slate-700/80 hover:bg-slate-600/90 text-white"
      : "bg-gray-200/80 hover:bg-gray-300/90 text-gray-800",
    number: isDark
      ? "bg-slate-800/60 hover:bg-slate-700/80 text-white"
      : "bg-white/80 hover:bg-gray-50/90 text-gray-800",
    equals:
      "bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold",
  };
}

export function memoryButtonHover(isDark) {
  return isDark
    ? "hover:bg-slate-600/90 text-white"
    : "hover:bg-cyan-300/90 text-cyan-800";
}

export function surfaceGradient(isDark) {
  return isDark ? colors.dark.surfaceGradient : colors.light.surfaceGradient;
}

export function cardGradient(isDark) {
  return isDark ? colors.dark.cardGradient : colors.light.cardGradient;
}

export function borderMuted(isDark) {
  return isDark ? colors.dark.borderMuted : colors.light.borderMuted;
}

export function textSecondary(isDark) {
  return isDark ? colors.dark.textSecondary : colors.light.textSecondary;
}

export function displayTextColor({ isDark, hasError }) {
  if (hasError) return "text-red-500";
  return isDark ? colors.dark.textPrimary : "text-gray-900";
}

export function memoryTabTheme(isDark) {
  return isDark
    ? {
        container: "text-center py-8 sm:py-12 text-slate-400",
        value: "text-white text-lg sm:text-xl lg:text-2xl",
        memoryItem:
          "group w-full p-3 sm:p-4 transition-all duration-150 hover:bg-slate-700/40",
        valueButton:
          "w-full text-right p-2 sm:p-3 rounded-lg transition-all duration-150",
        controlButton:
          "flex-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-medium rounded-lg transition-all duration-150 bg-slate-600/30 text-slate-300 hover:bg-slate-500/40 border border-slate-500/30",
        clearButton:
          "text-xs sm:text-sm transition-colors duration-150 px-2 sm:px-3 py-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50",
      }
    : {
        container: "text-center py-8 sm:py-12 text-gray-500",
        value: "text-gray-800 text-lg sm:text-xl lg:text-2xl",
        memoryItem:
          "group w-full p-3 sm:p-4 transition-all duration-150 hover:bg-gray-200/60",
        valueButton:
          "w-full text-right p-2 sm:p-3 rounded-lg transition-all duration-150",
        controlButton:
          "flex-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-medium rounded-lg transition-all duration-150 bg-gray-300 text-gray-700 hover:bg-gray-400 border border-gray-400",
        clearButton:
          "text-xs sm:text-sm transition-colors duration-150 px-2 sm:px-3 py-1 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-200/50",
      };
}
