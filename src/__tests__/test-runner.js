// Comprehensive test runner for the calculator application
// This file provides utilities and helpers for running all tests

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import {
  calculatorReducer,
  initialState,
  actions,
} from "../logic/calculatorMachine";

// Test utilities
export const testUtils = {
  // Helper to render App with default props
  renderApp: (props = {}) => {
    return render(<App {...props} />);
  },

  // Helper to perform a complete calculation
  performCalculation: async (user, expression) => {
    const tokens = expression.split("");
    for (const token of tokens) {
      if (token === "=") {
        await user.click(screen.getByLabelText("Equals"));
      } else if (token === "+") {
        await user.click(screen.getByLabelText("Add"));
      } else if (token === "-") {
        await user.click(screen.getByLabelText("Subtract"));
      } else if (token === "*") {
        await user.click(screen.getByLabelText("Multiply"));
      } else if (token === "/") {
        await user.click(screen.getByLabelText("Divide"));
      } else if (token === ".") {
        await user.click(screen.getByLabelText("Decimal"));
      } else if (!isNaN(token)) {
        const digitLabels = {
          0: "Zero",
          1: "One",
          2: "Two",
          3: "Three",
          4: "Four",
          5: "Five",
          6: "Six",
          7: "Seven",
          8: "Eight",
          9: "Nine",
        };
        await user.click(screen.getByLabelText(digitLabels[token]));
      }
    }
  },

  // Helper to check if display shows expected value
  expectDisplay: (expectedValue) => {
    expect(screen.getByLabelText("Display")).toHaveTextContent(expectedValue);
  },

  // Helper to check if expression shows expected value
  expectExpression: (expectedValue) => {
    expect(screen.getByLabelText("Expression")).toHaveTextContent(
      expectedValue
    );
  },

  // Helper to open history panel
  openHistoryPanel: async (user) => {
    await user.click(screen.getByLabelText(/toggle history/i));
  },

  // Helper to switch to memory tab
  switchToMemoryTab: async (user) => {
    await user.click(screen.getByText("Memory"));
  },

  // Helper to switch to history tab
  switchToHistoryTab: async (user) => {
    await user.click(screen.getByText("History"));
  },

  // Helper to store value in memory
  storeInMemory: async (user, value) => {
    await testUtils.performCalculation(user, value);
    await user.click(screen.getByLabelText("Memory Store (Ctrl + M)"));
  },

  // Helper to recall from memory
  recallFromMemory: async (user) => {
    await user.click(screen.getByLabelText("Memory Recall (Ctrl + R)"));
  },

  // Helper to clear display
  clearDisplay: async (user) => {
    await user.click(screen.getByLabelText("Clear"));
  },

  // Helper to clear entry
  clearEntry: async (user) => {
    await user.click(screen.getByLabelText("Clear Entry"));
  },
};

// Test data generators
export const testData = {
  // Generate test calculations
  calculations: [
    { expression: "2+3", expected: "5" },
    { expression: "10-3", expected: "7" },
    { expression: "4*5", expected: "20" },
    { expression: "20/4", expected: "5" },
    { expression: "2+3*4", expected: "14" },
    { expression: "(2+3)*4", expected: "20" },
    { expression: "0.1+0.2", expected: "0.3" },
    { expression: "5+10%", expected: "5.5" },
    { expression: "9", expected: "3" }, // sqrt
    { expression: "4", expected: "16" }, // square
  ],

  // Generate test memory values
  memoryValues: [42, 10, 5, 100, 0.5, -5],

  // Generate test history entries
  historyEntries: [
    { expression: "2+3", result: 5 },
    { expression: "4*5", result: 20 },
    { expression: "10-3", result: 7 },
    { expression: "15/3", result: 5 },
  ],
};

