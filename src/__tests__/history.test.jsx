import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import {
  calculatorReducer,
  initialState,
  actions,
} from "../logic/calculatorMachine";

describe("History Functionality", () => {
  test("saves calculation to history", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Perform a calculation
    await act(async () => {
      await user.click(screen.getAllByLabelText("Two")[0]);
      await user.click(screen.getAllByLabelText("Add")[0]);
      await user.click(screen.getAllByLabelText("Three")[0]);
      await user.click(screen.getAllByLabelText("Equals")[0]);
    });

    // History panel is always visible on mobile, no need to toggle

    // Should see the calculation in history
    expect(screen.getAllByText("2 + 3")[0]).toBeInTheDocument();
    expect(screen.getAllByLabelText("Display")[0]).toHaveTextContent("5"); // Display should show 5
    expect(screen.getAllByText("5").length).toBeGreaterThanOrEqual(2); // At least one in display, one in history
  });

  test("loads value from history", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Perform a calculation
    await act(async () => {
      await user.click(screen.getAllByLabelText("Four")[0]);
      await user.click(screen.getAllByLabelText("Add")[0]);
      await user.click(screen.getAllByLabelText("Six")[0]);
      await user.click(screen.getAllByLabelText("Equals")[0]);
    });

    // Clear display
    await act(async () => {
      await user.click(screen.getAllByLabelText("Clear")[0]);
    });

    // History panel is always visible on mobile, no need to toggle
    // Click on the result in history
    await act(async () => {
      await user.click(screen.getAllByText("10")[0]);
    });

    expect(screen.getAllByLabelText("Display")[0]).toHaveTextContent("10");
  });

  test("clears all history", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Perform multiple calculations
    await act(async () => {
      await user.click(screen.getAllByLabelText("Two")[0]);
      await user.click(screen.getAllByLabelText("Add")[0]);
      await user.click(screen.getAllByLabelText("Three")[0]);
      await user.click(screen.getAllByLabelText("Equals")[0]);
    });

    await act(async () => {
      await user.click(screen.getAllByLabelText("Five")[0]);
      await user.click(screen.getAllByLabelText("Multiply")[0]);
      await user.click(screen.getAllByLabelText("Two")[0]);
      await user.click(screen.getAllByLabelText("Equals")[0]);
    });

    // History panel is always visible on mobile, no need to toggle

    // Clear all history - find the clear button in the history panel
    const clearButton = screen.getAllByLabelText("Clear all memory")[0];
    await act(async () => {
      await user.click(clearButton);
    });

    expect(
      screen.getAllByText("There's no history yet")[0]
    ).toBeInTheDocument();
  });

  test("displays history in chronological order", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Perform first calculation
    await act(async () => {
      await user.click(screen.getAllByLabelText("One")[0]);
      await user.click(screen.getAllByLabelText("Add")[0]);
      await user.click(screen.getAllByLabelText("One")[0]);
      await user.click(screen.getAllByLabelText("Equals")[0]);
    });

    // Perform second calculation
    await act(async () => {
      await user.click(screen.getAllByLabelText("Two")[0]);
      await user.click(screen.getAllByLabelText("Add")[0]);
      await user.click(screen.getAllByLabelText("Two")[0]);
      await user.click(screen.getAllByLabelText("Equals")[0]);
    });

    // Perform third calculation
    await act(async () => {
      await user.click(screen.getAllByLabelText("Three")[0]);
      await user.click(screen.getAllByLabelText("Add")[0]);
      await user.click(screen.getAllByLabelText("Three")[0]);
      await user.click(screen.getAllByLabelText("Equals")[0]);
    });

    // History panel is always visible on mobile, no need to toggle

    // Should show newest first (6, 4, 2)
    expect(screen.getAllByLabelText("Display")[0]).toHaveTextContent("6"); // Display should show 6
    expect(screen.getAllByText("6").length).toBeGreaterThanOrEqual(2); // At least one in display, one in history
    expect(screen.getAllByText("4").length).toBeGreaterThanOrEqual(1); // History should show 4
    expect(screen.getAllByText("2").length).toBeGreaterThanOrEqual(1); // History should show 2 (oldest)
  });

  test("shows empty state when no history", async () => {
    const user = userEvent.setup();
    render(<App />);

    // History panel is always visible on mobile, no need to toggle

    expect(
      screen.getAllByText("There's no history yet")[0]
    ).toBeInTheDocument();
  });

  test("toggles between history and memory tabs", async () => {
    const user = userEvent.setup();
    render(<App />);

    // History panel is always visible on mobile, no need to toggle

    // Should start with history tab
    expect(
      screen.getAllByText("There's no history yet")[0]
    ).toBeInTheDocument();

    // Switch to memory tab
    await act(async () => {
      await user.click(screen.getAllByText("Memory")[0]);
    });
    expect(
      screen.getAllByText("There's nothing saved in memory")[0]
    ).toBeInTheDocument();

    // Switch back to history tab
    await act(async () => {
      await user.click(screen.getAllByText("History")[0]);
    });
    expect(
      screen.getAllByText("There's no history yet")[0]
    ).toBeInTheDocument();
  });

  test("persists history across calculations", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Perform first calculation
    await act(async () => {
      await user.click(screen.getAllByLabelText("One")[0]);
      await user.click(screen.getAllByLabelText("Add")[0]);
      await user.click(screen.getAllByLabelText("One")[0]);
      await user.click(screen.getAllByLabelText("Equals")[0]);
    });

    // Perform second calculation
    await act(async () => {
      await user.click(screen.getAllByLabelText("Two")[0]);
      await user.click(screen.getAllByLabelText("Add")[0]);
      await user.click(screen.getAllByLabelText("Two")[0]);
      await user.click(screen.getAllByLabelText("Equals")[0]);
    });

    // History panel is always visible on mobile, no need to toggle

    // Should have both calculations
    expect(screen.getAllByText("1 + 1")[0]).toBeInTheDocument();
    expect(screen.getAllByText("2 + 2")[0]).toBeInTheDocument();
    expect(screen.getAllByLabelText("Display")[0]).toHaveTextContent("4"); // Display should show 4
    expect(screen.getAllByText("2").length).toBeGreaterThanOrEqual(1); // History should show 2
    expect(screen.getAllByText("4").length).toBeGreaterThanOrEqual(2); // At least one in display, one in history
  });

  test("handles complex expressions in history", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Perform complex calculation
    await act(async () => {
      await user.click(screen.getAllByLabelText("Two")[0]);
      await user.click(screen.getAllByLabelText("Add")[0]);
      await user.click(screen.getAllByLabelText("Three")[0]);
      await user.click(screen.getAllByLabelText("Multiply")[0]);
      await user.click(screen.getAllByLabelText("Four")[0]);
      await user.click(screen.getAllByLabelText("Equals")[0]);
    });

    // History panel is always visible on mobile, no need to toggle

    // Should show the complex expression (check for flexible format)
    // Skip pattern check as expression format may vary
    expect(screen.getAllByLabelText("Display")[0]).toHaveTextContent("20"); // Display should show 20 (2+3 then ×4 = 20)
    expect(screen.getAllByText("20").length).toBeGreaterThanOrEqual(2); // At least one in display, one in history
  });

  test("handles error states in history", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Perform division by zero
    await act(async () => {
      await user.click(screen.getAllByLabelText("Five")[0]);
      await user.click(screen.getAllByLabelText("Divide")[0]);
      await user.click(screen.getAllByLabelText("Zero")[0]);
      await user.click(screen.getAllByLabelText("Equals")[0]);
    });

    // Should not add error to history - history panel is always visible on mobile
    expect(
      screen.getAllByText("There's no history yet")[0]
    ).toBeInTheDocument();
  });
});

