import { evaluate } from "./evaluator";
import { calculatePercent } from "./percent";
import { formatResult, formatDisplayNumber } from "./decimal";

export const initialState = {
  currentInput: "0",
  expression: "",
  error: null,
  history: [],
  memory: [],
  lastResult: null,
  sqrtCount: 0,
  reciprocalCount: 0,
  squareCount: 0,
  originalValue: null,
};

export const actions = {
  inputDigit: (digit) => ({ type: "INPUT_DIGIT", payload: digit }),
  inputDot: () => ({ type: "INPUT_DOT" }),
  operator: (op) => ({ type: "OPERATOR", payload: op }),
  equals: () => ({ type: "EQUALS" }),
  clearAll: () => ({ type: "CLEAR_ALL" }),
  clearEntry: () => ({ type: "CLEAR_ENTRY" }),
  backspace: () => ({ type: "BACKSPACE" }),
  negate: () => ({ type: "NEGATE" }),
  sqrt: () => ({ type: "SQRT" }),
  square: () => ({ type: "SQUARE" }),
  reciprocal: () => ({ type: "RECIPROCAL" }),
  percent: () => ({ type: "PERCENT" }),
  loadFromHistory: (value) => ({ type: "LOAD_FROM_HISTORY", payload: value }),
  clearHistory: () => ({ type: "CLEAR_HISTORY" }),
  // Memory actions
  memoryAdd: () => ({ type: "MEMORY_ADD" }),
  memorySubtract: () => ({ type: "MEMORY_SUBTRACT" }),
  memoryStore: () => ({ type: "MEMORY_STORE" }),
  memoryRecall: () => ({ type: "MEMORY_RECALL" }),
  memoryClear: () => ({ type: "MEMORY_CLEAR" }),
  memoryItemClear: (id) => ({ type: "MEMORY_ITEM_CLEAR", payload: id }),
  loadFromMemory: (value) => ({ type: "LOAD_FROM_MEMORY", payload: value }),
};

