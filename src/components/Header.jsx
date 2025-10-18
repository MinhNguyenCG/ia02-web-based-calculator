import { Menu, Sun, Moon, History } from "lucide-react";
import { borderMuted } from "@/utils/styleVariants";

export default function Header({ isDarkMode, onToggleTheme, onToggleHistory }) {
  return (
    <div
      className={`flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 border-b ${borderMuted(
        isDarkMode
      )}`}
    >
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          className={`p-1.5 sm:p-2 rounded-lg transition-all duration-150 ${
            isDarkMode
              ? "hover:bg-slate-700/50 text-slate-300"
              : "hover:bg-gray-100/50 text-gray-600"
          }`}
          aria-label="Menu"
        >
          <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <span
          className={`text-sm sm:text-lg font-semibold ${
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
          className={`p-1.5 sm:p-2 rounded-lg transition-all duration-150 ${
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
        <button
          onClick={onToggleHistory}
          className={`lg:hidden p-1.5 sm:p-2 rounded-lg transition-all duration-150 ${
            isDarkMode
              ? "hover:bg-slate-700/50 text-slate-300"
              : "hover:bg-gray-100/50 text-gray-600"
          }`}
          aria-label="Toggle History"
        >
          <History className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
}
