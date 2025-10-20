import { useEffect } from "react";
import { actions } from "../logic/calculatorMachine";

export default function useKeyboard(onAction) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Memory shortcuts with Ctrl should take precedence over normal keys
      if (e.ctrlKey) {
        const key = e.key.toLowerCase();
        if (["l", "r", "p", "q", "m"].includes(key)) {
          e.preventDefault();
          switch (key) {
            case "l":
              onAction(actions.memoryClear());
              return;
            case "r":
              onAction(actions.memoryRecall());
              return;
            case "p":
              onAction(actions.memoryAdd());
              return;
            case "q":
              onAction(actions.memorySubtract());
              return;
            case "m":
              onAction(actions.memoryStore());
              return;
          }
        }
      }

      // Prevent default for calculator keys
      if (
        /^[0-9.]$/.test(e.key) ||
        [
          "Enter",
          "Escape",
          "Backspace",
          "Delete",
          "+",
          "-",
          "*",
          "/",
          "%",
        ].includes(e.key)
      ) {
        e.preventDefault();
      }

      // Prevent spacebar from activating focused buttons
      if (e.key === " ") {
        e.preventDefault();
        return;
      }

      switch (e.key) {
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          onAction(actions.inputDigit(e.key));
          break;
        case ".":
          onAction(actions.inputDot());
          break;
        case "+":
          onAction(actions.operator("+"));
          break;
        case "-":
          onAction(actions.operator("−"));
          break;
        case "*":
          onAction(actions.operator("×"));
          break;
        case "/":
          onAction(actions.operator("÷"));
          break;
        case "Enter":
        case "=":
          onAction(actions.equals());
          break;
        case "Escape":
          onAction(actions.clearAll());
          break;
        case "Delete":
          onAction(actions.clearEntry());
          break;
        case "Backspace":
          onAction(actions.backspace());
          break;
        case "%":
          onAction(actions.percent());
          break;
        case "s":
        case "S":
          onAction(actions.sqrt());
          break;
        case "x":
        case "X":
          onAction(actions.square());
          break;
        case "n":
        case "N":
          onAction(actions.negate());
          break;
        case "r":
        case "R":
          onAction(actions.reciprocal());
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onAction]);
}
