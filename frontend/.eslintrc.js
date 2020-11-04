module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
    'node': true,
    'jest': true,
  },
  'extends': [
    'plugin:react/recommended',
    'google',
  ],
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true,
    },
    'ecmaVersion': 12,
    'sourceType': 'module',
  },
  'plugins': [
    'react',
  ],
  'rules': {
    'max-len': ['error', { 'code': 90 }],
    'indent': ['error', 2, { 'SwitchCase': 1 }],
    'object-curly-spacing': ['error', 'always'],
    'react/prop-types': 0,
    'require-jsdoc': ['error', {
      'require': {
        'FunctionDeclaration': false,
        'MethodDefinition': false,
        'ClassDeclaration': false,
        'ArrowFunctionExpression': false,
        'FunctionExpression': false,
      },
    }],
  },
  'settings': {
    'react': {
      'version': 'detect',
    },
  },
  'parser': 'babel-eslint',
};
