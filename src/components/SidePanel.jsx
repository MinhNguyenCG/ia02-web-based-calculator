import HistoryTab from "@/components/HistoryTab";
import MemoryTab from "@/components/MemoryTab";
import { borderMuted } from "@/utils/styleVariants";

export default function SidePanel({
  activeTab,
  onTabChange,
  history,
  onLoadHistory,
  onClearHistory,
  memory,
  onLoadMemory,
  onClearMemory,
  onMemoryAdd,
  onMemorySubtract,
  onMemoryItemClear,
  isDarkMode = true,
}) {
  return (
    <div className="w-full lg:w-96 xl:w-80 py-6 h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="flex mb-6 px-6">
        <button
          onClick={() => onTabChange("history")}
          className={`px-4 py-2 text-sm font-medium transition-all duration-150 relative ${
            activeTab === "history"
              ? isDarkMode
                ? "text-cyan-400"
                : "text-blue-600"
              : isDarkMode
              ? "text-slate-400 hover:text-white"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          History
          {activeTab === "history" && (
            <div
              className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-0.5 ${
                isDarkMode ? "bg-cyan-400" : "bg-blue-600"
              }`}
            />
          )}
        </button>
        <button
          onClick={() => onTabChange("memory")}
          className={`px-4 py-2 text-sm font-medium transition-all duration-150 relative ${
            activeTab === "memory"
              ? isDarkMode
                ? "text-cyan-400"
                : "text-blue-600"
              : isDarkMode
              ? "text-slate-400 hover:text-white"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          Memory
          {activeTab === "memory" && (
            <div
              className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-0.5 ${
                isDarkMode ? "bg-cyan-400" : "bg-blue-600"
              }`}
            />
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 flex flex-col min-h-0 text-white">
        {activeTab === "history" ? (
          <HistoryTab
            history={history}
            onLoadHistory={onLoadHistory}
            onClearHistory={onClearHistory}
            isDarkMode={isDarkMode}
          />
        ) : (
          <MemoryTab
            memory={memory}
            onLoadMemory={onLoadMemory}
            onClearMemory={onClearMemory}
            onMemoryAdd={onMemoryAdd}
            onMemorySubtract={onMemorySubtract}
            onMemoryItemClear={onMemoryItemClear}
            isDarkMode={isDarkMode}
          />
        )}
      </div>
    </div>
  );
}
