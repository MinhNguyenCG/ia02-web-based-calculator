import { useEffect } from "react";
import { actions } from "../logic/calculatorMachine";

export default function useKeyboard(onAction) {
  useEffect(() => {
    const handleKeyDown = (e) => {
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
          // Memory shortcuts with Ctrl
          if (e.ctrlKey) {
            switch (e.key.toLowerCase()) {
              case "l":
                e.preventDefault();
                onAction(actions.memoryClear());
                break;
              case "r":
                e.preventDefault();
                onAction(actions.memoryRecall());
                break;
              case "p":
                e.preventDefault();
                onAction(actions.memoryAdd());
                break;
              case "q":
                e.preventDefault();
                onAction(actions.memorySubtract());
                break;
              case "m":
                e.preventDefault();
                onAction(actions.memoryStore());
                break;
            }
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onAction]);
}
