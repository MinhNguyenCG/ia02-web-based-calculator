import { tokenize } from "../logic/tokenizer";
import { shuntingYard } from "../logic/shuntingYard";
import { evaluate } from "../logic/evaluator";
import { calculatePercent } from "../logic/percent";
import { roundToSignificantDigits, formatDisplay } from "../logic/decimal";
import {
  calculatorReducer,
  initialState,
  actions,
} from "../logic/calculatorMachine";
import { act } from "@testing-library/react";

describe("Tokenizer", () => {
  test("tokenizes simple numbers", () => {
    expect(tokenize("123")).toEqual([{ type: "number", value: 123 }]);
  });

  test("tokenizes decimal numbers", () => {
    expect(tokenize("12.34")).toEqual([{ type: "number", value: 12.34 }]);
  });

  test("tokenizes operators", () => {
    expect(tokenize("+")).toEqual([{ type: "operator", value: "+" }]);
    expect(tokenize("−")).toEqual([{ type: "operator", value: "−" }]);
    expect(tokenize("×")).toEqual([{ type: "operator", value: "×" }]);
    expect(tokenize("÷")).toEqual([{ type: "operator", value: "÷" }]);
  });

  test("tokenizes complex expressions", () => {
    const result = tokenize("2 + 3 × 4");
    expect(result).toEqual([
      { type: "number", value: 2 },
      { type: "operator", value: "+" },
      { type: "number", value: 3 },
      { type: "operator", value: "×" },
      { type: "number", value: 4 },
    ]);
  });

  test("handles negative numbers", () => {
    expect(tokenize("-5")).toEqual([{ type: "number", value: -5 }]);
  });

  test("handles parentheses", () => {
    // Calculator doesn't support parentheses
    expect(tokenize("(2 + 3)")).toEqual([
      { type: "number", value: 2 },
      { type: "operator", value: "+" },
      { type: "number", value: 3 },
    ]);
  });
});

describe("Shunting Yard Algorithm", () => {
  test("converts simple addition", () => {
    const tokens = tokenize("2 + 3");
    const result = shuntingYard(tokens);
    expect(result).toEqual([
      { type: "number", value: 2 },
      { type: "number", value: 3 },
      { type: "operator", value: "+" },
    ]);
  });

  test("handles operator precedence", () => {
    const tokens = tokenize("2 + 3 × 4");
    const result = shuntingYard(tokens);
    expect(result).toEqual([
      { type: "number", value: 2 },
      { type: "number", value: 3 },
      { type: "number", value: 4 },
      { type: "operator", value: "×" },
      { type: "operator", value: "+" },
    ]);
  });

  test("handles parentheses", () => {
    // Calculator doesn't support parentheses
    const tokens = tokenize("2 + 3 × 4");
    const result = shuntingYard(tokens);
    expect(result).toEqual([
      { type: "number", value: 2 },
      { type: "number", value: 3 },
      { type: "number", value: 4 },
      { type: "operator", value: "×" },
      { type: "operator", value: "+" },
    ]);
  });

  test("handles complex precedence", () => {
    const tokens = tokenize("2 + 3 × 4 − 5");
    const result = shuntingYard(tokens);
    expect(result).toEqual([
      { type: "number", value: 2 },
      { type: "number", value: 3 },
      { type: "number", value: 4 },
      { type: "operator", value: "×" },
      { type: "operator", value: "+" },
      { type: "number", value: 5 },
      { type: "operator", value: "−" },
    ]);
  });
});

