import { Menu, Sun, Moon } from "lucide-react";
import { borderMuted } from "@/utils/styleVariants";
import KeyboardShortcuts from "./KeyboardShortcuts";

export default function Header({ isDarkMode, onToggleTheme }) {
  return (
    <div
      className={`flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4 border-b ${borderMuted(
        isDarkMode
      )}`}
    >
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          className={`p-2 sm:p-2.5 rounded-lg transition-all duration-150 ${
            isDarkMode
              ? "hover:bg-slate-700/50 text-slate-300"
              : "hover:bg-gray-100/50 text-gray-600"
          }`}
          aria-label="Menu"
        >
          <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <span
          className={`text-responsive-sm font-semibold ${
            isDarkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Standard
        </span>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className={`p-2 sm:p-2.5 rounded-lg transition-all duration-150 ${
            isDarkMode
              ? "hover:bg-slate-700/50 text-slate-300"
              : "hover:bg-gray-100/50 text-gray-600"
          }`}
          aria-label="Toggle theme"
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </button>

        {/* Keyboard Shortcuts */}
        <KeyboardShortcuts isDarkMode={isDarkMode} />
      </div>
    </div>
  );
}
