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

test('base indent, first line - throws', () => {expect(() => {tokenTypes(
`    x`
)}).toThrow('invalid indent - base block cannot be indented')});

test('base indent, second line - throws', () => {expect(() => {tokenTypes(
`
    x`
  )}).toThrow('invalid indent - base block cannot be indented')});

test('invalid indent - throws', () => {expect(() => {tokenTypes(
`x =
   5 + 6`
)}).toThrow('invalid indent - must be a multiple of 4 spaces')});

test('double indent - throws', () => {expect(() => {tokenTypes(
`x =
        5 + 6`
)}).toThrow('invalid indent - increase of more than 1 block')});

test('opening line continue - throws', () => {expect(() => {tokenTypes(
`| 5`
)}).toThrow('invalid line continue')});

test('open block with line continue - throws', () => {expect(() => {tokenTypes(
`x = 
    | 5 + 6`
)}).toThrow('invalid line continue')});

test('unclosed parentheses - throw', () => {expect(() => {tokenTypes(
  `5 + (6 +`
)}).toThrow('unclosed brackets')});

test('unclosed brackets - throw', () => {expect(() => {tokenTypes(
  `[a`
)}).toThrow('unclosed brackets')});

test('parentheses across lines - throw', () => {expect(() => {tokenTypes(
`5 + (6 +
    7 + 8)`
)}).toThrow('unclosed brackets')});

test('brackets across lines - throw', () => { expect(() => {tokenTypes(
`f = [a +
    7 + 8]`
)}).toThrow('unclosed brackets')});

test('bracket mismatch - throw', () => { expect(() => {tokenTypes(
`5 + (6 * 7]`
)}).toThrow('bracket mismatch')});