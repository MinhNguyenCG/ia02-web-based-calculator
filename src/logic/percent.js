/**
 * Handles percentage calculations
 * If there's a pending operation, converts current to percentage of previous
 * Otherwise, divides current by 100
 */
export function calculatePercent(expression, currentInput) {
  const current = parseFloat(currentInput) || 0;
  
  // If no expression, just divide by 100
  if (!expression || expression.trim() === '') {
    return current / 100;
  }
  
  // Find the last operator and number before it
  const operators = ['+', '−', '×', '÷'];
  let lastOpIndex = -1;
  let lastOp = null;
  
  for (let i = expression.length - 1; i >= 0; i--) {
    if (operators.includes(expression[i])) {
      lastOpIndex = i;
      lastOp = expression[i];
      break;
    }
  }
  
  if (lastOpIndex === -1) {
    // No operator found, just divide by 100
    return current / 100;
  }
  
  // Extract the previous operand
  const beforeOp = expression.substring(0, lastOpIndex).trim();
  const prevValue = parseFloat(beforeOp.split(/[+−×÷]/).pop()) || 0;
  
  // For multiplication and division, percentage is of the value itself
  if (lastOp === '×' || lastOp === '÷') {
    return current / 100;
  }
  
  // For addition and subtraction, percentage is of the previous value
  return prevValue * (current / 100);
}
