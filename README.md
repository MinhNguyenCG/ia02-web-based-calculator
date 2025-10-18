# Windows 11 Standard Calculator

A production-ready, pixel-perfect recreation of the Windows 11 Standard calculator built as a single-page React application. Features full keyboard support, responsive design, calculation history, and comprehensive test coverage.

![Calculator Screenshot](./screenshot.png)

## 🌟 Features

- **Windows 11 UI**: Dark theme matching the Windows 11 calculator aesthetic
- **Full Operator Precedence**: Correctly evaluates expressions with multiplication/division before addition/subtraction (e.g., `2 + 3 × 4 = 14`)
- **Percentage Calculations**: Context-aware percentage operations
- **History Panel**: Track and recall previous calculations
- **Keyboard Support**: Full keyboard navigation and shortcuts
- **Accessibility**: ARIA labels, keyboard focus management, screen reader support
- **Responsive Design**: Works seamlessly on mobile and desktop
- **Floating-Point Precision**: Built-in decimal handling to prevent common floating-point errors
- **Error Handling**: Graceful handling of division by zero and invalid operations

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
# Clone the repository
git clone
cd windows11-calculator

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📦 Deployment

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

Build settings:

- **Build command**: `npm run build`
- **Publish directory**: `dist`

### GitHub Pages

Add to `package.json`:

```json
{
  "homepage": "https://yourusername.github.io/windows11-calculator"
}
```

```bash
npm install --save-dev gh-pages

# Add to package.json scripts:
# "predeploy": "npm run build",
# "deploy": "gh-pages -d dist"

npm run deploy
```

## ⌨️ Keyboard Shortcuts

| Key       | Action            |
| --------- | ----------------- |
| 0-9       | Input digits      |
| .         | Decimal point     |
| +         | Addition          |
| -         | Subtraction       |
| \*        | Multiplication    |
| /         | Division          |
| Enter/=   | Equals            |
| Escape    | Clear all (C)     |
| Delete    | Clear entry (CE)  |
| Backspace | Delete last digit |
| %         | Percentage        |

## 🧪 Testing Plan

| Case                  | Input                        | Expected Output     | Actual                | Result  |
| --------------------- | ---------------------------- | ------------------- | --------------------- | ------- |
| Basic Addition        | 2 + 3 =                      | 5                   | 5                     | ✅ Pass |
| Basic Subtraction     | 10 − 3 =                     | 7                   | 7                     | ✅ Pass |
| Basic Multiplication  | 4 × 5 =                      | 20                  | 20                    | ✅ Pass |
| Basic Division        | 20 ÷ 4 =                     | 5                   | 5                     | ✅ Pass |
| Operator Precedence   | 2 + 3 × 4 =                  | 14                  | 14                    | ✅ Pass |
| Complex Expression    | 2 + 3 × 4 − 5 =              | 9                   | 9                     | ✅ Pass |
| Floating Point        | 0.1 + 0.2 =                  | 0.3                 | 0.3                   | ✅ Pass |
| Square Root           | √9 =                         | 3                   | 3                     | ✅ Pass |
| Percentage (Add)      | 50 + 10% =                   | 55                  | 55                    | ✅ Pass |
| Percentage (Multiply) | 200 × 10% =                  | 20                  | 20                    | ✅ Pass |
| Division by Zero      | 5 ÷ 0 =                      | Error               | Cannot divide by zero | ✅ Pass |
| Clear Entry (CE)      | Type 123, press CE           | 0 (expression kept) | 0                     | ✅ Pass |
| Clear All (C)         | Any state, press C           | All cleared         | All cleared           | ✅ Pass |
| Backspace             | Type 123, press ⌫            | 12                  | 12                    | ✅ Pass |
| Negate                | Type 5, press ±              | -5                  | -5                    | ✅ Pass |
| Decimal Entry         | Press .                      | 0.                  | 0.                    | ✅ Pass |
| History Load          | Complete calc, click history | Result loaded       | Result loaded         | ✅ Pass |

## 🏗️ Architecture

### Project Structure

```
/
├── src/
│   ├── components/          # React components
│   │   ├── Display.jsx      # Main display area
│   │   ├── Key.jsx          # Individual calculator button
│   │   ├── Keypad.jsx       # Button grid
│   │   └── HistoryPanel.jsx # Calculation history
│   ├── logic/               # Business logic
│   │   ├── tokenizer.js     # Expression tokenization
│   │   ├── shuntingYard.js  # Infix to postfix conversion
│   │   ├── evaluator.js     # Expression evaluation
│   │   ├── percent.js       # Percentage calculations
│   │   ├── decimal.js       # Floating-point utilities
│   │   └── calculatorMachine.js # State management
│   ├── hooks/
│   │   └── useKeyboard.js   # Keyboard event handling
│   └── __tests__/           # Test suites
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

### State Management

The calculator uses React's `useReducer` hook with a custom reducer (`calculatorMachine.js`) to manage:

- Current input display
- Expression building (infix notation)
- Calculation history
- Error states

### Expression Evaluation

1. **Tokenization**: Breaks expression string into tokens (numbers and operators)
2. **Shunting Yard Algorithm**: Converts infix notation to Reverse Polish Notation (RPN) respecting operator precedence
3. **RPN Evaluation**: Evaluates the postfix expression using a stack

This approach ensures correct operator precedence without using `eval()`.

## 🎨 Tech Stack

- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first styling
- **Jest**: Testing framework
- **React Testing Library**: Component testing
- **Shunting Yard Algorithm**: Expression parsing with precedence

## 🔍 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a pull request.

---

Built with ❤️ using React and Tailwind CSS
