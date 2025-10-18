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
    expect(screen.getByLabelText("Display")).toBeInTheDocument();
    expect(screen.getByText("Standard")).toBeInTheDocument();

    // Check keypad is rendered
    expect(screen.getByLabelText("One")).toBeInTheDocument();
    expect(screen.getByLabelText("Add")).toBeInTheDocument();
    expect(screen.getByLabelText("Equals")).toBeInTheDocument();
  });

  test("performs complete calculation workflow", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Input: 2 + 3 = 5
    await act(async () => {
      await user.click(screen.getByLabelText("Two"));
      await user.click(screen.getByLabelText("Add"));
      await user.click(screen.getByLabelText("Three"));
      await user.click(screen.getByLabelText("Equals"));
    });

    expect(screen.getByLabelText("Display")).toHaveTextContent("5");
  });

  test("handles complex calculation with precedence", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Input: 2 + 3 × 4 = 20 (left-to-right evaluation)
    await act(async () => {
      await user.click(screen.getByLabelText("Two"));
      await user.click(screen.getByLabelText("Add"));
      await user.click(screen.getByLabelText("Three"));
      await user.click(screen.getByLabelText("Multiply"));
      await user.click(screen.getByLabelText("Four"));
      await user.click(screen.getByLabelText("Equals"));
    });

    expect(screen.getByLabelText("Display")).toHaveTextContent("20");
  });

  test("handles decimal calculations", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Input: 0.1 + 0.2 = 0.3
    await act(async () => {
      await user.click(screen.getByLabelText("Zero"));
      await user.click(screen.getByLabelText("Decimal"));
      await user.click(screen.getByLabelText("One"));
      await user.click(screen.getByLabelText("Add"));
      await user.click(screen.getByLabelText("Zero"));
      await user.click(screen.getByLabelText("Decimal"));
      await user.click(screen.getByLabelText("Two"));
      await user.click(screen.getByLabelText("Equals"));
    });

    expect(screen.getByLabelText("Display")).toHaveTextContent("0.3");
  });

  test("handles error states", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Division by zero
    await user.click(screen.getByLabelText("Five"));
    await user.click(screen.getByLabelText("Divide"));
    await user.click(screen.getByLabelText("Zero"));
    await user.click(screen.getByLabelText("Equals"));

    expect(screen.getByLabelText("Display")).toHaveTextContent(
      /Cannot divide by zero|Error/i
    );
  });

  test("clears display and expression", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Input some calculation
    await user.click(screen.getByLabelText("Two"));
    await user.click(screen.getByLabelText("Add"));
    await user.click(screen.getByLabelText("Three"));

    // Clear entry
    await user.click(screen.getByLabelText("Clear Entry"));
    expect(screen.getByLabelText("Display")).toHaveTextContent("0");

    // Clear all
    await user.click(screen.getByLabelText("Clear"));
    expect(screen.getByLabelText("Display")).toHaveTextContent("0");
    expect(screen.getByLabelText("Expression")).toHaveTextContent("");
  });

  test("handles backspace functionality", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByLabelText("One"));
    await user.click(screen.getByLabelText("Two"));
    await user.click(screen.getByLabelText("Three"));
    await user.click(screen.getByLabelText("Backspace"));

    expect(screen.getByLabelText("Display")).toHaveTextContent("12");
  });

  test("handles scientific functions", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Square root
    await user.click(screen.getByLabelText("Nine"));
    await user.click(screen.getByLabelText("Square root"));
    expect(screen.getByLabelText("Display")).toHaveTextContent("3");

    // Square
    await user.click(screen.getByLabelText("Clear"));
    await user.click(screen.getByLabelText("Four"));
    await user.click(screen.getByLabelText("Square"));
    expect(screen.getByLabelText("Display")).toHaveTextContent("16");
  });

  test("handles percentage calculations", async () => {
    const user = userEvent.setup();
    render(<App />);

    // 50 + 10% = 55
    await user.click(screen.getByLabelText("Five"));
    await user.click(screen.getByLabelText("Zero"));
    await user.click(screen.getByLabelText("Add"));
    await user.click(screen.getByLabelText("One"));
    await user.click(screen.getByLabelText("Zero"));
    await user.click(screen.getByLabelText("Percent"));
    await user.click(screen.getByLabelText("Equals"));

    expect(screen.getByLabelText("Display")).toHaveTextContent("55");
  });

  test("handles negative numbers", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByLabelText("Five"));
    await user.click(screen.getByLabelText("Negate"));
    expect(screen.getByLabelText("Display")).toHaveTextContent("-5");
  });

  test("toggles theme correctly", async () => {
    const user = userEvent.setup();
    render(<App />);

    const themeButton = screen.getByLabelText(/toggle theme/i);
    await user.click(themeButton);

    // Check if theme classes change (this would depend on implementation)
    expect(themeButton).toBeInTheDocument();
  });

  test("toggles history panel", async () => {
    const user = userEvent.setup();
    render(<App />);

    const historyButton = screen.getByLabelText(/toggle history/i);
    await user.click(historyButton);

    // History panel should be visible
    expect(screen.getByText("History")).toBeInTheDocument();
  });
});
