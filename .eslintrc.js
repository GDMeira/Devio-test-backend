module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ["airbnb",
    "airbnb/hooks", 'plugin:@typescript-eslint/recommended', 'plugin:import/recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  "rules": {
    "import/no-unresolved": 0,
    "prettier/prettier": [
      "error",
      {
        "singleQuote": true,
        "trailingComma": "all",
        "arrowParens": "avoid",
        "endOfLine": "auto"
      }
    ],
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": ["error"],
    "import/extensions": ["error", {
      js: 'never',
      json: 'aways' 
    }],
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": ["error"],
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "import/prefer-default-export": 0,
    "global-require": 0
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': { typescript: {}, node: {} },
  },
};
