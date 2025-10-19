import Key from "@/components/Key";
import MemoryButton from "@/components/MemoryButton";
import { actions } from "@/logic/calculatorMachine";

export default function Keypad({ onAction, isDarkMode = true }) {
  const handleKeyClick = (value) => {
    switch (value) {
      case "C":
        onAction(actions.clearAll());
        break;
      case "CE":
        onAction(actions.clearEntry());
        break;
      case "backspace":
        onAction(actions.backspace());
        break;
      case "±":
        onAction(actions.negate());
        break;
      case "√":
        onAction(actions.sqrt());
        break;
      case "x²":
        onAction(actions.square());
        break;
      case "1/x":
        onAction(actions.reciprocal());
        break;
      case "%":
        onAction(actions.percent());
        break;
      case "=":
        onAction(actions.equals());
        break;
      case "+":
      case "−":
      case "×":
      case "÷":
        onAction(actions.operator(value));
        break;
      case ".":
        onAction(actions.inputDot());
        break;
      case "MC":
        onAction(actions.memoryClear());
        break;
      case "MR":
        onAction(actions.memoryRecall());
        break;
      case "M+":
        onAction(actions.memoryAdd());
        break;
      case "M-":
        onAction(actions.memorySubtract());
        break;
      case "MS":
        onAction(actions.memoryStore());
        break;
      default:
        if (!isNaN(value)) {
          onAction(actions.inputDigit(value));
        }
    }
  };

  return (
    <div
      className={`p-2 sm:p-3 lg:p-4 backdrop-blur-sm transition-all duration-300 h-full flex flex-col ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-800/50 to-slate-900/50"
          : "bg-gradient-to-br from-gray-100/50 to-gray-200/50"
      }`}
    >
      {/* Keypad Grid Container */}
      <div className="flex-1 flex flex-col justify-center">
        {/* Memory Row */}
        <div className="grid grid-cols-5 gap-1 sm:gap-2 mb-1 sm:mb-2">
          <MemoryButton
            label="MC"
            value="MC"
            onClick={handleKeyClick}
            tooltip="Clear All Memory (Ctrl + L)"
            isDarkMode={isDarkMode}
          />
          <MemoryButton
            label="MR"
            value="MR"
            onClick={handleKeyClick}
            tooltip="Memory Recall (Ctrl + R)"
            isDarkMode={isDarkMode}
          />
          <MemoryButton
            label="M+"
            value="M+"
            onClick={handleKeyClick}
            tooltip="Memory Add (Ctrl + P)"
            isDarkMode={isDarkMode}
          />
          <MemoryButton
            label="M-"
            value="M-"
            onClick={handleKeyClick}
            tooltip="Memory Subtract (Ctrl + Q)"
            isDarkMode={isDarkMode}
          />
          <MemoryButton
            label="MS"
            value="MS"
            onClick={handleKeyClick}
            tooltip="Memory Store (Ctrl + M)"
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Main Calculator Grid - 4 columns, 6 rows with proper spanning */}
        <div
          className="calc-keypad-grid flex-1"
          style={{
            gridTemplateAreas: `
          "percent clear-entry clear backspace"
          "reciprocal square sqrt divide"
          "seven eight nine multiply"
          "four five six subtract"
          "one two three add"
          "negate zero-zero decimal equals"
        `,
          }}
        >
          {/* Row 1: %, CE, C, Backspace */}
          <Key
            label="%"
            value="%"
            onClick={handleKeyClick}
            variant="default"
            ariaLabel="Percent"
            isDarkMode={isDarkMode}
            gridArea="percent"
          />
          <Key
            label="CE"
            value="CE"
            onClick={handleKeyClick}
            variant="default"
            ariaLabel="Clear Entry"
            isDarkMode={isDarkMode}
            gridArea="clear-entry"
          />
          <Key
            label="C"
            value="C"
            onClick={handleKeyClick}
            variant="default"
            ariaLabel="Clear"
            isDarkMode={isDarkMode}
            gridArea="clear"
          />
          <Key
            label="⌫"
            value="backspace"
            onClick={handleKeyClick}
            variant="default"
            ariaLabel="Backspace"
            isDarkMode={isDarkMode}
            gridArea="backspace"
          />

          {/* Row 2: 1/x, x², √x, ÷ */}
          <Key
            label="¹⁄ₓ"
            value="1/x"
            onClick={handleKeyClick}
            variant="default"
            ariaLabel="Reciprocal"
            isDarkMode={isDarkMode}
            gridArea="reciprocal"
          />
          <Key
            label="x²"
            value="x²"
            onClick={handleKeyClick}
            variant="default"
            ariaLabel="Square"
            isDarkMode={isDarkMode}
            gridArea="square"
          />
          <Key
            label="²√x"
            value="√"
            onClick={handleKeyClick}
            variant="default"
            ariaLabel="Square root"
            isDarkMode={isDarkMode}
            gridArea="sqrt"
          />
          <Key
            label="÷"
            value="÷"
            onClick={handleKeyClick}
            variant="default"
            ariaLabel="Divide"
            isDarkMode={isDarkMode}
            gridArea="divide"
          />

          {/* Row 3: 7, 8, 9, × */}
          <Key
            label="7"
            value="7"
            onClick={handleKeyClick}
            variant="number"
            ariaLabel="Seven"
            isDarkMode={isDarkMode}
            gridArea="seven"
          />
          <Key
            label="8"
            value="8"
            onClick={handleKeyClick}
            variant="number"
            ariaLabel="Eight"
            isDarkMode={isDarkMode}
            gridArea="eight"
          />
          <Key
            label="9"
            value="9"
            onClick={handleKeyClick}
            variant="number"
            ariaLabel="Nine"
            isDarkMode={isDarkMode}
            gridArea="nine"
          />
          <Key
            label="×"
            value="×"
            onClick={handleKeyClick}
            variant="default"
            ariaLabel="Multiply"
            isDarkMode={isDarkMode}
            gridArea="multiply"
          />

          {/* Row 4: 4, 5, 6, − */}
          <Key
            label="4"
            value="4"
            onClick={handleKeyClick}
            variant="number"
            ariaLabel="Four"
            isDarkMode={isDarkMode}
            gridArea="four"
          />
          <Key
            label="5"
            value="5"
            onClick={handleKeyClick}
            variant="number"
            ariaLabel="Five"
            isDarkMode={isDarkMode}
            gridArea="five"
          />
          <Key
            label="6"
            value="6"
            onClick={handleKeyClick}
            variant="number"
            ariaLabel="Six"
            isDarkMode={isDarkMode}
            gridArea="six"
          />
          <Key
            label="−"
            value="−"
            onClick={handleKeyClick}
            variant="default"
            ariaLabel="Subtract"
            isDarkMode={isDarkMode}
            gridArea="subtract"
          />

          {/* Row 5: 1, 2, 3, + */}
          <Key
            label="1"
            value="1"
            onClick={handleKeyClick}
            variant="number"
            ariaLabel="One"
            isDarkMode={isDarkMode}
            gridArea="one"
          />
          <Key
            label="2"
            value="2"
            onClick={handleKeyClick}
            variant="number"
            ariaLabel="Two"
            isDarkMode={isDarkMode}
            gridArea="two"
          />
          <Key
            label="3"
            value="3"
            onClick={handleKeyClick}
            variant="number"
            ariaLabel="Three"
            isDarkMode={isDarkMode}
            gridArea="three"
          />
          <Key
            label="+"
            value="+"
            onClick={handleKeyClick}
            variant="default"
            ariaLabel="Add"
            isDarkMode={isDarkMode}
            gridArea="add"
          />

          {/* Row 6: ±, 0 (span 2), ., = (span 2 rows) */}
          <Key
            label="⁺⁄₋"
            value="±"
            onClick={handleKeyClick}
            variant="default"
            ariaLabel="Negate"
            isDarkMode={isDarkMode}
            gridArea="negate"
          />
          <Key
            label="0"
            value="0"
            onClick={handleKeyClick}
            variant="number"
            ariaLabel="Zero"
            isDarkMode={isDarkMode}
            gridArea="zero-zero"
          />
          <Key
            label="."
            value="."
            onClick={handleKeyClick}
            variant="number"
            ariaLabel="Decimal"
            isDarkMode={isDarkMode}
            gridArea="decimal"
          />
          <Key
            label="="
            value="="
            onClick={handleKeyClick}
            variant="equals"
            ariaLabel="Equals"
            isDarkMode={isDarkMode}
            gridArea="equals"
          />
        </div>
      </div>
    </div>
  );
}
