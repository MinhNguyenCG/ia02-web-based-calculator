import { evaluate } from "./evaluator";
import { calculatePercent } from "./percent";
import {
  formatResult,
  formatDisplayNumber,
  preciseSqrt,
  preciseSquare,
} from "./decimal";

// Helper function to build nested expression from operation sequence
function buildNestedExpression(originalValue, operationSequence) {
  let expression = originalValue.toString();

  // Apply operations in forward order (outermost first)
  for (let i = 0; i < operationSequence.length; i++) {
    const operation = operationSequence[i];
    switch (operation) {
      case "sqrt":
        expression = `√(${expression})`;
        break;
      case "square":
        expression = `sqr(${expression})`;
        break;
      case "reciprocal":
        expression = `1/(${expression})`;
        break;
    }
  }

  return expression;
}

export const initialState = {
  currentInput: "0",
  expression: "",
  error: null,
  history: [],
  memory: [],
  lastResult: null,
  operationSequence: [], // Track the sequence of operations applied
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

      // Enforce a maximum input length similar to display formatting
      const wouldExceedLimit = (candidate) => {
        const unsigned = candidate.startsWith("-")
          ? candidate.slice(1)
          : candidate;
        const maxLength = unsigned.startsWith("0.") ? 17 : 16;
        return unsigned.length > maxLength;
      };

      // Start fresh if we just calculated
      if (state.lastResult !== null && state.expression === "") {
        return {
          ...state,
          currentInput: digit,
          lastResult: null,
          operationSequence: [],
          originalValue: null,
        };
      }

      // Reset operation counts when new digits are entered
      if (state.operationSequence.length > 0) {
        const nextInput =
          state.currentInput === "0" && digit !== "0"
            ? digit
            : state.currentInput + digit;

        if (wouldExceedLimit(nextInput)) {
          return state;
        }

        return {
          ...state,
          currentInput: nextInput,
          operationSequence: [],
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

      const nextInput = state.currentInput + digit;
      if (wouldExceedLimit(nextInput)) {
        return state;
      }

      return {
        ...state,
        currentInput: nextInput,
      };
    }

    case "INPUT_DOT": {
      // Start fresh if we just calculated
      if (state.lastResult !== null && state.expression === "") {
        return {
          ...state,
          currentInput: "0.",
          lastResult: null,
          operationSequence: [],
          originalValue: null,
        };
      }

      // Reset operation counts when adding decimal point
      if (state.operationSequence.length > 0) {
        return {
          ...state,
          currentInput: state.currentInput + ".",
          operationSequence: [],
          originalValue: null,
        };
      }

      // Prevent multiple dots
      if (state.currentInput.includes(".")) {
        return state;
      }

      // Add dot to current input
      {
        const candidate =
          state.currentInput === "0" ? "0." : state.currentInput + ".";
        const unsigned = candidate.startsWith("-")
          ? candidate.slice(1)
          : candidate;
        const maxLength = unsigned.startsWith("0.") ? 17 : 16;
        if (unsigned.length > maxLength) {
          return state;
        }

        return {
          ...state,
          currentInput: candidate,
        };
      }
    }

    case "OPERATOR": {
      const op = action.payload;

      // If we have an existing expression, evaluate it first
      if (state.expression && state.currentInput !== "0") {
        try {
          const exprTrimmed = state.expression.trim();
          let fullExpression;
          if (/\)\s*$/.test(exprTrimmed)) {
            const lastSpace = exprTrimmed.lastIndexOf(" ");
            const prefix =
              lastSpace >= 0 ? exprTrimmed.slice(0, lastSpace) : exprTrimmed;
            fullExpression = prefix + " " + state.currentInput;
          } else {
            fullExpression = exprTrimmed + " " + state.currentInput;
          }
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
        operationSequence: [],
        originalValue: null,
      };
    }

    case "EQUALS": {
      if (!state.expression) {
        return state;
      }

      try {
        const exprTrimmed = state.expression.trim();
        let fullExpression;
        if (/\)\s*$/.test(exprTrimmed)) {
          const lastSpace = exprTrimmed.lastIndexOf(" ");
          const prefix =
            lastSpace >= 0 ? exprTrimmed.slice(0, lastSpace) : exprTrimmed;
          fullExpression = prefix + " " + state.currentInput;
        } else {
          fullExpression = exprTrimmed + " " + state.currentInput;
        }
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
        operationSequence: [],
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
      const shouldResetOperations = state.operationSequence.length > 0;

      return {
        ...state,
        currentInput: newInput,
        // Reset operation counts if we were in a nested operation
        operationSequence: shouldResetOperations ? [] : state.operationSequence,
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
          operationSequence: [],
          originalValue: null,
        };
      }

      const result = formatDisplayNumber(preciseSqrt(current));
      const appliedExpr = `√(${state.currentInput})`;
      const shouldAppendToPrefix =
        state.expression && /[+−×÷]$/.test(state.expression.trim());

      // If this is the first operation or we're starting fresh
      if (
        state.operationSequence.length === 0 ||
        state.originalValue === null
      ) {
        return {
          ...state,
          currentInput: String(result),
          expression: shouldAppendToPrefix
            ? `${state.expression} ${appliedExpr}`
            : appliedExpr,
          lastResult: result,
          operationSequence: ["sqrt"],
          originalValue: current,
        };
      }

      // Add sqrt to the operation sequence
      const newOperationSequence = [...state.operationSequence, "sqrt"];
      const nestedExpression = buildNestedExpression(
        state.originalValue,
        newOperationSequence
      );

      return {
        ...state,
        currentInput: String(result),
        expression: shouldAppendToPrefix
          ? `${state.expression} ${nestedExpression}`
          : nestedExpression,
        lastResult: result,
        operationSequence: newOperationSequence,
      };
    }

    case "SQUARE": {
      const current = parseFloat(state.currentInput);
      const result = formatDisplayNumber(preciseSquare(current));
      const appliedExpr = `sqr(${state.currentInput})`;
      const shouldAppendToPrefix =
        state.expression && /[+−×÷]$/.test(state.expression.trim());

      // If this is the first operation or we're starting fresh
      if (
        state.operationSequence.length === 0 ||
        state.originalValue === null
      ) {
        return {
          ...state,
          currentInput: String(result),
          expression: shouldAppendToPrefix
            ? `${state.expression} ${appliedExpr}`
            : appliedExpr,
          lastResult: result,
          operationSequence: ["square"],
          originalValue: current,
        };
      }

      // Add square to the operation sequence
      const newOperationSequence = [...state.operationSequence, "square"];
      const nestedExpression = buildNestedExpression(
        state.originalValue,
        newOperationSequence
      );

      return {
        ...state,
        currentInput: String(result),
        expression: shouldAppendToPrefix
          ? `${state.expression} ${nestedExpression}`
          : nestedExpression,
        lastResult: result,
        operationSequence: newOperationSequence,
      };
    }

    case "RECIPROCAL": {
      const current = parseFloat(state.currentInput);

      if (current === 0) {
        return {
          ...state,
          error: "Cannot divide by zero",
          operationSequence: [],
          originalValue: null,
        };
      }

      const result = formatDisplayNumber(1 / current);
      const appliedExpr = `1/(${state.currentInput})`;
      const shouldAppendToPrefix =
        state.expression && /[+−×÷]$/.test(state.expression.trim());

      // If this is the first operation or we're starting fresh
      if (
        state.operationSequence.length === 0 ||
        state.originalValue === null
      ) {
        return {
          ...state,
          currentInput: String(result),
          expression: shouldAppendToPrefix
            ? `${state.expression} ${appliedExpr}`
            : appliedExpr,
          lastResult: result,
          operationSequence: ["reciprocal"],
          originalValue: current,
        };
      }

      // Add reciprocal to the operation sequence
      const newOperationSequence = [...state.operationSequence, "reciprocal"];
      const nestedExpression = buildNestedExpression(
        state.originalValue,
        newOperationSequence
      );

      return {
        ...state,
        currentInput: String(result),
        expression: shouldAppendToPrefix
          ? `${state.expression} ${nestedExpression}`
          : nestedExpression,
        lastResult: result,
        operationSequence: newOperationSequence,
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