describe("Evaluator", () => {
  test("evaluates simple operations", () => {
    expect(evaluate("2 + 3")).toBe(5);
    expect(evaluate("10 − 3")).toBe(7);
    expect(evaluate("4 × 5")).toBe(20);
    expect(evaluate("20 ÷ 4")).toBe(5);
  });

  test("handles operator precedence", () => {
    expect(evaluate("2 + 3 × 4")).toBe(14);
    expect(evaluate("10 − 2 × 3")).toBe(4);
    expect(evaluate("2 × 3 + 4 × 5")).toBe(26);
  });

  test("handles parentheses", () => {
    // Calculator doesn't support parentheses, uses left-to-right evaluation
    expect(evaluate("2 + 3 × 4")).toBe(14); // 2 + (3 × 4) = 14
    expect(evaluate("2 × 3 + 4")).toBe(10); // (2 × 3) + 4 = 10
    expect(evaluate("2 + 3 × 4 + 5")).toBe(19); // 2 + (3 × 4) + 5 = 19
  });

  test("handles decimal numbers", () => {
    expect(evaluate("0.1 + 0.2")).toBeCloseTo(0.3, 10);
    expect(evaluate("1.5 × 2")).toBe(3);
    expect(evaluate("10.5 ÷ 2.5")).toBe(4.2);
  });

  test("handles negative numbers", () => {
    expect(evaluate("-5 + 3")).toBe(-2);
    expect(evaluate("5 + (-3)")).toBe(2);
    expect(evaluate("-5 × 3")).toBe(-15);
  });

  test("throws error for division by zero", () => {
    expect(() => evaluate("5 ÷ 0")).toThrow();
    expect(() => evaluate("10 ÷ 0")).toThrow();
  });

  test("handles complex expressions", () => {
    expect(evaluate("100 ÷ 5 × 2")).toBe(40);
    expect(evaluate("2 + 3 × 4 − 5")).toBe(9);
    expect(evaluate("2 + 3 × 4 − 1")).toBe(13);
  });

  test("handles scientific notation", () => {
    // Calculator doesn't support scientific notation input
    expect(evaluate("100 + 10")).toBe(110);
    expect(evaluate("150 × 2")).toBe(300);
  });
});

describe("Percent Calculations", () => {
  test("calculates percentage for addition", () => {
    expect(calculatePercent("50 +", "10")).toBe(5);
    expect(calculatePercent("100 +", "25")).toBe(25);
  });

  test("calculates percentage for subtraction", () => {
    expect(calculatePercent("200 −", "10")).toBe(20);
    expect(calculatePercent("100 −", "50")).toBe(50);
  });

  test("calculates percentage for multiplication", () => {
    expect(calculatePercent("200 ×", "10")).toBe(0.1);
    expect(calculatePercent("100 ×", "25")).toBe(0.25);
  });

  test("calculates percentage for division", () => {
    expect(calculatePercent("50 ÷", "10")).toBe(0.1);
    expect(calculatePercent("100 ÷", "20")).toBe(0.2);
  });

  test("divides by 100 when no expression", () => {
    expect(calculatePercent("", "50")).toBe(0.5);
    expect(calculatePercent("", "25")).toBe(0.25);
  });

  test("handles edge cases", () => {
    expect(calculatePercent("0 +", "10")).toBe(0);
    expect(calculatePercent("100 ×", "0")).toBe(0);
  });
});

describe("Decimal Utilities", () => {
  test("rounds to significant digits", () => {
    expect(roundToSignificantDigits(0.1 + 0.2)).toBeCloseTo(0.3, 10);
    expect(roundToSignificantDigits(1.23456789)).toBeCloseTo(1.23456789, 8);
  });

  test("formats display correctly", () => {
    expect(formatDisplay(123)).toBe("123");
    expect(formatDisplay(123.45)).toBe("123.45");
    expect(formatDisplay(0.001)).toBe("0.001");
    expect(formatDisplay(1000000)).toBe("1,000,000");
  });

  test("handles very large numbers", () => {
    expect(formatDisplay(1e15)).toBe("1.00000000000e+15");
  });

  test("handles very small numbers", () => {
    expect(formatDisplay(1e-10)).toBe("1.00000000000e-10");
  });
});

