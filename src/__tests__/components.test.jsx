import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Display from "../components/Display";
import Key from "../components/Key";
import Keypad from "../components/Keypad";
import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import HistoryTab from "../components/HistoryTab";
import MemoryTab from "../components/MemoryTab";
import MemoryButton from "../components/MemoryButton";

describe("Display Component", () => {
  test("renders with initial value", () => {
    render(<Display currentInput="0" />);
    expect(screen.getByLabelText("Display")).toHaveTextContent("0");
  });

  test("displays expression and current input", () => {
    render(<Display expression="2 + 3" currentInput="5" />);
    expect(screen.getByLabelText("Expression")).toHaveTextContent("2 + 3");
    expect(screen.getByLabelText("Display")).toHaveTextContent("5");
  });

  test("displays error message", () => {
    render(<Display error="Cannot divide by zero" />);
    expect(screen.getByLabelText("Display")).toHaveTextContent(
      "Cannot divide by zero"
    );
  });

  test("handles dark mode styling", () => {
    render(<Display currentInput="123" isDarkMode={true} />);
    const display = screen.getByLabelText("Display");
    expect(display).toHaveClass("text-white");
  });

  test("handles light mode styling", () => {
    render(<Display currentInput="123" isDarkMode={false} />);
    const display = screen.getByLabelText("Display");
    expect(display).toHaveClass("text-gray-900");
  });
});

describe("Key Component", () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  test("renders number key correctly", () => {
    render(
      <Key
        label="5"
        value="5"
        onClick={mockOnClick}
        variant="number"
        ariaLabel="Five"
      />
    );

    const button = screen.getByLabelText("Five");
    expect(button).toHaveTextContent("5");
    expect(button).toHaveClass("calc-key");
  });

  test("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    render(
      <Key
        label="5"
        value="5"
        onClick={mockOnClick}
        variant="number"
        ariaLabel="Five"
      />
    );

    await user.click(screen.getByLabelText("Five"));
    expect(mockOnClick).toHaveBeenCalledWith("5");
  });

  test("applies correct variant styling", () => {
    render(
      <Key
        label="="
        value="="
        onClick={mockOnClick}
        variant="equals"
        ariaLabel="Equals"
      />
    );

    const button = screen.getByLabelText("Equals");
    expect(button).toHaveClass("calc-key");
  });

  test("handles keyboard interaction", async () => {
    const user = userEvent.setup();
    render(
      <Key
        label="5"
        value="5"
        onClick={mockOnClick}
        variant="number"
        ariaLabel="Five"
      />
    );

    const button = screen.getByLabelText("Five");
    button.focus();
    await user.keyboard("{Enter}");

    expect(mockOnClick).toHaveBeenCalledWith("5");
  });
});

