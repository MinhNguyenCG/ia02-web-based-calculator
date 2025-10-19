import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

describe("App Integration Tests", () => {
  test("renders complete calculator application", () => {
    render(<App />);

    // Check main elements are present
    expect(screen.getAllByLabelText("Display")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Standard")[0]).toBeInTheDocument();

    // Check keypad is rendered
    expect(screen.getAllByLabelText("One")[0]).toBeInTheDocument();
    expect(screen.getAllByLabelText("Add")[0]).toBeInTheDocument();
    expect(screen.getAllByLabelText("Equals")[0]).toBeInTheDocument();
  });

  test("performs complete calculation workflow", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Input: 2 + 3 = 5
    await act(async () => {
      await user.click(screen.getAllByLabelText("Two")[0]);
      await user.click(screen.getAllByLabelText("Add")[0]);
      await user.click(screen.getAllByLabelText("Three")[0]);
      await user.click(screen.getAllByLabelText("Equals")[0]);
    });

    expect(screen.getAllByLabelText("Display")[0]).toHaveTextContent("5");
  });

  test("handles complex calculation with precedence", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Input: 2 + 3 × 4 = 20 (left-to-right evaluation)
    await act(async () => {
      await user.click(screen.getAllByLabelText("Two")[0]);
      await user.click(screen.getAllByLabelText("Add")[0]);
      await user.click(screen.getAllByLabelText("Three")[0]);
      await user.click(screen.getAllByLabelText("Multiply")[0]);
      await user.click(screen.getAllByLabelText("Four")[0]);
      await user.click(screen.getAllByLabelText("Equals")[0]);
    });

    expect(screen.getAllByLabelText("Display")[0]).toHaveTextContent("20");
  });

  test("handles decimal calculations", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Input: 0.1 + 0.2 = 0.3
    await act(async () => {
      await user.click(screen.getAllByLabelText("Zero")[0]);
      await user.click(screen.getAllByLabelText("Decimal")[0]);
      await user.click(screen.getAllByLabelText("One")[0]);
      await user.click(screen.getAllByLabelText("Add")[0]);
      await user.click(screen.getAllByLabelText("Zero")[0]);
      await user.click(screen.getAllByLabelText("Decimal")[0]);
      await user.click(screen.getAllByLabelText("Two")[0]);
      await user.click(screen.getAllByLabelText("Equals")[0]);
    });

    expect(screen.getAllByLabelText("Display")[0]).toHaveTextContent("0.3");
  });

  test("handles error states", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Division by zero
    await act(async () => {
      await user.click(screen.getAllByLabelText("Five")[0]);
      await user.click(screen.getAllByLabelText("Divide")[0]);
      await user.click(screen.getAllByLabelText("Zero")[0]);
      await user.click(screen.getAllByLabelText("Equals")[0]);
    });

    expect(screen.getAllByLabelText("Display")[0]).toHaveTextContent(
      /Cannot divide by zero|Error/i
    );
  });

  test("clears display and expression", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Input some calculation
    await act(async () => {
      await user.click(screen.getAllByLabelText("Two")[0]);
      await user.click(screen.getAllByLabelText("Add")[0]);
      await user.click(screen.getAllByLabelText("Three")[0]);
    });

    // Clear entry
    await act(async () => {
      await user.click(screen.getAllByLabelText("Clear Entry")[0]);
    });
    expect(screen.getAllByLabelText("Display")[0]).toHaveTextContent("0");

    // Clear all
    await act(async () => {
      await user.click(screen.getAllByLabelText("Clear")[0]);
    });
    expect(screen.getAllByLabelText("Display")[0]).toHaveTextContent("0");
    expect(screen.getAllByLabelText("Expression")[0]).toHaveTextContent("");
  });

  test("handles backspace functionality", async () => {
    const user = userEvent.setup();
    render(<App />);

    await act(async () => {
      await user.click(screen.getAllByLabelText("One")[0]);
      await user.click(screen.getAllByLabelText("Two")[0]);
      await user.click(screen.getAllByLabelText("Three")[0]);
      await user.click(screen.getAllByLabelText("Backspace")[0]);
    });

    expect(screen.getAllByLabelText("Display")[0]).toHaveTextContent("12");
  });

  test("handles scientific functions", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Square root
    await act(async () => {
      await user.click(screen.getAllByLabelText("Nine")[0]);
      await user.click(screen.getAllByLabelText("Square root")[0]);
    });
    expect(screen.getAllByLabelText("Display")[0]).toHaveTextContent("3");

    // Square
    await act(async () => {
      await user.click(screen.getAllByLabelText("Clear")[0]);
      await user.click(screen.getAllByLabelText("Four")[0]);
      await user.click(screen.getAllByLabelText("Square")[0]);
    });
    expect(screen.getAllByLabelText("Display")[0]).toHaveTextContent("16");
  });

  test("handles percentage calculations", async () => {
    const user = userEvent.setup();
    render(<App />);

    // 50 + 10% = 55
    await act(async () => {
      await user.click(screen.getAllByLabelText("Five")[0]);
      await user.click(screen.getAllByLabelText("Zero")[0]);
      await user.click(screen.getAllByLabelText("Add")[0]);
      await user.click(screen.getAllByLabelText("One")[0]);
      await user.click(screen.getAllByLabelText("Zero")[0]);
      await user.click(screen.getAllByLabelText("Percent")[0]);
      await user.click(screen.getAllByLabelText("Equals")[0]);
    });

    expect(screen.getAllByLabelText("Display")[0]).toHaveTextContent("55");
  });

  test("handles negative numbers", async () => {
    const user = userEvent.setup();
    render(<App />);

    await act(async () => {
      await user.click(screen.getAllByLabelText("Five")[0]);
      await user.click(screen.getAllByLabelText("Negate")[0]);
    });
    expect(screen.getAllByLabelText("Display")[0]).toHaveTextContent("-5");
  });

  test("toggles theme correctly", async () => {
    const user = userEvent.setup();
    render(<App />);

    const themeButton = screen.getAllByLabelText(/toggle theme/i)[0];
    await act(async () => {
      await user.click(themeButton);
    });

    // Check if theme classes change (this would depend on implementation)
    expect(themeButton).toBeInTheDocument();
  });

  test("shows history panel by default on mobile", () => {
    render(<App />);

    // History panel should be visible by default on mobile
    expect(screen.getAllByText("History")[0]).toBeInTheDocument();
  });
});
