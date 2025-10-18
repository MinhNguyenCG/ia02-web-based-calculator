/**
 * Converts infix tokens to postfix (RPN) using Shunting Yard algorithm
 */
export function shuntingYard(tokens) {
  const output = [];
  const operators = [];
  
  const precedence = {
    '+': 1,
    '−': 1,
    '×': 2,
    '÷': 2
  };
  
  for (const token of tokens) {
    if (token.type === 'number') {
      output.push(token);
    } else if (token.type === 'operator') {
      while (
        operators.length > 0 &&
        precedence[operators[operators.length - 1].value] >= precedence[token.value]
      ) {
        output.push(operators.pop());
      }
      operators.push(token);
    }
  }
  
  while (operators.length > 0) {
    output.push(operators.pop());
  }
  
  return output;
}
