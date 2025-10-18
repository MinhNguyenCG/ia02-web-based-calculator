import { calculatePercent } from '../logic/percent';

describe('Percent', () => {
  test('calculates percentage of previous value for addition', () => {
    const result = calculatePercent('50 +', '10');
    expect(result).toBe(5); // 50 * (10 / 100)
  });

  test('calculates percentage of previous value for subtraction', () => {
    const result = calculatePercent('200 −', '10');
    expect(result).toBe(20); // 200 * (10 / 100)
  });

  test('calculates simple percentage for multiplication', () => {
    const result = calculatePercent('200 ×', '10');
    expect(result).toBe(0.1); // 10 / 100
  });

  test('calculates simple percentage for division', () => {
    const result = calculatePercent('50 ÷', '10');
    expect(result).toBe(0.1); // 10 / 100
  });

  test('divides by 100 when no expression', () => {
    const result = calculatePercent('', '50');
    expect(result).toBe(0.5); // 50 / 100
  });
});
