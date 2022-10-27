module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: false,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'import', 'prettier'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  env: {
    browser: true,
  },
  ignorePatterns: ['**/dist', '**/node_modules', '**/spec', '**/scripts'],
  rules: {
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
    'consistent-return': 'off',
    'no-console': 'warn',
    'no-unused-vars': 'off',
    'no-use-before-define': 'off',
    'no-param-reassign': 'off',
    'max-len': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'no-underscore-dangle': 'off',
    '@typescript-eslint/no-empty-function': 'warn',
    'object-curly-newline': [
      'error',
      {
        consistent: true,
      },
    ],
    'prettier/prettier': [
      'error',
      {
        printWidth: 120,
        singleQuote: true,
        semi: true,
        useTabs: false,
        tabWidth: 2,
        arrowParens: 'always',
        trailingComma: 'all',
        parser: 'typescript',
        endOfLine: 'auto',
      },
    ],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        "js": "never",
        "jsx": "never",
        "ts": "never",
        "tsx": "never"
      }
    ],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/*.spec.*', '**/*.stories.*', '**/.storybook/**/*.*'],
      },
    ],
    'import/prefer-default-export': 'off',
    'no-useless-constructor': 'off',
    'class-methods-use-this': 'off',
    'import/no-import-module-exports': 'off',
    'react/function-component-definition': 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'enum',
        format: ['PascalCase'],
      },
    ],
  },
  overrides: [
    {
      files: ['index.d.ts'],
      rules: {
        'import/newline-after-import': 'off',
      },
    },
  ],
};