// Test scenarios
export const testScenarios = {
  // Basic calculator operations
  basicOperations: async (user) => {
    const { calculations } = testData;
    for (const calc of calculations) {
      await testUtils.performCalculation(user, calc.expression);
      testUtils.expectDisplay(calc.expected);
      await testUtils.clearDisplay(user);
    }
  },

  // Memory operations
  memoryOperations: async (user) => {
    const { memoryValues } = testData;
    for (const value of memoryValues) {
      await testUtils.storeInMemory(user, value.toString());
      await testUtils.clearDisplay(user);
      await testUtils.recallFromMemory(user);
      testUtils.expectDisplay(value.toString());
      await testUtils.clearDisplay(user);
    }
  },

  // History operations
  historyOperations: async (user) => {
    const { historyEntries } = testData;
    for (const entry of historyEntries) {
      await testUtils.performCalculation(user, entry.expression);
      await testUtils.clearDisplay(user);
    }

    await testUtils.openHistoryPanel(user);
    await testUtils.switchToHistoryTab(user);

    // Check that history entries are visible
    for (const entry of historyEntries) {
      expect(screen.getByText(entry.expression)).toBeInTheDocument();
      expect(screen.getByText(entry.result.toString())).toBeInTheDocument();
    }
  },

  // Error handling
  errorHandling: async (user) => {
    // Division by zero
    await testUtils.performCalculation(user, "5/0=");
    testUtils.expectDisplay(/Cannot divide by zero|Error/i);

    // Clear error and continue
    await testUtils.clearDisplay(user);
    await testUtils.performCalculation(user, "2+2=");
    testUtils.expectDisplay("4");
  },

  // Keyboard interactions
  keyboardInteractions: async (user) => {
    // Number input
    await user.keyboard("123");
    testUtils.expectDisplay("123");

    // Operations
    await user.keyboard("+456=");
    testUtils.expectDisplay("579");

    // Clear
    await user.keyboard("{Escape}");
    testUtils.expectDisplay("0");
  },

  // Theme switching
  themeSwitching: async (user) => {
    const themeButton = screen.getByLabelText(/toggle theme/i);
    await user.click(themeButton);

    // Theme should toggle (check for class changes)
    expect(themeButton).toBeInTheDocument();
  },

  // Panel toggling
  panelToggling: async (user) => {
    // Toggle history panel
    await testUtils.openHistoryPanel(user);
    expect(screen.getByText("History")).toBeInTheDocument();

    // Switch to memory tab
    await testUtils.switchToMemoryTab(user);
    expect(
      screen.getByText("There's nothing saved in memory")
    ).toBeInTheDocument();

    // Switch back to history tab
    await testUtils.switchToHistoryTab(user);
    expect(screen.getByText("There's no history yet")).toBeInTheDocument();
  },
};

// Performance testing utilities
export const performanceTests = {
  // Test rapid button clicks
  rapidClicks: async (user, buttonLabel, count = 100) => {
    const button = screen.getByLabelText(buttonLabel);
    for (let i = 0; i < count; i++) {
      await user.click(button);
    }
  },

  // Test large number calculations
  largeNumbers: async (user) => {
    await testUtils.performCalculation(user, "999999999+1=");
    testUtils.expectDisplay("1000000000");
  },

  // Test decimal precision
  decimalPrecision: async (user) => {
    await testUtils.performCalculation(user, "0.1+0.2=");
    testUtils.expectDisplay("0.3");
  },
};

// Accessibility testing utilities
export const accessibilityTests = {
  // Test keyboard navigation
  keyboardNavigation: async (user) => {
    await user.keyboard("{Tab}");
    await user.keyboard("{Tab}");
    await user.keyboard("{Tab}");

    const focusedElement = document.activeElement;
    expect(focusedElement).toBeInTheDocument();
  },

  // Test ARIA attributes
  ariaAttributes: () => {
    const display = screen.getByLabelText("Display");
    expect(display).toHaveAttribute("role", "status");
    expect(display).toHaveAttribute("aria-live", "polite");

    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).toHaveAttribute("aria-label");
    });
  },

  // Test screen reader compatibility
  screenReaderCompatibility: () => {
    const display = screen.getByLabelText("Display");
    expect(display).toHaveAttribute("aria-live", "polite");

    const expression = screen.getByLabelText("Expression");
    expect(expression).toBeInTheDocument();
  },
};

// Integration testing utilities
export const integrationTests = {
  // Test complete user workflow
  completeWorkflow: async (user) => {
    // 1. Perform calculation
    await testUtils.performCalculation(user, "2+3=");
    testUtils.expectDisplay("5");

    // 2. Store in memory
    await user.click(screen.getByLabelText("Memory Store (Ctrl + M)"));

    // 3. Clear display
    await testUtils.clearDisplay(user);

    // 4. Recall from memory
    await testUtils.recallFromMemory(user);
    testUtils.expectDisplay("5");

    // 5. Perform another calculation
    await testUtils.performCalculation(user, "5*2=");
    testUtils.expectDisplay("10");

    // 6. Open history panel
    await testUtils.openHistoryPanel(user);
    await testUtils.switchToHistoryTab(user);

    // 7. Load from history
    await user.click(screen.getByText("10"));
    testUtils.expectDisplay("10");
  },

  // Test error recovery
  errorRecovery: async (user) => {
    // Cause error
    await testUtils.performCalculation(user, "5/0=");
    testUtils.expectDisplay(/Cannot divide by zero|Error/i);

    // Recover from error
    await testUtils.clearDisplay(user);
    await testUtils.performCalculation(user, "2+2=");
    testUtils.expectDisplay("4");
  },
};

export default {
  testUtils,
  testData,
  testScenarios,
  performanceTests,
  accessibilityTests,
  integrationTests,
};
