// jest.config.js

module.exports = {
    testEnvironment: "node",
    testMatch: ["**/tests/**/*.test.js"], // Test files go in /tests folder
    testTimeout: 10000,
    verbose: true,
    forceExit: true,
    clearMocks: true,
  };

  
  /* 
  
This config tells Jest to:

Use node environment (not browser).

Look for all test files in a /tests/ directory (e.g., tests/auth.test.js).

Force exit after tests finish.

Clear mocks between test cases for isolation.

  */