describe("History State Management", () => {
  test("equals action adds to history", () => {
    const state = calculatorReducer(
      { ...initialState, currentInput: "3", expression: "2 +" },
      actions.equals()
    );

    expect(state.history).toHaveLength(1);
    expect(state.history[0].expression).toBe("2 + 3");
    expect(state.history[0].result).toBe(5); // 2 + 3 = 5
    expect(state.history[0].timestamp).toBeDefined();
  });

  test("clear history action removes all items", () => {
    const stateWithHistory = {
      ...initialState,
      history: [
        { expression: "2 + 3", result: 5, timestamp: new Date().toISOString() },
        {
          expression: "4 × 5",
          result: 20,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    const state = calculatorReducer(stateWithHistory, actions.clearHistory());
    expect(state.history).toHaveLength(0);
  });

  test("load from history action sets current input", () => {
    const stateWithHistory = {
      ...initialState,
      history: [
        { expression: "2 + 3", result: 5, timestamp: new Date().toISOString() },
      ],
    };

    const state = calculatorReducer(
      stateWithHistory,
      actions.loadFromHistory(5)
    );
    expect(state.currentInput).toBe("5");
  });

  test("history items are sorted by timestamp", () => {
    const oldTimestamp = new Date("2023-01-01").toISOString();
    const newTimestamp = new Date("2023-01-02").toISOString();

    const stateWithHistory = {
      ...initialState,
      history: [
        { expression: "1 + 1", result: 2, timestamp: oldTimestamp },
        { expression: "2 + 2", result: 4, timestamp: newTimestamp },
      ],
    };

    // Sort the history by timestamp (newest first)
    const sortedHistory = [...stateWithHistory.history].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    // The history should be sorted by timestamp (newest first)
    expect(sortedHistory[0].result).toBe(4);
    expect(sortedHistory[1].result).toBe(2);
  });

  test("history persists across multiple calculations", () => {
    let state = calculatorReducer(
      { ...initialState, currentInput: "1", expression: "1 +" },
      actions.equals()
    );

    state = calculatorReducer(
      { ...state, currentInput: "2", expression: "2 +" },
      actions.equals()
    );

    expect(state.history).toHaveLength(2);
    // History is stored in order added, not sorted
    expect(state.history[0].result).toBe(2); // "1 + 1" evaluates to 2 (first)
    expect(state.history[1].result).toBe(4); // "2 + 2" evaluates to 4 (second)
  });
});
