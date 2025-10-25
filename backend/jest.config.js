module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/routes', '<rootDir>/middleware', '<rootDir>/config'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.{ts,js}',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/*.d.ts',
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
};
