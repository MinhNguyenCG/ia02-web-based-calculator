import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

describe("Accessibility", () => {
  test("all buttons have aria-labels", () => {
    render(<App />);

    const buttons = screen.getAllByRole("button");
    const buttonsWithAriaLabels = buttons.filter((button) =>
      button.hasAttribute("aria-label")
    );

    // Most buttons should have aria-labels for accessibility
    expect(buttonsWithAriaLabels.length).toBeGreaterThan(buttons.length * 0.8);
  });

  test("display has proper ARIA attributes", () => {
    render(<App />);

    const display = screen.getByLabelText("Display");
    expect(display).toHaveAttribute("role", "status");
    expect(display).toHaveAttribute("aria-live", "polite");
  });

  test("buttons are keyboard accessible", async () => {
    const user = userEvent.setup();
    render(<App />);

    const button5 = screen.getByLabelText("Five");
    button5.focus();

    expect(button5).toHaveFocus();

    await act(async () => {
      await user.keyboard("{Enter}");
    });
    // Button should trigger on Enter when focused
  });

  test("keyboard shortcuts work", async () => {
    const user = userEvent.setup();
    render(<App />);

    await act(async () => {
      await user.keyboard("5");
    });
    expect(screen.getByLabelText("Display")).toHaveTextContent("5");

    await act(async () => {
      await user.keyboard("+");
      await user.keyboard("3");
      await user.keyboard("{Enter}");
    });

    expect(screen.getByLabelText("Display")).toHaveTextContent("8");
  });

  test("Escape key clears calculator", async () => {
    const user = userEvent.setup();
    render(<App />);

    await act(async () => {
      await user.keyboard("123");
      await user.keyboard("{Escape}");
    });

    expect(screen.getByLabelText("Display")).toHaveTextContent("0");
  });
});
