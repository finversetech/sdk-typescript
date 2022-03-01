module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2021, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.eslint.json"],
  },
  plugins: ["@typescript-eslint", "sonarjs"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:prettier/recommended", // Enables prettier-related plugins. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  rules: {
    // use indent of 2 but use 1 for switch cases which is weirdly 2 as it's based on the default indent
    // relevant stackoverflow post https://stackoverflow.com/questions/53055300/cannot-fix-eslint-rule-on-indenting-case-statements-in-switch-statement
    indent: ["error", 2, { SwitchCase: 1, offsetTernaryExpressions: true }],
    "linebreak-style": ["warn", "unix"],
    semi: ["error", "always"],
    "no-console": 2,
    "no-async-promise-executor": "warn",
    "no-useless-catch": "warn", // part of eslint:recommended
    "no-useless-escape": "warn", // part of eslint:recommended
    "no-control-regex": "warn", // part of eslint:recommended
    "@typescript-eslint/no-explicit-any": 1,
    "@typescript-eslint/no-empty-interface": 1,
    "@typescript-eslint/no-floating-promises": "warn",
    "@typescript-eslint/no-namespace": "off",
    "sonarjs/no-all-duplicated-branches": "warn",
    "sonarjs/no-element-overwrite": "warn",
    "sonarjs/no-empty-collection": "warn",
    "sonarjs/no-extra-arguments": "warn",
    "sonarjs/no-identical-conditions": "warn",
    "sonarjs/no-identical-expressions": "warn",
    "sonarjs/no-ignored-return": "warn",
    "sonarjs/no-one-iteration-loop": "warn",
    "sonarjs/no-use-of-empty-return-value": "warn",
    "sonarjs/non-existent-operator": "warn",
    "sonarjs/no-inverted-boolean-check": "warn",
    "sonarjs/prefer-immediate-return": "warn",
    "sonarjs/prefer-while": "warn",
  },
};
