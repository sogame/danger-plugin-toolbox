import js from '@eslint/js';
import eslintComments from '@eslint-community/eslint-plugin-eslint-comments';
import importPlugin from 'eslint-plugin-import-x';
import jestPlugin from 'eslint-plugin-jest';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';

export default [
  { ignores: ['coverage/**', 'dist/**', 'node_modules/**'] },

  js.configs.recommended,

  // Core rules
  {
    rules: {
      'array-callback-return': [
        'error',
        { allowImplicit: true, checkForEach: false, allowVoid: false },
      ],
      'block-scoped-var': 'error',
      camelcase: [
        'error',
        {
          properties: 'never',
          ignoreDestructuring: false,
          ignoreImports: false,
          ignoreGlobals: false,
        },
      ],
      'consistent-return': 'error',
      'default-case': ['error', { commentPattern: '^no default$' }],
      'default-case-last': 'error',
      'dot-notation': ['error', { allowKeywords: true }],
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'func-names': 'warn',
      'grouped-accessor-pairs': 'error',
      'guard-for-in': 'error',
      'lines-between-class-members': [
        'error',
        'always',
        { exceptAfterSingleLine: false },
      ],
      'max-classes-per-file': ['error', 3],
      'new-cap': [
        'error',
        {
          newIsCap: true,
          newIsCapExceptions: [],
          capIsNew: false,
          capIsNewExceptions: [
            'Immutable.Map',
            'Immutable.Set',
            'Immutable.List',
          ],
          properties: true,
        },
      ],
      'no-alert': 'warn',
      'no-array-constructor': 'error',
      'no-await-in-loop': 'error',
      'no-bitwise': 'error',
      'no-caller': 'error',
      'no-console': 'error',
      // Intentionally warn (not error) — overrides eslint:recommended's error
      'no-constant-condition': 'warn',
      'no-constructor-return': 'error',
      'no-else-return': ['error', { allowElseIf: false }],
      'no-empty-function': [
        'error',
        { allow: ['arrowFunctions', 'functions', 'methods'] },
      ],
      'no-eval': 'error',
      'no-extend-native': 'error',
      'no-extra-bind': 'error',
      'no-extra-label': 'error',
      'no-implied-eval': 'error',
      'no-iterator': 'error',
      'no-label-var': 'error',
      'no-labels': ['error', { allowLoop: false, allowSwitch: false }],
      'no-lone-blocks': 'error',
      'no-lonely-if': 'error',
      'no-loop-func': 'error',
      'no-multi-assign': 'error',
      'no-multi-str': 'error',
      'no-nested-ternary': 'error',
      'no-new': 'error',
      'no-new-func': 'error',
      'no-new-wrappers': 'error',
      'no-object-constructor': 'error',
      'no-octal-escape': 'error',
      'no-param-reassign': ['error', { props: false }],
      'no-promise-executor-return': 'error',
      'no-proto': 'error',
      'no-restricted-exports': [
        'error',
        { restrictedNamedExports: ['default', 'then'] },
      ],
      // Node.js only — browser globals (addEventListener, history, etc.) don't exist in Node
      'no-restricted-globals': [
        'error',
        { name: 'isFinite', message: 'Use Number.isFinite instead' },
        { name: 'isNaN', message: 'Use Number.isNaN instead' },
      ],
      // Node.js only — window/self don't exist in Node; Math.pow covered by prefer-exponentiation-operator
      'no-restricted-properties': [
        'error',
        {
          object: 'arguments',
          property: 'callee',
          message: 'arguments.callee is deprecated',
        },
        {
          object: 'global',
          property: 'isFinite',
          message: 'Please use Number.isFinite instead',
        },
        {
          object: 'global',
          property: 'isNaN',
          message: 'Please use Number.isNaN instead',
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ForInStatement',
          message:
            'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
        },
        {
          selector: 'LabeledStatement',
          message:
            'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
        },
        {
          selector: 'WithStatement',
          message:
            '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
        },
      ],
      'no-return-assign': ['error', 'always'],
      'no-script-url': 'error',
      'no-self-compare': 'error',
      'no-sequences': 'error',
      'no-shadow': 'error',
      'no-template-curly-in-string': 'error',
      'no-throw-literal': 'error',
      'no-undef-init': 'error',
      'no-unneeded-ternary': ['error', { defaultAssignment: false }],
      'no-unreachable-loop': ['error', { ignore: [] }],
      'no-unused-expressions': [
        'error',
        {
          allowShortCircuit: false,
          allowTernary: false,
          allowTaggedTemplates: false,
          enforceForJSX: false,
        },
      ],
      // Explicit options including caughtErrors — aligns with ESLint v9+ default
      'no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
          caughtErrors: 'all',
        },
      ],
      'no-use-before-define': [
        'error',
        { functions: true, classes: true, variables: true },
      ],
      'no-useless-concat': 'error',
      'no-useless-constructor': 'error',
      'no-useless-return': 'error',
      'no-var': 'error',
      'no-void': 'error',
      'object-shorthand': [
        'error',
        'always',
        { ignoreConstructors: false, avoidQuotes: true },
      ],
      'one-var': ['error', 'never'],
      'operator-assignment': ['error', 'always'],
      'prefer-const': [
        'error',
        { destructuring: 'any', ignoreReadBeforeAssign: true },
      ],
      'prefer-destructuring': [
        'error',
        {
          VariableDeclarator: { array: false, object: true },
          AssignmentExpression: { array: true, object: false },
        },
        { enforceForRenamedProperties: false },
      ],
      'prefer-exponentiation-operator': 'error',
      'prefer-numeric-literals': 'error',
      'prefer-object-spread': 'error',
      'prefer-promise-reject-errors': ['error', { allowEmptyReject: true }],
      'prefer-regex-literals': ['error', { disallowRedundantWrapping: true }],
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'prefer-template': 'error',
      radix: 'error',
      'spaced-comment': [
        'error',
        'always',
        {
          line: { exceptions: ['-', '+'], markers: ['=', '!', '/'] },
          block: {
            exceptions: ['-', '+'],
            markers: ['=', '!', ':', '::'],
            balanced: true,
          },
        },
      ],
      strict: ['error', 'never'],
      'symbol-description': 'error',
      'unicode-bom': ['error', 'never'],
      yoda: 'error',
    },
  },

  // Node environment (global to all files)
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // eslint-plugin-import-x
  {
    plugins: { 'import-x': importPlugin },
    rules: {
      'import-x/export': 'error',
      'import-x/extensions': ['error', 'ignorePackages', { js: 'never' }],
      'import-x/first': 'error',
      'import-x/newline-after-import': 'error',
      'import-x/no-absolute-path': 'error',
      'import-x/no-cycle': [
        'error',
        {
          maxDepth: 10,
          ignoreExternal: false,
          allowUnsafeDynamicCyclicDependency: false,
        },
      ],
      'import-x/no-duplicates': 'error',
      'import-x/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: ['**/*.test.js', 'scripts/**/*', 'eslint.config.js'],
        },
      ],
      'import-x/no-import-module-exports': ['error', { exceptions: [] }],
      'import-x/no-mutable-exports': 'error',
      'import-x/no-named-as-default': 'error',
      'import-x/no-named-as-default-member': 'error',
      'import-x/no-named-default': 'error',
      'import-x/no-self-import': 'error',
      'import-x/no-unresolved': [
        'error',
        { ignore: ['dangerfile.js', 'release-it'], caseSensitive: true },
      ],
      'import-x/no-useless-path-segments': ['error', { commonjs: true }],
      'import-x/order': [
        'error',
        {
          groups: ['builtin', 'external', 'parent', 'sibling', 'index', 'type'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: false },
        },
      ],
    },
  },

  // Danger plugin globals (used across src/ rules)
  {
    files: ['src/**/*.js', 'dangerfile.js'],
    languageOptions: {
      globals: {
        danger: false,
        markdown: false,
        fail: false,
        warn: false,
        message: false,
      },
    },
  },

  // dangerfile.js uses prod-danger-plugin-toolbox which is not in deps (CI-only)
  {
    files: ['dangerfile.js'],
    rules: {
      'import-x/no-extraneous-dependencies': 'off',
      'import-x/no-unresolved': 'off',
    },
  },

  // eslint-plugin-jest (test files + setupTests)
  {
    files: [
      '**/*.test.js',
      '**/__tests__/**/*.js',
      '**/__mocks__/**/*.js',
      'setupTests.js',
    ],
    plugins: { jest: jestPlugin },
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      'jest/expect-expect': 'warn',
      'jest/no-alias-methods': 'error',
      'jest/no-commented-out-tests': 'warn',
      'jest/no-conditional-expect': 'error',
      'jest/no-deprecated-functions': 'error',
      'jest/no-disabled-tests': 'warn',
      'jest/no-done-callback': 'error',
      'jest/no-export': 'error',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/no-interpolation-in-snapshots': 'error',
      'jest/no-jasmine-globals': 'error',
      'jest/no-mocks-import': 'error',
      'jest/no-standalone-expect': [
        'error',
        { additionalTestBlockFunctions: ['afterEach'] },
      ],
      'jest/no-test-prefixes': 'error',
      'jest/valid-describe-callback': 'error',
      'jest/valid-expect': 'error',
      'jest/valid-expect-in-promise': 'error',
      'jest/valid-title': 'error',
    },
  },

  // @eslint-community/eslint-plugin-eslint-comments
  {
    plugins: { '@eslint-community/eslint-comments': eslintComments },
    rules: {
      '@eslint-community/eslint-comments/disable-enable-pair': [
        'warn',
        { allowWholeFile: true },
      ],
      '@eslint-community/eslint-comments/no-aggregating-enable': 'warn',
      '@eslint-community/eslint-comments/no-duplicate-disable': 'warn',
      '@eslint-community/eslint-comments/no-unlimited-disable': 'warn',
      '@eslint-community/eslint-comments/no-unused-disable': 'warn',
      '@eslint-community/eslint-comments/no-unused-enable': 'warn',
      '@eslint-community/eslint-comments/require-description': 'error',
    },
  },

  // eslint-plugin-prettier
  {
    plugins: { prettier },
    rules: {
      'prettier/prettier': 'error',
      'arrow-body-style': 'off',
      'prefer-arrow-callback': 'off',
    },
  },
];