export function calculatorReducer(state, action) {
  if (
    state.error &&
    action.type !== "CLEAR_ALL" &&
    action.type !== "INPUT_DIGIT"
  ) {
    if (action.type === "INPUT_DIGIT") {
      return {
        ...state,
        error: null,
        currentInput: action.payload,
        expression: "",
      };
    }
    return state;
  }

  switch (action.type) {
    case "INPUT_DIGIT": {
      const digit = action.payload;

      // Start fresh if we just calculated
      if (state.lastResult !== null && state.expression === "") {
        return {
          ...state,
          currentInput: digit,
          lastResult: null,
          sqrtCount: 0,
          reciprocalCount: 0,
          squareCount: 0,
          originalValue: null,
        };
      }

      // Reset operation counts when new digits are entered
      if (
        state.sqrtCount > 0 ||
        state.reciprocalCount > 0 ||
        state.squareCount > 0
      ) {
        return {
          ...state,
          currentInput:
            state.currentInput === "0" && digit !== "0"
              ? digit
              : state.currentInput + digit,
          sqrtCount: 0,
          reciprocalCount: 0,
          squareCount: 0,
          originalValue: null,
        };
      }

      // Prevent multiple leading zeros
      if (state.currentInput === "0" && digit === "0") {
        return state;
      }

      // Replace single 0 with new digit
      if (state.currentInput === "0" && digit !== "0") {
        return {
          ...state,
          currentInput: digit,
        };
      }

      return {
        ...state,
        currentInput: state.currentInput + digit,
      };
    }

    case "INPUT_DOT": {
      // Start fresh if we just calculated
      if (state.lastResult !== null && state.expression === "") {
        return {
          ...state,
          currentInput: "0.",
          lastResult: null,
          sqrtCount: 0,
          reciprocalCount: 0,
          squareCount: 0,
          originalValue: null,
        };
      }

      // Reset operation counts when adding decimal point
      if (
        state.sqrtCount > 0 ||
        state.reciprocalCount > 0 ||
        state.squareCount > 0
      ) {
        return {
          ...state,
          currentInput: state.currentInput + ".",
          sqrtCount: 0,
          reciprocalCount: 0,
          squareCount: 0,
          originalValue: null,
        };
      }

      // Prevent multiple dots
      if (state.currentInput.includes(".")) {
        return state;
      }

      // Add dot to current input
      return {
        ...state,
        currentInput:
          state.currentInput === "0" ? "0." : state.currentInput + ".",
      };
    }

    case "OPERATOR": {
      const op = action.payload;

      // If we have an existing expression, evaluate it first
      if (state.expression && state.currentInput !== "0") {
        try {
          const fullExpression = state.expression + " " + state.currentInput;
          const result = evaluate(fullExpression);

          return {
            ...state,
            currentInput: "0",
            expression: String(result) + " " + op,
            lastResult: result,
            error: null,
            sqrtCount: 0,
            reciprocalCount: 0,
            squareCount: 0,
            originalValue: null,
          };
        } catch (error) {
          return {
            ...state,
            error: "Error",
            currentInput: "0",
            expression: "",
            sqrtCount: 0,
            reciprocalCount: 0,
            squareCount: 0,
            originalValue: null,
          };
        }
      }

      // Start new expression with current input
      const baseValue =
        state.lastResult !== null && state.expression === ""
          ? String(state.lastResult)
          : state.currentInput;

      return {
        ...state,
        expression: baseValue + " " + op,
        currentInput: "0",
        lastResult: null,
        sqrtCount: 0,
        reciprocalCount: 0,
        squareCount: 0,
        originalValue: null,
      };
    }

    case "EQUALS": {
      if (!state.expression) {
        return state;
      }

      try {
        const fullExpression = state.expression + " " + state.currentInput;
        const result = evaluate(fullExpression);

        // Add to history
        const historyEntry = {
          expression: fullExpression,
          result: result,
          timestamp: Date.now(),
        };

        return {
          ...state,
          currentInput: String(result),
          expression: "",
          lastResult: result,
          history: [...state.history, historyEntry],
          error: null,
        };
      } catch (error) {
        return {
          ...state,
          error:
            error.message === "Division by zero"
              ? "Cannot divide by zero"
              : "Error",
          currentInput: "0",
          expression: "",
        };
      }
    }

    case "CLEAR_ALL": {
      return {
        ...initialState,
        history: state.history,
        memory: state.memory,
      };
    }

    case "CLEAR_ENTRY": {
      return {
        ...state,
        currentInput: "0",
        error: null,
        sqrtCount: 0,
        reciprocalCount: 0,
        squareCount: 0,
        originalValue: null,
      };
    }

    case "BACKSPACE": {
      if (state.currentInput.length <= 1 || state.currentInput === "0") {
        return {
          ...state,
          currentInput: "0",
        };
      }

      const newInput = state.currentInput.slice(0, -1);

      // Handle case where we're left with just a minus sign
      if (newInput === "-") {
        return {
          ...state,
          currentInput: "0",
        };
      }

      return {
        ...state,
        currentInput: newInput,
      };
    }

    case "NEGATE": {
      if (state.currentInput === "0") {
        return state;
      }

      const current = state.currentInput;
      const newInput = current.startsWith("-")
        ? current.substring(1)
        : "-" + current;

      // If we're in the middle of a nested operation, reset the operation counts
      // since negating should start a fresh operation
      const shouldResetOperations =
        state.sqrtCount > 0 ||
        state.reciprocalCount > 0 ||
        state.squareCount > 0;

      return {
        ...state,
        currentInput: newInput,
        // Reset operation counts if we were in a nested operation
        sqrtCount: shouldResetOperations ? 0 : state.sqrtCount,
        reciprocalCount: shouldResetOperations ? 0 : state.reciprocalCount,
        squareCount: shouldResetOperations ? 0 : state.squareCount,
        originalValue: shouldResetOperations ? null : state.originalValue,
      };
    }

    case "SQRT": {
      const current = parseFloat(state.currentInput);

      if (current < 0) {
        return {
          ...state,
          error: "Invalid input",
          currentInput: "0",
          sqrtCount: 0,
          reciprocalCount: 0,
          squareCount: 0,
          originalValue: null,
        };
      }

      // If this is the first sqrt operation or we're starting fresh
      if (state.sqrtCount === 0 || state.originalValue === null) {
        const result = formatDisplayNumber(Math.sqrt(current));
        return {
          ...state,
          currentInput: String(result),
          expression: `√(${state.currentInput})`,
          lastResult: result,
          sqrtCount: 1,
          reciprocalCount: 0,
          squareCount: 0,
          originalValue: current,
        };
      }

      // For nested sqrt operations, continue from the previous result
      const result = formatDisplayNumber(
        Math.sqrt(parseFloat(state.currentInput))
      );
      const newSqrtCount = state.sqrtCount + 1;

      // Build nested sqrt expression
      let nestedExpression = state.originalValue.toString();
      for (let i = 0; i < newSqrtCount; i++) {
        nestedExpression = `√(${nestedExpression})`;
      }

      return {
        ...state,
        currentInput: String(result),
        expression: nestedExpression,
        lastResult: result,
        sqrtCount: newSqrtCount,
      };
    }

    case "SQUARE": {
      const current = parseFloat(state.currentInput);

      // If this is the first square operation or we're starting fresh
      if (state.squareCount === 0 || state.originalValue === null) {
        const result = formatDisplayNumber(current * current);
        return {
          ...state,
          currentInput: String(result),
          expression: `sqr(${state.currentInput})`,
          lastResult: result,
          squareCount: 1,
          sqrtCount: 0,
          reciprocalCount: 0,
          originalValue: current,
        };
      }

      // For nested square operations, continue from the previous result
      const result = formatDisplayNumber(
        parseFloat(state.currentInput) * parseFloat(state.currentInput)
      );
      const newSquareCount = state.squareCount + 1;

      // Build nested square expression
      let nestedExpression = state.originalValue.toString();
      for (let i = 0; i < newSquareCount; i++) {
        nestedExpression = `sqr(${nestedExpression})`;
      }

      return {
        ...state,
        currentInput: String(result),
        expression: nestedExpression,
        lastResult: result,
        squareCount: newSquareCount,
        sqrtCount: 0,
        reciprocalCount: 0,
      };
    }

    case "RECIPROCAL": {
      const current = parseFloat(state.currentInput);

      if (current === 0) {
        return {
          ...state,
          error: "Cannot divide by zero",
          sqrtCount: 0,
          reciprocalCount: 0,
          squareCount: 0,
          originalValue: null,
        };
      }

      // If this is the first reciprocal operation or we're starting fresh
      if (state.reciprocalCount === 0 || state.originalValue === null) {
        const result = formatDisplayNumber(1 / current);
        return {
          ...state,
          currentInput: String(result),
          expression: `1/(${state.currentInput})`,
          lastResult: result,
          reciprocalCount: 1,
          sqrtCount: 0,
          squareCount: 0,
          originalValue: current,
        };
      }

      // For nested reciprocal operations, continue from the previous result
      const result = formatDisplayNumber(1 / parseFloat(state.currentInput));
      const newReciprocalCount = state.reciprocalCount + 1;

      // Build nested reciprocal expression
      let nestedExpression = state.originalValue.toString();
      for (let i = 0; i < newReciprocalCount; i++) {
        nestedExpression = `1/(${nestedExpression})`;
      }

      return {
        ...state,
        currentInput: String(result),
        expression: nestedExpression,
        lastResult: result,
        reciprocalCount: newReciprocalCount,
        sqrtCount: 0,
        squareCount: 0,
      };
    }

    case "PERCENT": {
      try {
        const result = calculatePercent(state.expression, state.currentInput);

        return {
          ...state,
          currentInput: String(formatResult(result)),
        };
      } catch (error) {
        return {
          ...state,
          error: "Error",
        };
      }
    }

    case "LOAD_FROM_HISTORY": {
      return {
        ...state,
        currentInput: String(action.payload),
        expression: "",
        lastResult: action.payload,
        error: null,
      };
    }

    case "CLEAR_HISTORY": {
      return {
        ...state,
        history: [],
      };
    }

    case "MEMORY_ADD": {
      const current = parseFloat(state.currentInput);

      if (state.memory.length === 0) {
        // If no memory exists, store the current value as the first memory item
        const newMemory = [
          {
            id: Date.now(),
            value: current,
            timestamp: new Date().toISOString(),
          },
        ];
        return {
          ...state,
          memory: newMemory,
        };
      } else {
        // Add current value to the first memory item (index 0)
        const newMemory = [...state.memory];
        newMemory[0] = {
          ...newMemory[0],
          value: newMemory[0].value + current,
          timestamp: new Date().toISOString(),
        };

        return {
          ...state,
          memory: newMemory,
        };
      }
    }

    case "MEMORY_SUBTRACT": {
      const current = parseFloat(state.currentInput);
      if (state.memory.length === 0) return state;

      // Subtract current value from the first memory item (index 0)
      const newMemory = [...state.memory];
      newMemory[0] = {
        ...newMemory[0],
        value: newMemory[0].value - current,
        timestamp: new Date().toISOString(),
      };

      return {
        ...state,
        memory: newMemory,
      };
    }

    case "MEMORY_STORE": {
      const current = parseFloat(state.currentInput);
      // Store current value at the top of memory (push existing items down)
      const newMemory = [
        {
          id: Date.now(),
          value: current,
          timestamp: new Date().toISOString(),
        },
        ...state.memory,
      ];

      return {
        ...state,
        memory: newMemory,
      };
    }

    case "MEMORY_RECALL": {
      if (state.memory.length === 0) return state;
      // Recall the first memory item (index 0)
      const firstMemoryValue = state.memory[0].value;
      return {
        ...state,
        currentInput: String(formatResult(firstMemoryValue)),
        expression: "",
        lastResult: firstMemoryValue,
        error: null,
      };
    }

    case "MEMORY_CLEAR": {
      return {
        ...state,
        memory: [],
      };
    }

    case "MEMORY_ITEM_CLEAR": {
      return {
        ...state,
        memory: state.memory.filter((item) => item.id !== action.payload),
      };
    }

    case "LOAD_FROM_MEMORY": {
      return {
        ...state,
        currentInput: String(action.payload),
        expression: "",
        lastResult: action.payload,
        error: null,
      };
    }

    default:
      return state;
  }
}
