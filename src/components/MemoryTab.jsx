import { memo, useCallback } from "react";
import { formatDisplay } from "@/logic/decimal";
import { memoryTabTheme } from "@/utils/styleVariants";
import { Trash2 } from "lucide-react";

// Centralized theme in styleVariants

// Memoized control button component
const ControlButton = memo(({ onClick, label, ariaLabel, themeClasses }) => (
  <button onClick={onClick} className={themeClasses} aria-label={ariaLabel}>
    {label}
  </button>
));

ControlButton.displayName = "ControlButton";

// Memoized memory item component
const MemoryItem = memo(
  ({
    item,
    onLoadMemory,
    onMemoryAdd,
    onMemorySubtract,
    onMemoryItemClear,
    isDarkMode,
  }) => {
    const theme = memoryTabTheme(isDarkMode);

    const handleClearClick = useCallback(
      (e) => {
        e.stopPropagation();
        onMemoryItemClear(item.id);
      },
      [item.id, onMemoryItemClear]
    );

    const handleAddClick = useCallback(
      (e) => {
        e.stopPropagation();
        onMemoryAdd();
      },
      [onMemoryAdd]
    );

    const handleSubtractClick = useCallback(
      (e) => {
        e.stopPropagation();
        onMemorySubtract();
      },
      [onMemorySubtract]
    );

    const handleLoadClick = useCallback(() => {
      onLoadMemory(item.value);
    }, [item.value, onLoadMemory]);

    return (
      <div className={theme.memoryItem}>
        <div className={theme.valueButton}>
          <button
            onClick={handleLoadClick}
            className="w-full text-right"
            aria-label={`Load memory value ${item.value}`}
          >
            <div className={`font-semibold ${theme.value}`}>
              {formatDisplay(item.value)}
            </div>
          </button>

          <div className="flex gap-1 sm:gap-2 mt-1 sm:mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <ControlButton
              onClick={handleClearClick}
              label="MC"
              ariaLabel={`Clear memory item ${item.value}`}
              themeClasses={theme.controlButton}
            />
            <ControlButton
              onClick={handleAddClick}
              label="M+"
              ariaLabel="Add current value to first memory item"
              themeClasses={theme.controlButton}
            />
            <ControlButton
              onClick={handleSubtractClick}
              label="M-"
              ariaLabel="Subtract current value from first memory item"
              themeClasses={theme.controlButton}
            />
          </div>
        </div>
      </div>
    );
  }
);

MemoryItem.displayName = "MemoryItem";

export default function MemoryTab({
  memory,
  onLoadMemory,
  onClearMemory,
  onMemoryAdd,
  onMemorySubtract,
  onMemoryItemClear,
  isDarkMode = true,
}) {
  // Early return for empty memory
  if (memory.length === 0) {
    const theme = memoryTabTheme(isDarkMode);
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div
            className={`text-center ${theme.container} text-sm font-medium mb-1 empty-state-title`}
          >
            There's nothing saved in memory
          </div>
        </div>
        <div className="flex-shrink-0 p-4 flex justify-end clear-button-fixed">
          <button
            onClick={onClearMemory}
            className={theme.clearButton}
            aria-label="Clear all memory"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  const theme = memoryTabTheme(isDarkMode);

  // Sort memory items by timestamp (newest first) once
  const sortedMemory = [...memory].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  return (
    <div className="h-full flex flex-col">
      {/* Scrollable Content Container */}
      <div className="flex-1 sidebar-scroll-container">
        <div className="h-full overflow-y-auto sidebar-scroll space-y-1">
          {sortedMemory.map((item) => (
            <MemoryItem
              key={item.id}
              item={item}
              onLoadMemory={onLoadMemory}
              onMemoryAdd={onMemoryAdd}
              onMemorySubtract={onMemorySubtract}
              onMemoryItemClear={onMemoryItemClear}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>
      </div>

      {/* Fixed Clear Button */}
      <div className="flex-shrink-0 p-4 flex justify-end clear-button-fixed">
        <button
          onClick={onClearMemory}
          className={theme.clearButton}
          aria-label="Clear all memory"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
