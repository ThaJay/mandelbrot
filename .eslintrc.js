const error = 'error'
const never = 'never'
const always = 'always'
const off = 'off'
const warn = 'warn'

module.exports = {
  parser       : 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      legacyDecorators            : true,
      experimentalObjectRestSpread: true
    }
  },
  extends: ['standard', 'plugin:react/recommended', 'standard-react'],
  plugins: ['babel', 'import', 'jsx-a11y', 'react'],
  globals: {
    React      : true,
    performance: true
  },
  rules: {
    'babel/new-cap'              : 1,
    'babel/no-unused-expressions': 1,
    'babel/no-invalid-this'      : 0,
    'babel/quotes'               : [error, 'single', {avoidEscape:true}],
    'babel/object-curly-spacing' : [error, never],
    'babel/semi'                 : [error, never],
    'import/extensions'          : off,
    'react/prop-types'           : off,
    'react/jsx-handler-names'    : off,
    'react/jsx-uses-react'       : error,
    'react/jsx-uses-vars'        : error,

    'key-spacing': [
      warn,
      {
        singleLine: {
          beforeColon: false,
          afterColon : false
        },
        align: {
          beforeColon: false,
          afterColon : true,
          on         : 'colon'
        }
      }
    ],
    'space-before-function-paren': [error, always],
    'block-spacing'              : [error, never],
    curly                        : off,
    'spaced-comment'             : off,
    'space-in-parens'            : off,
    indent                       : off,
    'no-multi-spaces'            : off,
    'no-multiple-empty-lines'    : off,
    'padded-blocks'              : off,

    'new-cap'              : off,
    'no-unused-expressions': off,
    'no-invalid-this'      : off,
    quotes                 : off,
    'object-curly-spacing' : off,
    semi                   : off,
    'max-len'              : [
      error,
      120,
      4,
      {
        ignoreComments        : true,
        ignoreUrls            : false,
        ignoreRegExpLiterals  : false,
        ignoreStrings         : false,
        ignoreTemplateLiterals: false
      }
    ],
    'lines-between-class-members': [
      'error',
      'always',
      {exceptAfterSingleLine:true}
    ]
  }
}
