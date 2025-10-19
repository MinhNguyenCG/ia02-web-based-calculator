import {
  roundToSignificantDigits,
  correctFloatingPointError,
  isCloseTo,
  preciseSqrt,
  preciseSquare,
  formatDisplayNumber,
} from "../logic/decimal";

describe("Floating-Point Precision Tests", () => {
  test("roundToSignificantDigits handles small numbers", () => {
    expect(roundToSignificantDigits(0.000000000000001)).toBe(1e-15);
    expect(roundToSignificantDigits(1.000000000000001)).toBe(1);
  });

  test("correctFloatingPointError fixes common errors", () => {
    expect(correctFloatingPointError(8.9999999999991, 9)).toBe(9);
    expect(correctFloatingPointError(2.9999999999999996, 3)).toBe(3);
    expect(correctFloatingPointError(5.1, 5)).toBe(5.1); // Should not change
  });

  test("isCloseTo works correctly", () => {
    expect(isCloseTo(9, 8.9999999999991)).toBe(true);
    expect(isCloseTo(3, 3.0000000000000004)).toBe(true);
    expect(isCloseTo(5, 5.1)).toBe(false);
  });

  test("preciseSqrt handles perfect squares", () => {
    expect(preciseSqrt(9)).toBe(3);
    expect(preciseSqrt(16)).toBe(4);
    expect(preciseSqrt(25)).toBe(5);
  });

  test("preciseSquare handles perfect squares", () => {
    expect(preciseSquare(3)).toBe(9);
    expect(preciseSquare(4)).toBe(16);
    expect(preciseSquare(5)).toBe(25);
  });

  test("formatDisplayNumber corrects floating-point errors", () => {
    expect(formatDisplayNumber(8.9999999999991)).toBe("9");
    expect(formatDisplayNumber(2.9999999999999996)).toBe("3");
    expect(formatDisplayNumber(3.0000000000000004)).toBe("3");
  });

  test("repeated sqrt and square operations", () => {
    let value = 9;

    // Apply sqrt 8 times
    for (let i = 0; i < 8; i++) {
      value = preciseSqrt(value);
    }

    // Apply square 8 times
    for (let i = 0; i < 8; i++) {
      value = preciseSquare(value);
    }

    // Should be close to 9
    expect(isCloseTo(value, 9)).toBe(true);
    expect(formatDisplayNumber(value)).toBe("9");
  });

  test("handles edge cases", () => {
    expect(preciseSqrt(0)).toBe(0);
    expect(preciseSquare(0)).toBe(0);
    expect(preciseSquare(1)).toBe(1);
    expect(preciseSqrt(1)).toBe(1);
  });
});
