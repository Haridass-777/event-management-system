import * as dotenv from 'dotenv';

// Load environment variables for tests
dotenv.config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';

// Mock database for tests
jest.mock('../config/database', () => ({
  pool: {
    query: jest.fn(),
    connect: jest.fn(),
    end: jest.fn(),
  },
  query: jest.fn(),
}));
