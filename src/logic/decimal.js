/**
 * Rounds a number to 12 significant digits to mitigate floating-point errors
 */
export function roundToSignificantDigits(num, digits = 12) {
  if (num === 0 || !isFinite(num)) return num;

  const sign = Math.sign(num);
  const abs = Math.abs(num);
  const magnitude = Math.floor(Math.log10(abs)) + 1;
  const scale = Math.pow(10, digits - magnitude);

  return (sign * Math.round(abs * scale)) / scale;
}

/**
 * Strips trailing zeros and unnecessary decimal points
 */
export function stripTrailingZeros(numStr) {
  if (!numStr.includes(".")) return numStr;

  let result = numStr.replace(/\.?0+$/, "");
  return result || "0";
}

/**
 * Formats a number for display with thousand separators
 */
export function formatDisplay(value) {
  if (value === "" || value === null || value === undefined) return "0";

  const numStr = String(value);

  // Handle negative zero
  if (numStr === "-0") return "0";

  // If it contains a decimal point being typed, preserve it
  if (numStr.endsWith(".")) {
    const parts = numStr.split(".");
    const formatted = new Intl.NumberFormat("en-US").format(
      parseFloat(parts[0]) || 0
    );
    return formatted + ".";
  }

  const num = parseFloat(numStr);

  if (!isFinite(num)) return numStr;

  // For very large or small numbers, use exponential notation
  if (Math.abs(num) >= 1e15 || (Math.abs(num) < 1e-6 && num !== 0)) {
    return num.toExponential(11);
  }

  // Round and format
  const rounded = roundToSignificantDigits(num);
  const cleaned = stripTrailingZeros(rounded.toString());

  // Add thousand separators
  const parts = cleaned.split(".");
  const integerPart = new Intl.NumberFormat("en-US").format(
    parseInt(parts[0]) || 0
  );

  if (parts.length > 1) {
    return `${integerPart}.${parts[1]}`;
  }

  return integerPart;
}

/**
 * Safe computation result formatter
 */
export function formatResult(num) {
  if (!isFinite(num)) return num;
  return roundToSignificantDigits(num);
}

/**
 * Formats numbers specifically for display to fix floating-point errors
 * Used only for reciprocal (1/x) and square root (√x) operations
 */
export function formatDisplayNumber(value) {
  if (!isFinite(value)) return value;

  // Round to 15 decimal places to handle floating-point precision issues
  const rounded = Math.round(value * 1e15) / 1e15;

  // Convert to string and remove trailing zeros
  let result = rounded.toString();

  // Remove trailing zeros after decimal point
  if (result.includes(".")) {
    result = result.replace(/\.?0+$/, "");
  }

  // Handle edge case where we're left with just a decimal point
  if (result === ".") result = "0";

  return result;
}