describe("Keypad Component", () => {
  const mockOnAction = jest.fn();

  beforeEach(() => {
    mockOnAction.mockClear();
  });

  test("renders all number keys", () => {
    render(<Keypad onAction={mockOnAction} />);

    for (let i = 0; i <= 9; i++) {
      expect(
        screen.getByLabelText(
          i === 0
            ? "Zero"
            : `${
                i === 1
                  ? "One"
                  : i === 2
                  ? "Two"
                  : i === 3
                  ? "Three"
                  : i === 4
                  ? "Four"
                  : i === 5
                  ? "Five"
                  : i === 6
                  ? "Six"
                  : i === 7
                  ? "Seven"
                  : i === 8
                  ? "Eight"
                  : "Nine"
              }`
        )
      ).toBeInTheDocument();
    }
  });

  test("renders operation keys", () => {
    render(<Keypad onAction={mockOnAction} />);

    expect(screen.getByLabelText("Add")).toBeInTheDocument();
    expect(screen.getByLabelText("Subtract")).toBeInTheDocument();
    expect(screen.getByLabelText("Multiply")).toBeInTheDocument();
    expect(screen.getByLabelText("Divide")).toBeInTheDocument();
    expect(screen.getByLabelText("Equals")).toBeInTheDocument();
  });

  test("renders function keys", () => {
    render(<Keypad onAction={mockOnAction} />);

    expect(screen.getByLabelText("Clear")).toBeInTheDocument();
    expect(screen.getByLabelText("Clear Entry")).toBeInTheDocument();
    expect(screen.getByLabelText("Backspace")).toBeInTheDocument();
    expect(screen.getByLabelText("Square root")).toBeInTheDocument();
    expect(screen.getByLabelText("Square")).toBeInTheDocument();
  });

  test("handles digit input", async () => {
    const user = userEvent.setup();
    render(<Keypad onAction={mockOnAction} />);

    await user.click(screen.getByLabelText("Five"));
    expect(mockOnAction).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "INPUT_DIGIT",
        payload: "5",
      })
    );
  });

  test("handles operation input", async () => {
    const user = userEvent.setup();
    render(<Keypad onAction={mockOnAction} />);

    await user.click(screen.getByLabelText("Add"));
    expect(mockOnAction).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "OPERATOR",
        payload: "+",
      })
    );
  });

  test("handles clear operations", async () => {
    const user = userEvent.setup();
    render(<Keypad onAction={mockOnAction} />);

    await user.click(screen.getByLabelText("Clear"));
    expect(mockOnAction).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "CLEAR_ALL",
      })
    );

    await user.click(screen.getByLabelText("Clear Entry"));
    expect(mockOnAction).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "CLEAR_ENTRY",
      })
    );
  });
});

describe("Header Component", () => {
  const mockOnToggleTheme = jest.fn();
  const mockOnToggleHistory = jest.fn();

  beforeEach(() => {
    mockOnToggleTheme.mockClear();
    mockOnToggleHistory.mockClear();
  });

  test("renders header with title", () => {
    render(
      <Header
        onToggleTheme={mockOnToggleTheme}
        onToggleHistory={mockOnToggleHistory}
      />
    );

    expect(screen.getByText("Standard")).toBeInTheDocument();
  });

  test("renders theme toggle button", () => {
    render(
      <Header
        onToggleTheme={mockOnToggleTheme}
        onToggleHistory={mockOnToggleHistory}
      />
    );

    const themeButton = screen.getByLabelText(/toggle theme/i);
    expect(themeButton).toBeInTheDocument();
  });

  test("renders history toggle button", () => {
    render(
      <Header
        onToggleTheme={mockOnToggleTheme}
        onToggleHistory={mockOnToggleHistory}
      />
    );

    const historyButton = screen.getByLabelText(/toggle history/i);
    expect(historyButton).toBeInTheDocument();
  });

  test("calls toggle functions when buttons clicked", async () => {
    const user = userEvent.setup();
    render(
      <Header
        onToggleTheme={mockOnToggleTheme}
        onToggleHistory={mockOnToggleHistory}
      />
    );

    await user.click(screen.getByLabelText(/toggle theme/i));
    expect(mockOnToggleTheme).toHaveBeenCalled();

    await user.click(screen.getByLabelText(/toggle history/i));
    expect(mockOnToggleHistory).toHaveBeenCalled();
  });
});

describe("MemoryButton Component", () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  test("renders memory button with label", () => {
    render(
      <MemoryButton
        label="MC"
        value="MC"
        onClick={mockOnClick}
        tooltip="Clear All Memory"
      />
    );

    expect(screen.getByLabelText("Clear All Memory")).toBeInTheDocument();
  });

  test("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    render(
      <MemoryButton
        label="MC"
        value="MC"
        onClick={mockOnClick}
        tooltip="Clear All Memory"
      />
    );

    await user.click(screen.getByLabelText("Clear All Memory"));
    expect(mockOnClick).toHaveBeenCalledWith("MC");
  });

  test("shows tooltip on hover", async () => {
    const user = userEvent.setup();
    render(
      <MemoryButton
        label="MC"
        value="MC"
        onClick={mockOnClick}
        tooltip="Clear All Memory"
      />
    );

    const button = screen.getByLabelText("Clear All Memory");
    await user.hover(button);

    expect(screen.getByText("Clear All Memory")).toBeInTheDocument();
  });
});

