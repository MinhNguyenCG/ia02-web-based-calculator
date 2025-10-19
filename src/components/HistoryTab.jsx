import { memo, useCallback } from "react";
import { formatDisplay } from "../logic/decimal";
import { Trash2 } from "lucide-react";

// Define theme classes as constants for better performance
const THEME_CLASSES = {
  dark: {
    container: "text-center py-8 sm:py-12 text-slate-400",
    title: "text-white",
    historyItem:
      "group w-full p-3 sm:p-4 transition-all duration-150 hover:bg-slate-700/40",
    historyButton:
      "w-full text-right p-2 sm:p-3 rounded-lg transition-all duration-150",
    expression: "text-slate-400 text-xs sm:text-sm",
    result: "text-white text-lg sm:text-xl lg:text-2xl",
    clearButton:
      "text-xs sm:text-sm transition-colors duration-150 px-2 sm:px-3 py-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50",
  },
  light: {
    container: "text-center py-8 sm:py-12 text-gray-500",
    title: "text-gray-800",
    historyItem:
      "group w-full p-3 sm:p-4 transition-all duration-150 hover:bg-gray-200/60",
    historyButton:
      "w-full text-right p-2 sm:p-3 rounded-lg transition-all duration-150",
    expression: "text-gray-500 text-xs sm:text-sm",
    result: "text-gray-800 text-lg sm:text-xl lg:text-2xl",
    clearButton:
      "text-xs sm:text-sm transition-colors duration-150 px-2 sm:px-3 py-1 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-200/50",
  },
};

// Memoized history item component
const HistoryItem = memo(({ item, onLoadHistory, isDarkMode }) => {
  const theme = THEME_CLASSES[isDarkMode ? "dark" : "light"];

  const handleLoadClick = useCallback(() => {
    onLoadHistory(item.result);
  }, [item.result, onLoadHistory]);

  return (
    <div className={theme.historyItem}>
      <button
        onClick={handleLoadClick}
        className={theme.historyButton}
        aria-label={`Load result ${item.result}`}
      >
        <div className={`mb-1 sm:mb-2 font-light ${theme.expression}`}>
          {item.expression}
        </div>
        <div className={`font-semibold ${theme.result}`}>
          {formatDisplay(item.result)}
        </div>
      </button>
    </div>
  );
});

HistoryItem.displayName = "HistoryItem";

export default function HistoryTab({
  history,
  onLoadHistory,
  onClearHistory,
  isDarkMode = true,
}) {
  // Early return for empty history
  if (history.length === 0) {
    const theme = THEME_CLASSES[isDarkMode ? "dark" : "light"];
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div
            className={`text-center ${theme.container} text-sm font-medium mb-1 empty-state-title`}
          >
            There's no history yet
          </div>
        </div>
        <div className="flex-shrink-0 p-4 flex justify-end clear-button-fixed">
          <button
            onClick={onClearHistory}
            className={theme.clearButton}
            aria-label="Clear all history"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  const theme = THEME_CLASSES[isDarkMode ? "dark" : "light"];

  // Sort history items by timestamp (newest first) once
  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  return (
    <div className="h-full flex flex-col">
      {/* Scrollable Content Container */}
      <div className="flex-1 sidebar-scroll-container">
        <div className="h-full overflow-y-auto sidebar-scroll space-y-3">
          {sortedHistory.map((item) => (
            <HistoryItem
              key={item.timestamp}
              item={item}
              onLoadHistory={onLoadHistory}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>
      </div>

      {/* Fixed Clear Button */}
      <div className="flex-shrink-0 p-4 flex justify-end clear-button-fixed">
        <button
          onClick={onClearHistory}
          className={theme.clearButton}
          aria-label="Clear all memory"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
