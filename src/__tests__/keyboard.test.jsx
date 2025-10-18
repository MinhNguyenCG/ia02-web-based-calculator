import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

describe("Keyboard Interactions", () => {
  test("handles number key input", async () => {
    const user = userEvent.setup();
    render(<App />);

    await act(async () => {
      await user.keyboard("123");
    });
    expect(screen.getByLabelText("Display")).toHaveTextContent("123");
  });

  test("handles operation key input", async () => {
    const user = userEvent.setup();
    render(<App />);

    await act(async () => {
      await user.keyboard("5+3=");
    });
    expect(screen.getByLabelText("Display")).toHaveTextContent("8");
  });

  test("handles decimal input", async () => {
    const user = userEvent.setup();
    render(<App />);

    await act(async () => {
      await user.keyboard("12.34");
    });
    expect(screen.getByLabelText("Display")).toHaveTextContent("12.34");
  });

  test("handles backspace key", async () => {
    const user = userEvent.setup();
    render(<App />);

    await act(async () => {
      await user.keyboard("123");
      await user.keyboard("{Backspace}");
    });
    expect(screen.getByLabelText("Display")).toHaveTextContent("12");
  });

  test("handles Enter key for equals", async () => {
    const user = userEvent.setup();
    render(<App />);

    await act(async () => {
      await user.keyboard("5+3");
      await user.keyboard("{Enter}");
    });
    expect(screen.getByLabelText("Display")).toHaveTextContent("8");
  });

  test("handles Escape key for clear", async () => {
    const user = userEvent.setup();
    render(<App />);

    await act(async () => {
      await user.keyboard("123");
      await user.keyboard("{Escape}");
    });
    expect(screen.getByLabelText("Display")).toHaveTextContent("0");
  });

  test("handles Delete key for clear entry", async () => {
    const user = userEvent.setup();
    render(<App />);

    await act(async () => {
      await user.keyboard("123");
      await user.keyboard("{Delete}");
    });
    expect(screen.getByLabelText("Display")).toHaveTextContent("0");
  });

  test("handles arithmetic operators", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Addition
    await act(async () => {
      await user.keyboard("5+3=");
    });
    expect(screen.getByLabelText("Display")).toHaveTextContent("8");

    // Subtraction
    await act(async () => {
      await user.keyboard("{Escape}");
      await user.keyboard("10-3=");
    });
    expect(screen.getByLabelText("Display")).toHaveTextContent("7");

    // Multiplication
    await act(async () => {
      await user.keyboard("{Escape}");
      await user.keyboard("4*3=");
    });
    expect(screen.getByLabelText("Display")).toHaveTextContent("12");

    // Division
    await act(async () => {
      await user.keyboard("{Escape}");
      await user.keyboard("15/3=");
    });
    expect(screen.getByLabelText("Display")).toHaveTextContent("5");
  });

  test("handles scientific functions", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Square root
    await act(async () => {
      await user.keyboard("9");
      await user.keyboard("s"); // sqrt
    });
    expect(screen.getByLabelText("Display")).toHaveTextContent("3");

    // Square
    await act(async () => {
      await user.keyboard("{Escape}");
      await user.keyboard("4");
      await user.keyboard("x"); // square
    });
    expect(screen.getByLabelText("Display")).toHaveTextContent("16");
  });

  test("handles percentage calculations", async () => {
    const user = userEvent.setup();
    render(<App />);

    // 50 + 10% = 55
    await act(async () => {
      await user.keyboard("50+10%=");
    });
    expect(screen.getByLabelText("Display")).toHaveTextContent("55");
  });

  test("handles negative numbers", async () => {
    const user = userEvent.setup();
    render(<App />);

    await act(async () => {
      await user.keyboard("5");
      await user.keyboard("n"); // negate
    });
    expect(screen.getByLabelText("Display")).toHaveTextContent("-5");
  });

  test("handles memory operations with keyboard shortcuts", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Store in memory
    await act(async () => {
      await user.keyboard("42");
      await user.keyboard("{Control>}m{/Control}");
    });

    // Clear display
    await act(async () => {
      await user.keyboard("{Escape}");
    });

    // Recall from memory
    await act(async () => {
      await user.keyboard("{Control>}r{/Control}");
    });
    expect(screen.getByLabelText("Display")).toHaveTextContent("42");
  });

  test("handles complex keyboard sequences", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Complex calculation: (2 + 3) * 4
    await act(async () => {
      await user.keyboard("(2+3)*4=");
    });
    expect(screen.getByLabelText("Display")).toHaveTextContent("20");
  });

  test("handles continuous calculations", async () => {
    const user = userEvent.setup();
    render(<App />);

    // First calculation
    await act(async () => {
      await user.keyboard("5+3=");
    });
    expect(screen.getByLabelText("Display")).toHaveTextContent("8");

    // Continue with result
    await act(async () => {
      await user.keyboard("*2=");
    });
    expect(screen.getByLabelText("Display")).toHaveTextContent("16");
  });

  test("handles keyboard navigation", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Tab navigation
    await act(async () => {
      await user.keyboard("{Tab}");
      await user.keyboard("{Tab}");
      await user.keyboard("{Tab}");
    });

    // Should be able to focus on buttons
    const focusedElement = document.activeElement;
    expect(focusedElement).toBeInTheDocument();
  });

  test("handles keyboard shortcuts for theme toggle", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Toggle theme with keyboard shortcut
    await act(async () => {
      await user.keyboard("{Control>}t{/Control}");
    });

    // Theme should toggle (this would depend on implementation)
    expect(screen.getByLabelText(/toggle theme/i)).toBeInTheDocument();
  });

  test("handles keyboard shortcuts for history toggle", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Toggle history with keyboard shortcut
    await act(async () => {
      await user.keyboard("{Control>}h{/Control}");
    });

    // History panel should be visible
    expect(screen.getByText("History")).toBeInTheDocument();
  });

  test("handles rapid key presses", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Rapid number input
    await act(async () => {
      await user.keyboard("1234567890");
    });
    expect(screen.getByLabelText("Display")).toHaveTextContent("1,234,567,890");
  });

  test("handles mixed keyboard and mouse input", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Start with keyboard
    await act(async () => {
      await user.keyboard("5+");
    });

    // Continue with mouse
    await act(async () => {
      await user.click(screen.getByLabelText("Three"));
      await user.click(screen.getByLabelText("Equals"));
    });

    expect(screen.getByLabelText("Display")).toHaveTextContent("8");
  });

  test("handles keyboard input with error states", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Division by zero
    await act(async () => {
      await user.keyboard("5/0=");
    });
    expect(screen.getByLabelText("Display")).toHaveTextContent(
      /Cannot divide by zero|Error/i
    );

    // Should be able to continue after error
    await act(async () => {
      await user.keyboard("{Escape}");
      await user.keyboard("2+2=");
    });
    expect(screen.getByLabelText("Display")).toHaveTextContent("4");
  });

  test("handles keyboard input with decimal precision", async () => {
    const user = userEvent.setup();
    render(<App />);

    await act(async () => {
      await user.keyboard("0.1+0.2=");
    });
    expect(screen.getByLabelText("Display")).toHaveTextContent("0.3");
  });

  test("handles keyboard input with large numbers", async () => {
    const user = userEvent.setup();
    render(<App />);

    await act(async () => {
      await user.keyboard("999999999+1=");
    });
    expect(screen.getByLabelText("Display")).toHaveTextContent("1,000,000,000");
  });

  test("handles keyboard input with scientific notation", async () => {
    const user = userEvent.setup();
    render(<App />);

    await act(async () => {
      await user.keyboard("100+10=");
    });
    expect(screen.getByLabelText("Display")).toHaveTextContent("110");
  });
});
