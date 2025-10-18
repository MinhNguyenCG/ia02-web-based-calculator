module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setupTests.js"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "<rootDir>/src/__mocks__/fileMock.js",
    "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/src/__mocks__/fileMock.js",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  testMatch: ["**/__tests__/**/*.(test|spec).(js|jsx)"],
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!src/main.jsx",
    "!src/__tests__/**",
    "!src/__mocks__/**",
  ],
  moduleDirectories: ["node_modules", "src"],
};
