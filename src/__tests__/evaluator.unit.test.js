import { evaluate } from '../logic/evaluator';
import { roundToSignificantDigits } from '../logic/decimal';

describe('Evaluator', () => {
  test('evaluates simple addition', () => {
    expect(evaluate('2 + 3')).toBe(5);
  });

  test('evaluates simple subtraction', () => {
    expect(evaluate('10 − 3')).toBe(7);
  });

  test('evaluates simple multiplication', () => {
    expect(evaluate('4 × 5')).toBe(20);
  });

  test('evaluates simple division', () => {
    expect(evaluate('20 ÷ 4')).toBe(5);
  });

  test('respects operator precedence', () => {
    expect(evaluate('2 + 3 × 4')).toBe(14);
    expect(evaluate('10 − 2 × 3')).toBe(4);
  });

  test('handles multiple operations with precedence', () => {
    expect(evaluate('2 + 3 × 4 − 5')).toBe(9);
  });

  test('handles floating point addition correctly', () => {
    const result = evaluate('0.1 + 0.2');
    expect(roundToSignificantDigits(result)).toBeCloseTo(0.3, 10);
  });

  test('throws error for division by zero', () => {
    expect(() => evaluate('5 ÷ 0')).toThrow();
  });

  test('handles negative numbers', () => {
    expect(evaluate('-5 + 3')).toBe(-2);
  });

  test('handles complex expressions', () => {
    expect(evaluate('100 ÷ 5 × 2')).toBe(40);
  });
});
