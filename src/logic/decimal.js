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
 * Truncates a string to a maximum length while preserving decimal point
 */
function truncateDisplayString(str, maxLength) {
  if (str.length <= maxLength) return str;

  // If it has a decimal point, try to preserve it
  if (str.includes(".")) {
    const decimalIndex = str.indexOf(".");
    if (decimalIndex < maxLength) {
      return str.substring(0, maxLength);
    }
  }

  return str.substring(0, maxLength);
}

/**
 * Formats a number for display with character limit
 * - For numbers starting with 0. (like 0.123...): max 17 characters
 * - For normal numbers: max 16 characters
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

  // Determine character limit based on original number format
  const originalStartsWithZero =
    numStr.startsWith("0.") || numStr.startsWith("-0.");
  const maxLength = originalStartsWithZero ? 17 : 16;

  // For very large or small numbers, use exponential notation
  if (Math.abs(num) >= 1e15 || (Math.abs(num) < 1e-6 && num !== 0)) {
    const exponential = num.toExponential(11);
    return exponential;
  }

  // Round and format with more significant digits for display
  const rounded = roundToSignificantDigits(num, 15);
  const cleaned = stripTrailingZeros(rounded.toString());

  // Add thousand separators
  const parts = cleaned.split(".");
  const integerPart = new Intl.NumberFormat("en-US").format(
    parseInt(parts[0]) || 0
  );

  let result;
  if (parts.length > 1) {
    result = `${integerPart}.${parts[1]}`;
  } else {
    result = integerPart;
  }

  // Apply character limit based on number type
  return truncateDisplayString(result, maxLength);
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