describe("HistoryTab Component", () => {
  const mockOnLoadHistory = jest.fn();
  const mockOnClearHistory = jest.fn();

  beforeEach(() => {
    mockOnLoadHistory.mockClear();
    mockOnClearHistory.mockClear();
  });

  test("renders empty state when no history", () => {
    render(
      <HistoryTab
        history={[]}
        onLoadHistory={mockOnLoadHistory}
        onClearHistory={mockOnClearHistory}
      />
    );

    expect(screen.getByText("There's no history yet")).toBeInTheDocument();
  });

  test("renders history items", () => {
    const history = [
      {
        expression: "2 + 3",
        result: 5,
        timestamp: new Date().toISOString(),
      },
    ];

    render(
      <HistoryTab
        history={history}
        onLoadHistory={mockOnLoadHistory}
        onClearHistory={mockOnClearHistory}
      />
    );

    expect(screen.getByText("2 + 3")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  test("calls onLoadHistory when history item clicked", async () => {
    const user = userEvent.setup();
    const history = [
      {
        expression: "2 + 3",
        result: 5,
        timestamp: new Date().toISOString(),
      },
    ];

    render(
      <HistoryTab
        history={history}
        onLoadHistory={mockOnLoadHistory}
        onClearHistory={mockOnClearHistory}
      />
    );

    await user.click(screen.getByText("5"));
    expect(mockOnLoadHistory).toHaveBeenCalledWith(5);
  });

  test("calls onClearHistory when clear button clicked", async () => {
    const user = userEvent.setup();
    const history = [
      {
        expression: "2 + 3",
        result: 5,
        timestamp: new Date().toISOString(),
      },
    ];

    render(
      <HistoryTab
        history={history}
        onLoadHistory={mockOnLoadHistory}
        onClearHistory={mockOnClearHistory}
      />
    );

    await user.click(screen.getByLabelText("Clear all history"));
    expect(mockOnClearHistory).toHaveBeenCalled();
  });
});

describe("MemoryTab Component", () => {
  const mockOnLoadMemory = jest.fn();
  const mockOnClearMemory = jest.fn();
  const mockOnMemoryAdd = jest.fn();
  const mockOnMemorySubtract = jest.fn();
  const mockOnMemoryItemClear = jest.fn();

  beforeEach(() => {
    mockOnLoadMemory.mockClear();
    mockOnClearMemory.mockClear();
    mockOnMemoryAdd.mockClear();
    mockOnMemorySubtract.mockClear();
    mockOnMemoryItemClear.mockClear();
  });

  test("renders empty state when no memory", () => {
    render(
      <MemoryTab
        memory={[]}
        onLoadMemory={mockOnLoadMemory}
        onClearMemory={mockOnClearMemory}
        onMemoryAdd={mockOnMemoryAdd}
        onMemorySubtract={mockOnMemorySubtract}
        onMemoryItemClear={mockOnMemoryItemClear}
      />
    );

    expect(
      screen.getByText("There's nothing saved in memory")
    ).toBeInTheDocument();
  });

  test("renders memory items", () => {
    const memory = [
      {
        id: "1",
        value: 42,
        timestamp: new Date().toISOString(),
      },
    ];

    render(
      <MemoryTab
        memory={memory}
        onLoadMemory={mockOnLoadMemory}
        onClearMemory={mockOnClearMemory}
        onMemoryAdd={mockOnMemoryAdd}
        onMemorySubtract={mockOnMemorySubtract}
        onMemoryItemClear={mockOnMemoryItemClear}
      />
    );

    expect(screen.getByText("42")).toBeInTheDocument();
  });

  test("calls onLoadMemory when memory item clicked", async () => {
    const user = userEvent.setup();
    const memory = [
      {
        id: "1",
        value: 42,
        timestamp: new Date().toISOString(),
      },
    ];

    render(
      <MemoryTab
        memory={memory}
        onLoadMemory={mockOnLoadMemory}
        onClearMemory={mockOnClearMemory}
        onMemoryAdd={mockOnMemoryAdd}
        onMemorySubtract={mockOnMemorySubtract}
        onMemoryItemClear={mockOnMemoryItemClear}
      />
    );

    await user.click(screen.getByText("42"));
    expect(mockOnLoadMemory).toHaveBeenCalledWith(42);
  });
});

describe("SidePanel Component", () => {
  const mockOnTabChange = jest.fn();
  const mockOnLoadHistory = jest.fn();
  const mockOnClearHistory = jest.fn();
  const mockOnLoadMemory = jest.fn();
  const mockOnClearMemory = jest.fn();
  const mockOnMemoryAdd = jest.fn();
  const mockOnMemorySubtract = jest.fn();
  const mockOnMemoryItemClear = jest.fn();

  beforeEach(() => {
    mockOnTabChange.mockClear();
    mockOnLoadHistory.mockClear();
    mockOnClearHistory.mockClear();
    mockOnLoadMemory.mockClear();
    mockOnClearMemory.mockClear();
    mockOnMemoryAdd.mockClear();
    mockOnMemorySubtract.mockClear();
    mockOnMemoryItemClear.mockClear();
  });

  test("renders tab navigation", () => {
    render(
      <SidePanel
        activeTab="history"
        onTabChange={mockOnTabChange}
        history={[]}
        onLoadHistory={mockOnLoadHistory}
        onClearHistory={mockOnClearHistory}
        memory={[]}
        onLoadMemory={mockOnLoadMemory}
        onClearMemory={mockOnClearMemory}
        onMemoryAdd={mockOnMemoryAdd}
        onMemorySubtract={mockOnMemorySubtract}
        onMemoryItemClear={mockOnMemoryItemClear}
      />
    );

    expect(screen.getByText("History")).toBeInTheDocument();
    expect(screen.getByText("Memory")).toBeInTheDocument();
  });

  test("switches between tabs", async () => {
    const user = userEvent.setup();
    render(
      <SidePanel
        activeTab="history"
        onTabChange={mockOnTabChange}
        history={[]}
        onLoadHistory={mockOnLoadHistory}
        onClearHistory={mockOnClearHistory}
        memory={[]}
        onLoadMemory={mockOnLoadMemory}
        onClearMemory={mockOnClearMemory}
        onMemoryAdd={mockOnMemoryAdd}
        onMemorySubtract={mockOnMemorySubtract}
        onMemoryItemClear={mockOnMemoryItemClear}
      />
    );

    await user.click(screen.getByText("Memory"));
    expect(mockOnTabChange).toHaveBeenCalledWith("memory");
  });

  test("shows history tab by default", () => {
    render(
      <SidePanel
        activeTab="history"
        onTabChange={mockOnTabChange}
        history={[]}
        onLoadHistory={mockOnLoadHistory}
        onClearHistory={mockOnClearHistory}
        memory={[]}
        onLoadMemory={mockOnLoadMemory}
        onClearMemory={mockOnClearMemory}
        onMemoryAdd={mockOnMemoryAdd}
        onMemorySubtract={mockOnMemorySubtract}
        onMemoryItemClear={mockOnMemoryItemClear}
      />
    );

    expect(screen.getByText("There's no history yet")).toBeInTheDocument();
  });

  test("shows memory tab when active", () => {
    render(
      <SidePanel
        activeTab="memory"
        onTabChange={mockOnTabChange}
        history={[]}
        onLoadHistory={mockOnLoadHistory}
        onClearHistory={mockOnClearHistory}
        memory={[]}
        onLoadMemory={mockOnLoadMemory}
        onClearMemory={mockOnClearMemory}
        onMemoryAdd={mockOnMemoryAdd}
        onMemorySubtract={mockOnMemorySubtract}
        onMemoryItemClear={mockOnMemoryItemClear}
      />
    );

    expect(
      screen.getByText("There's nothing saved in memory")
    ).toBeInTheDocument();
  });
});
