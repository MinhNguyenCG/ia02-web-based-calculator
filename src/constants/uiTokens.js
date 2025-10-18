// Design tokens centralization. Keep values aligned with current Tailwind usage.
export const colors = {
  light: {
    surfaceGradient: "bg-gradient-to-br from-gray-100 via-white to-gray-100",
    cardGradient: "bg-gradient-to-br from-white/90 to-gray-50/90",
    borderMuted: "border-gray-200/50",
    textPrimary: "text-gray-900",
    textSecondary: "text-gray-500",
  },
  dark: {
    surfaceGradient:
      "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
    cardGradient: "bg-gradient-to-br from-slate-800/90 to-slate-900/90",
    borderMuted: "border-slate-700/50",
    textPrimary: "text-white",
    textSecondary: "text-slate-400",
  },
};

export const radii = {
  sm: "rounded-md",
  md: "rounded-lg",
  lg: "rounded-xl",
};

export const shadows = {
  button: "shadow-lg",
  buttonHover: "shadow-xl",
};

export const transitions = {
  base: "transition-all duration-150 ease-out",
};

export const focusRing = "focus:outline-none focus:ring-2 focus:ring-cyan-400";

export const tokens = { colors, radii, shadows, transitions, focusRing };

export default tokens;
