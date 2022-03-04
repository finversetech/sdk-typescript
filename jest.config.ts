/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
};
