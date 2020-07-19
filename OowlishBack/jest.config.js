module.exports = {
  bail: 1,
  clearMocks: true,
  collectCoverage: false,
  collectCoverageFrom: ['src/app/**/*.js'],
  coveragePathIgnorePatterns: ['src/app/controllers'],
  coverageDirectory: '__tests__/coverage',
  coverageReporters: ['text', 'lcov'],
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  transform: {
    '.(js|jsx|ts|tsx)': '@sucrase/jest-plugin',
  },
  setupFilesAfterEnv: ['jest-chain', 'jest-extended'],
};
