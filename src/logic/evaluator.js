import { formatResult } from "./decimal.js";
import { tokenize } from "./tokenizer.js";
import { shuntingYard } from "./shuntingYard.js";

/**
 * Evaluates a postfix (RPN) expression
 */
function evaluateRPN(tokens) {
  const stack = [];

  for (const token of tokens) {
    if (token.type === "number") {
      stack.push(token.value);
    } else if (token.type === "operator") {
      if (stack.length < 2) {
        throw new Error("Invalid expression");
      }

      const b = stack.pop();
      const a = stack.pop();
      let result;

      switch (token.value) {
        case "+":
          result = a + b;
          break;
        case "−":
          result = a - b;
          break;
        case "×":
          result = a * b;
          break;
        case "÷":
          if (b === 0) {
            throw new Error("Division by zero");
          }
          result = a / b;
          break;
        default:
          throw new Error(`Unknown operator: ${token.value}`);
      }

      stack.push(result);
    }
  }

  if (stack.length !== 1) {
    throw new Error("Invalid expression");
  }

  return stack[0];
}

/**
 * Main evaluation function
 */
export function evaluate(expression) {
  try {
    const tokens = tokenize(expression);

    if (tokens.length === 0) {
      return 0;
    }

    if (tokens.length === 1 && tokens[0].type === "number") {
      return formatResult(tokens[0].value);
    }

    const rpn = shuntingYard(tokens);
    const result = evaluateRPN(rpn);

    return formatResult(result);
  } catch (error) {
    throw error;
  }
}
