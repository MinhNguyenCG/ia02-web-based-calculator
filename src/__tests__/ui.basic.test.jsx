import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

describe("Calculator UI", () => {
  test("renders calculator", () => {
    render(<App />);
    expect(screen.getAllByText("Standard")[0]).toBeInTheDocument();
    expect(screen.getAllByLabelText("Display")[0]).toBeInTheDocument();
  });

  test("displays initial value of 0", () => {
    render(<App />);
    expect(screen.getAllByLabelText("Display")[0]).toHaveTextContent("0");
  });

  test("handles digit input", async () => {
    const user = userEvent.setup();
    render(<App />);

    const button5 = screen.getAllByLabelText("Five")[0];
    await act(async () => {
      await user.click(button5);
    });

    expect(screen.getAllByLabelText("Display")[0]).toHaveTextContent("5");
  });

  test("performs basic addition", async () => {
    const user = userEvent.setup();
    render(<App />);

    await act(async () => {
      await user.click(screen.getAllByLabelText("Two")[0]);
      await user.click(screen.getAllByLabelText("Add")[0]);
      await user.click(screen.getAllByLabelText("Three")[0]);
      await user.click(screen.getAllByLabelText("Equals")[0]);
    });

    expect(screen.getAllByLabelText("Display")[0]).toHaveTextContent("5");
  });

  test("clears display with CE", async () => {
    const user = userEvent.setup();
    render(<App />);

    await act(async () => {
      await user.click(screen.getAllByLabelText("Five")[0]);
      await user.click(screen.getAllByLabelText("Clear Entry")[0]);
    });

    expect(screen.getAllByLabelText("Display")[0]).toHaveTextContent("0");
  });

  test("clears all with C", async () => {
    const user = userEvent.setup();
    render(<App />);

    await act(async () => {
      await user.click(screen.getAllByLabelText("Two")[0]);
      await user.click(screen.getAllByLabelText("Add")[0]);
      await user.click(screen.getAllByLabelText("Three")[0]);
      await user.click(screen.getAllByLabelText("Clear")[0]);
    });

    expect(screen.getAllByLabelText("Display")[0]).toHaveTextContent("0");
    expect(screen.getAllByLabelText("Expression")[0]).toHaveTextContent("");
  });

  test("handles backspace", async () => {
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

  test("displays error on division by zero", async () => {
    const user = userEvent.setup();
    render(<App />);

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

  test("calculates square root", async () => {
    const user = userEvent.setup();
    render(<App />);

    await act(async () => {
      await user.click(screen.getAllByLabelText("Nine")[0]);
      await user.click(screen.getAllByLabelText("Square root")[0]);
    });

    expect(screen.getAllByLabelText("Display")[0]).toHaveTextContent("3");
  });
});
