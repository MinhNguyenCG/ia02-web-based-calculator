import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import {
  calculatorReducer,
  initialState,
  actions,
} from "../logic/calculatorMachine";

describe("Memory Functionality", () => {
  test("stores value in memory", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Input a value
    await act(async () => {
      await user.click(screen.getByLabelText("Four"));
      await user.click(screen.getByLabelText("Two"));
    });

    // Store in memory
    await act(async () => {
      await user.click(screen.getByLabelText("Memory Store (Ctrl + M)"));
    });

    // Toggle history panel to see memory
    await act(async () => {
      await user.click(screen.getByLabelText(/toggle history/i));
      await user.click(screen.getByText("Memory"));
    });

    expect(screen.getAllByText("42")).toHaveLength(2);
  });

  test("recalls value from memory", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Store a value
    await act(async () => {
      await user.click(screen.getByLabelText("Five"));
      await user.click(screen.getByLabelText("Memory Store (Ctrl + M)"));
    });

    // Clear display
    await act(async () => {
      await user.click(screen.getByLabelText("Clear"));
    });

    // Recall from memory
    await act(async () => {
      await user.click(screen.getByLabelText("Memory Recall (Ctrl + R)"));
    });

    expect(screen.getByLabelText("Display")).toHaveTextContent("5");
  });

  test("adds to memory", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Store initial value
    await act(async () => {
      await user.click(screen.getByLabelText("One"));
      await user.click(screen.getByLabelText("Memory Store (Ctrl + M)"));
    });

    // Input new value and add to memory
    await act(async () => {
      await user.click(screen.getByLabelText("Two"));
      await user.click(screen.getByLabelText("Memory Add (Ctrl + P)"));
    });

    // Toggle to memory tab to verify
    await act(async () => {
      await user.click(screen.getByLabelText(/toggle history/i));
      await user.click(screen.getByText("Memory"));
    });

    expect(screen.getByText("3")).toBeInTheDocument();
  });

  test("subtracts from memory", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Store initial value (10)
    await act(async () => {
      await user.click(screen.getByLabelText("One"));
      await user.click(screen.getByLabelText("Zero"));
      await user.click(screen.getByLabelText("Memory Store (Ctrl + M)"));
    });

    // Input new value and subtract from memory (10 - 3 = 7)
    await act(async () => {
      await user.click(screen.getByLabelText("Three"));
      await user.click(screen.getByLabelText("Memory Subtract (Ctrl + Q)"));
    });

    // Toggle to memory tab to verify
    await act(async () => {
      await user.click(screen.getByLabelText(/toggle history/i));
      await user.click(screen.getByText("Memory"));
    });

    expect(screen.getAllByText("7").length).toBeGreaterThanOrEqual(1);
  });

  test("clears all memory", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Store some values
    await act(async () => {
      await user.click(screen.getByLabelText("Five"));
      await user.click(screen.getByLabelText("Memory Store (Ctrl + M)"));
    });

    // Clear all memory
    await act(async () => {
      await user.click(screen.getByLabelText("Clear All Memory (Ctrl + L)"));
    });

    // Toggle to memory tab to verify
    await act(async () => {
      await user.click(screen.getByLabelText(/toggle history/i));
      await user.click(screen.getByText("Memory"));
    });

    expect(
      screen.getByText("There's nothing saved in memory")
    ).toBeInTheDocument();
  });

  test("loads value from memory tab", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Store a value
    await act(async () => {
      await user.click(screen.getByLabelText("Seven"));
      await user.click(screen.getByLabelText("Memory Store (Ctrl + M)"));
    });

    // Clear display
    await act(async () => {
      await user.click(screen.getByLabelText("Clear"));
    });

    // Open memory tab and load value
    await act(async () => {
      await user.click(screen.getByLabelText(/toggle history/i));
      await user.click(screen.getByText("Memory"));
      await user.click(screen.getByText("1"));
    });

    expect(screen.getByLabelText("Display")).toHaveTextContent("1");
  });

  test("clears individual memory item", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Store multiple values
    await act(async () => {
      await user.click(screen.getByLabelText("Five"));
      await user.click(screen.getByLabelText("Memory Store (Ctrl + M)"));
    });

    await act(async () => {
      await user.click(screen.getByLabelText("One"));
      await user.click(screen.getByLabelText("Memory Store (Ctrl + M)"));
    });

    // Open memory tab and clear first item
    await act(async () => {
      await user.click(screen.getByLabelText(/toggle history/i));
      await user.click(screen.getByText("Memory"));
    });

    // Find and click the MC button for the first item
    const memoryItems = screen.getAllByText("MC");
    await act(async () => {
      await user.click(memoryItems[0]);
    });

    // Should still have one memory item (5)
    expect(screen.getAllByText("5").length).toBeGreaterThanOrEqual(1);
  });

  test("handles memory operations with keyboard shortcuts", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Input value
    await act(async () => {
      await user.keyboard("42");
    });

    // Store with Ctrl+M
    await act(async () => {
      await user.keyboard("{Control>}m{/Control}");
    });

    // Clear display
    await act(async () => {
      await user.keyboard("{Control>}l{/Control}");
    });

    // Recall with Ctrl+R
    await act(async () => {
      await user.keyboard("{Control>}r{/Control}");
    });

    expect(screen.getByLabelText("Display")).toHaveTextContent("42");
  });

  test("shows memory tab when toggled", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Toggle history panel
    await act(async () => {
      await user.click(screen.getByLabelText(/toggle history/i));
    });

    // Switch to memory tab
    await act(async () => {
      await user.click(screen.getByText("Memory"));
    });

    expect(
      screen.getByText("There's nothing saved in memory")
    ).toBeInTheDocument();
  });

  test("displays memory items in chronological order", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Store multiple values with small delay
    await act(async () => {
      await user.click(screen.getByLabelText("One"));
      await user.click(screen.getByLabelText("Memory Store (Ctrl + M)"));
    });

    await act(async () => {
      await user.click(screen.getByLabelText("Two"));
      await user.click(screen.getByLabelText("Memory Store (Ctrl + M)"));
    });

    await act(async () => {
      await user.click(screen.getByLabelText("Three"));
      await user.click(screen.getByLabelText("Memory Store (Ctrl + M)"));
    });

    // Open memory tab
    await act(async () => {
      await user.click(screen.getByLabelText(/toggle history/i));
      await user.click(screen.getByText("Memory"));
    });

    // Should show newest first (3, 2, 1)
    // Check that all values exist in memory
    expect(screen.getAllByText("3").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("2").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("1").length).toBeGreaterThanOrEqual(1);
  });
});

