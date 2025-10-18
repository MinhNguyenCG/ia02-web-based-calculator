import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

describe("Calculator UI", () => {
  test("renders calculator", () => {
    render(<App />);
    expect(screen.getByText("Standard")).toBeInTheDocument();
    expect(screen.getByLabelText("Display")).toBeInTheDocument();
  });

  test("displays initial value of 0", () => {
    render(<App />);
    expect(screen.getByLabelText("Display")).toHaveTextContent("0");
  });

  test("handles digit input", async () => {
    const user = userEvent.setup();
    render(<App />);

    const button5 = screen.getByLabelText("Five");
    await act(async () => {
      await user.click(button5);
    });

    expect(screen.getByLabelText("Display")).toHaveTextContent("5");
  });

  test("performs basic addition", async () => {
    const user = userEvent.setup();
    render(<App />);

    await act(async () => {
      await user.click(screen.getByLabelText("Two"));
      await user.click(screen.getByLabelText("Add"));
      await user.click(screen.getByLabelText("Three"));
      await user.click(screen.getByLabelText("Equals"));
    });

    expect(screen.getByLabelText("Display")).toHaveTextContent("5");
  });

  test("clears display with CE", async () => {
    const user = userEvent.setup();
    render(<App />);

    await act(async () => {
      await user.click(screen.getByLabelText("Five"));
      await user.click(screen.getByLabelText("Clear Entry"));
    });

    expect(screen.getByLabelText("Display")).toHaveTextContent("0");
  });

  test("clears all with C", async () => {
    const user = userEvent.setup();
    render(<App />);

    await act(async () => {
      await user.click(screen.getByLabelText("Two"));
      await user.click(screen.getByLabelText("Add"));
      await user.click(screen.getByLabelText("Three"));
      await user.click(screen.getByLabelText("Clear"));
    });

    expect(screen.getByLabelText("Display")).toHaveTextContent("0");
    expect(screen.getByLabelText("Expression")).toHaveTextContent("");
  });

  test("handles backspace", async () => {
    const user = userEvent.setup();
    render(<App />);

    await act(async () => {
      await user.click(screen.getByLabelText("One"));
      await user.click(screen.getByLabelText("Two"));
      await user.click(screen.getByLabelText("Three"));
      await user.click(screen.getByLabelText("Backspace"));
    });

    expect(screen.getByLabelText("Display")).toHaveTextContent("12");
  });

  test("displays error on division by zero", async () => {
    const user = userEvent.setup();
    render(<App />);

    await act(async () => {
      await user.click(screen.getByLabelText("Five"));
      await user.click(screen.getByLabelText("Divide"));
      await user.click(screen.getByLabelText("Zero"));
      await user.click(screen.getByLabelText("Equals"));
    });

    expect(screen.getByLabelText("Display")).toHaveTextContent(
      /Cannot divide by zero|Error/i
    );
  });

  test("calculates square root", async () => {
    const user = userEvent.setup();
    render(<App />);

    await act(async () => {
      await user.click(screen.getByLabelText("Nine"));
      await user.click(screen.getByLabelText("Square root"));
    });

    expect(screen.getByLabelText("Display")).toHaveTextContent("3");
  });
});
