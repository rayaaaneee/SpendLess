/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '**/tests/accountController.test.ts',
    '**/tests/categoryController.test.ts',
    '**/tests/operationController.test.ts',
    ],
};