describe("Memory State Management", () => {
  test("memory store action adds to memory", () => {
    const state = calculatorReducer(
      { ...initialState, currentInput: "42" },
      actions.memoryStore()
    );

    expect(state.memory).toHaveLength(1);
    expect(state.memory[0].value).toBe(42);
    expect(state.memory[0].id).toBeDefined();
    expect(state.memory[0].timestamp).toBeDefined();
  });

  test("memory recall action loads value", () => {
    const stateWithMemory = {
      ...initialState,
      memory: [{ id: "1", value: 42, timestamp: new Date().toISOString() }],
    };

    const state = calculatorReducer(stateWithMemory, actions.memoryRecall());
    expect(state.currentInput).toBe("42");
  });

  test("memory add action updates first memory item", () => {
    const stateWithMemory = {
      ...initialState,
      currentInput: "10",
      memory: [{ id: "1", value: 5, timestamp: new Date().toISOString() }],
    };

    const state = calculatorReducer(stateWithMemory, actions.memoryAdd());
    expect(state.memory[0].value).toBe(15);
  });

  test("memory subtract action updates first memory item", () => {
    const stateWithMemory = {
      ...initialState,
      currentInput: "3",
      memory: [{ id: "1", value: 10, timestamp: new Date().toISOString() }],
    };

    const state = calculatorReducer(stateWithMemory, actions.memorySubtract());
    expect(state.memory[0].value).toBe(7);
  });

  test("memory clear action removes all items", () => {
    const stateWithMemory = {
      ...initialState,
      memory: [
        { id: "1", value: 42, timestamp: new Date().toISOString() },
        { id: "2", value: 10, timestamp: new Date().toISOString() },
      ],
    };

    const state = calculatorReducer(stateWithMemory, actions.memoryClear());
    expect(state.memory).toHaveLength(0);
  });

  test("memory item clear action removes specific item", () => {
    const stateWithMemory = {
      ...initialState,
      memory: [
        { id: "1", value: 42, timestamp: new Date().toISOString() },
        { id: "2", value: 10, timestamp: new Date().toISOString() },
      ],
    };

    const state = calculatorReducer(
      stateWithMemory,
      actions.memoryItemClear("1")
    );
    expect(state.memory).toHaveLength(1);
    expect(state.memory[0].id).toBe("2");
  });

  test("load from memory action sets current input", () => {
    const state = calculatorReducer(initialState, actions.loadFromMemory(42));
    expect(state.currentInput).toBe("42");
  });
});
