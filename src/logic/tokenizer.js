/**
 * Tokenizes a mathematical expression string
 */
export function tokenize(expression) {
  const tokens = [];
  let current = '';
  
  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];
    
    // Skip spaces
    if (char === ' ') continue;
    
    // Check for operators
    if (['+', '−', '×', '÷'].includes(char)) {
      if (current) {
        tokens.push({ type: 'number', value: parseFloat(current) });
        current = '';
      }
      tokens.push({ type: 'operator', value: char });
    } else if (char >= '0' && char <= '9' || char === '.' || char === '-') {
      // Handle negative numbers at start or after operator
      if (char === '-' && current === '' && (tokens.length === 0 || tokens[tokens.length - 1].type === 'operator')) {
        current += char;
      } else if (char === '-' && current !== '') {
        // This is a minus operator
        if (current) {
          tokens.push({ type: 'number', value: parseFloat(current) });
          current = '';
        }
        tokens.push({ type: 'operator', value: '−' });
      } else {
        current += char;
      }
    }
  }
  
  if (current) {
    tokens.push({ type: 'number', value: parseFloat(current) });
  }
  
  return tokens;
}
