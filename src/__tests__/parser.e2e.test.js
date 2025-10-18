import { tokenize } from '../logic/tokenizer';
import { shuntingYard } from '../logic/shuntingYard';
import { evaluate } from '../logic/evaluator';

describe('Parser E2E', () => {
  test('tokenizes expression correctly', () => {
    const tokens = tokenize('2 + 3');
    expect(tokens).toEqual([
      { type: 'number', value: 2 },
      { type: 'operator', value: '+' },
      { type: 'number', value: 3 }
    ]);
  });

  test('converts infix to postfix', () => {
    const tokens = tokenize('2 + 3 × 4');
    const rpn = shuntingYard(tokens);
    expect(rpn).toEqual([
      { type: 'number', value: 2 },
      { type: 'number', value: 3 },
      { type: 'number', value: 4 },
      { type: 'operator', value: '×' },
      { type: 'operator', value: '+' }
    ]);
  });

  test('evaluates complete expression with precedence', () => {
    expect(evaluate('2 + 3 × 4')).toBe(14);
  });

  test('handles decimal numbers', () => {
    expect(evaluate('0.5 + 0.5')).toBe(1);
  });
});