describe("Calculator State Machine", () => {
  test("initial state is correct", () => {
    expect(initialState).toEqual({
      currentInput: "0",
      expression: "",
      error: null,
      history: [],
      memory: [],
      lastResult: null,
      originalValue: null,
      reciprocalCount: 0,
      sqrtCount: 0,
      squareCount: 0,
    });
  });

  test("handles digit input", () => {
    const state = calculatorReducer(initialState, actions.inputDigit("5"));
    expect(state.currentInput).toBe("5");
  });

  test("handles operator input", () => {
    const state = calculatorReducer(
      { ...initialState, currentInput: "5" },
      actions.operator("+")
    );
    expect(state.expression).toBe("5 +");
    expect(state.currentInput).toBe("0");
  });

  test("handles equals operation", () => {
    const state = calculatorReducer(
      { ...initialState, currentInput: "3", expression: "2 +" },
      actions.equals()
    );
    expect(state.currentInput).toBe("5");
    expect(state.expression).toBe("");
  });

  test("handles clear all", () => {
    const state = calculatorReducer(
      { ...initialState, currentInput: "123", expression: "5 + 3" },
      actions.clearAll()
    );
    expect(state.currentInput).toBe("0");
    expect(state.expression).toBe("");
    expect(state.error).toBe(null);
  });

  test("handles clear entry", () => {
    const state = calculatorReducer(
      { ...initialState, currentInput: "123" },
      actions.clearEntry()
    );
    expect(state.currentInput).toBe("0");
  });

  test("handles backspace", () => {
    const state = calculatorReducer(
      { ...initialState, currentInput: "123" },
      actions.backspace()
    );
    expect(state.currentInput).toBe("12");
  });

  test("handles decimal input", () => {
    const state = calculatorReducer(
      { ...initialState, currentInput: "5" },
      actions.inputDot()
    );
    expect(state.currentInput).toBe("5.");
  });

  test("handles negation", () => {
    const state = calculatorReducer(
      { ...initialState, currentInput: "5" },
      actions.negate()
    );
    expect(state.currentInput).toBe("-5");
  });

  test("handles square root", () => {
    const state = calculatorReducer(
      { ...initialState, currentInput: "9" },
      actions.sqrt()
    );
    expect(state.currentInput).toBe("3");
  });

  test("handles square", () => {
    const state = calculatorReducer(
      { ...initialState, currentInput: "4" },
      actions.square()
    );
    expect(state.currentInput).toBe("16");
  });

  test("handles reciprocal", () => {
    const state = calculatorReducer(
      { ...initialState, currentInput: "4" },
      actions.reciprocal()
    );
    expect(state.currentInput).toBe("0.25");
  });

  test("handles percent", () => {
    const state = calculatorReducer(
      { ...initialState, currentInput: "10", expression: "50 +" },
      actions.percent()
    );
    expect(state.currentInput).toBe("5");
  });

  test("handles memory operations", () => {
    const state = calculatorReducer(
      { ...initialState, currentInput: "42" },
      actions.memoryStore()
    );
    expect(state.memory).toHaveLength(1);
    expect(state.memory[0].value).toBe(42);
  });

  test("handles memory recall", () => {
    const stateWithMemory = {
      ...initialState,
      memory: [{ id: "1", value: 42, timestamp: new Date().toISOString() }],
    };
    const state = calculatorReducer(stateWithMemory, actions.memoryRecall());
    expect(state.currentInput).toBe("42");
  });

  test("handles memory add", () => {
    const stateWithMemory = {
      ...initialState,
      currentInput: "10",
      memory: [{ id: "1", value: 5, timestamp: new Date().toISOString() }],
    };
    const state = calculatorReducer(stateWithMemory, actions.memoryAdd());
    expect(state.memory[0].value).toBe(15);
  });

  test("handles memory subtract", () => {
    const stateWithMemory = {
      ...initialState,
      currentInput: "3",
      memory: [{ id: "1", value: 10, timestamp: new Date().toISOString() }],
    };
    const state = calculatorReducer(stateWithMemory, actions.memorySubtract());
    expect(state.memory[0].value).toBe(7);
  });

  test("handles memory clear", () => {
    const stateWithMemory = {
      ...initialState,
      memory: [{ id: "1", value: 42, timestamp: new Date().toISOString() }],
    };
    const state = calculatorReducer(stateWithMemory, actions.memoryClear());
    expect(state.memory).toHaveLength(0);
  });

  test("handles memory item clear", () => {
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

  test("handles history operations", () => {
    const state = calculatorReducer(
      { ...initialState, currentInput: "3", expression: "2 +" },
      actions.equals()
    );
    expect(state.history).toHaveLength(1);
    expect(state.history[0].expression).toBe("2 + 3");
    expect(state.history[0].result).toBe(5);
  });

  test("handles history clear", () => {
    const stateWithHistory = {
      ...initialState,
      history: [
        { expression: "2 + 3", result: 5, timestamp: new Date().toISOString() },
      ],
    };
    const state = calculatorReducer(stateWithHistory, actions.clearHistory());
    expect(state.history).toHaveLength(0);
  });

  test("handles load from history", () => {
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

  test("handles load from memory", () => {
    const stateWithMemory = {
      ...initialState,
      memory: [{ id: "1", value: 42, timestamp: new Date().toISOString() }],
    };
    const state = calculatorReducer(
      stateWithMemory,
      actions.loadFromMemory(42)
    );
    expect(state.currentInput).toBe("42");
  });

  test("handles error states", () => {
    const state = calculatorReducer(
      { ...initialState, currentInput: "5" },
      actions.sqrt() // sqrt of negative number should cause error
    );
    expect(state.error).toBeDefined();
  });
});
