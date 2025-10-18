import { useState, useReducer, useCallback } from "react";
import Display from "@/components/Display";
import Keypad from "@/components/Keypad";
import Header from "@/components/Header";
import SidePanel from "@/components/SidePanel";
import useKeyboard from "@/hooks/useKeyboard";
import {
  surfaceGradient,
  cardGradient,
  borderMuted,
} from "@/utils/styleVariants";
import {
  calculatorReducer,
  initialState,
  actions,
} from "@/logic/calculatorMachine";

export default function App() {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState("history"); // 'history' or 'memory'

  const handleAction = useCallback((action) => {
    dispatch(action);
  }, []);

  useKeyboard(handleAction);

  const toggleHistory = () => {
    setHistoryVisible(!historyVisible);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleLoadMemory = (value) => {
    handleAction(actions.loadFromMemory(value));
  };

  const handleClearMemory = () => {
    handleAction(actions.memoryClear());
  };

  const handleMemoryAdd = () => {
    handleAction(actions.memoryAdd());
  };

  const handleMemorySubtract = () => {
    handleAction(actions.memorySubtract());
  };

  const handleMemoryItemClear = (id) => {
    handleAction(actions.memoryItemClear(id));
  };

  return (
    <div
      className={`calc-container flex items-center justify-center p-2 sm:p-4 transition-all duration-300 ${surfaceGradient(
        isDarkMode
      )}`}
    >
      <div className="w-full h-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-4xl xl:max-w-6xl flex flex-col">
        {/* Combined Calculator and Side Panel Card */}
        <div
          className={`rounded-md shadow-sm overflow-hidden backdrop-blur-sm border h-full flex flex-col ${cardGradient(
            isDarkMode
          )} ${borderMuted(isDarkMode)}`}
        >
          <div className="flex flex-col lg:flex-row h-full">
            {/* Main Calculator */}
            <div className="flex-1 min-w-0 flex flex-col">
              {/* Header */}
              <Header
                isDarkMode={isDarkMode}
                onToggleTheme={toggleTheme}
                onToggleHistory={toggleHistory}
              />

              {/* Display */}
              <Display
                expression={state.expression}
                currentInput={state.currentInput}
                error={state.error}
                isDarkMode={isDarkMode}
              />

              {/* Keypad */}
              <Keypad onAction={handleAction} isDarkMode={isDarkMode} />
            </div>

            {/* Side Panel */}
            <div
              className={`${
                historyVisible ? "block" : "hidden"
              } lg:block flex flex-col`}
            >
              <div
                className={`h-full border-l flex flex-col ${borderMuted(
                  isDarkMode
                )}`}
              >
                <SidePanel
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                  history={state.history}
                  onLoadHistory={(value) =>
                    handleAction(actions.loadFromHistory(value))
                  }
                  onClearHistory={() => handleAction(actions.clearHistory())}
                  memory={state.memory}
                  onLoadMemory={handleLoadMemory}
                  onClearMemory={handleClearMemory}
                  onMemoryAdd={handleMemoryAdd}
                  onMemorySubtract={handleMemorySubtract}
                  onMemoryItemClear={handleMemoryItemClear}
                  isDarkMode={isDarkMode}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
