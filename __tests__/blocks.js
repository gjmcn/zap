const tokens = require('./test-helpers.js').tokens;

const tokenTypes =
  zapCode => tokens(zapCode, 'procTokens').map(obj => obj.type);

test('basic line continue', () => {
  expect(tokenTypes(
`3 *
| (4 +
| 5)`
  )).toStrictEqual([
    'number', 'operator', 'openParentheses', 'number', 'operator', 'number',
    'closeBracket'
  ])
});

test('basic indent', () => {
  expect(tokenTypes(
`3 *
    4 + 5`
  )).toStrictEqual([
    'number', 'operator', 'openParentheses', 'number', 'operator',
    'number', 'closeBracket'
  ])
});

test('multiple one-line expressions', () => {
  expect(tokenTypes(
`x = 4
y = x sqrt`
  )).toStrictEqual([
    'identifier', 'operator', 'number', 'closeSubexpr', 'identifier',
    'operator', 'identifier', 'operator'
  ])
});

test('empty/comment lines', () => {
  expect(tokenTypes(
`

// blah

x + 

    2 * 3
    // blah
y = x + 5

// blah
`
  )).toStrictEqual([
    'identifier', 'operator', 'openParentheses', 'number', 'operator', 'number',
    'closeBracket', 'closeSubexpr', 'identifier', 'operator', 'identifier',
    'operator', 'number'
  ])
});

test('nested indent', () => {
  expect(tokenTypes(
`if false
    print 'a'
| else
    5
    | do i
        print i
print 'done'`
  )).toStrictEqual([
    'operator', 'identifier', 'openParentheses', 'operator', 'string',
    'closeBracket', 'identifier', 'openParentheses', 'number', 'operator',
    'identifier', 'openParentheses', 'operator', 'identifier', 'closeBracket',
    'closeBracket', 'closeSubexpr', 'operator', 'string'
  ])
});


////////////////////////////
// TO DO: BLOCK ERRORS