const zap = require('../dist/zap.cjs');
const each = require('jest-each').default;
const tokens = require('./test-helpers.js').tokens;

function isValidToken(zapCode) {
  try {
    const tkns = zap(zapCode, {tokens: true, js: false}).tokens;
    if (tkns.length !== 1) return false;
    return true;
  }
  catch (err) {
    return false;
  }
}

function lexerTestEach(type, arr) {
  each(arr).test(`${type}: %s`, value => {
    const tkns = tokens(value);
    expect({
      type: tkns[0].type,
      value: tkns[0].value,
      n: tkns.length
    }).toStrictEqual({type, value, n: 1});
  });
}

// number
lexerTestEach('number', [
  '5', '1234',
  '0.1', '98.76', '600.', '.38', '.0005',
  '6e4', '6e+2', '1.2e3', '5e-3', '98.65e-32', '.3e4', '.002e-3', '3.e4',
  '0n', '8n', '90n', '123n',
  '0B101', '0b0', '0b11101001010101010101n',
  '0O755', '0o755', '0o777777777777n',
  '0XA', '0x123', '0x123456789ABCDEFn'
]);

// string
lexerTestEach('string', [
  '""', "''", "'\\''", '"\\""', '"a\\nb"', "'a\\nb'",
  '"a"', '"abc"', '"ab cd"', '"/ab/"', '"5"', '"!£$%^&*()_+[]{}@~#/.,<>?\\|"',
  "'a'", "'abc'", "'ab cd'", "'/ab/'", "'5'", "'!£$%^&*()_+[]{}@~#/.,<>?\\|'",
]);

// regexp
lexerTestEach('regexp', [
  '&/ab/', '&/a|b/', '&/a(?:[3-8])/', '&/^ab$/gi', '&/ab(?![uv])[a-z]+(?=5)/y',
  '&/[\\/]/', '&/\\//', '&/\\"\\"/', '&/\\w?\\s*\\d+/'
]);

// identifier
lexerTestEach('identifier', [
  'x', 'X', '_', '$', '_$', '$_', '_5', 'ab_5', 'x5_$', 'someVariable', '$abc',
  'X5', 'AB$_x2'
]);

// property
lexerTestEach('property', [
  'a,1', 'ob,pr', 'this,this', '_2,1e2', '$,5', 'true,false', 'null,break',
  'a;1', 'ob;pr', 'this;this', '_2;1e2', '$;5', 'true;false', 'null;brk',
  'x,1,2', 'ab;cd,5;6,qw'
]);

// openParentheses
lexerTestEach('openParentheses', [
  '('
]);

// (bracket) function
lexerTestEach('function', [
  '[', '{'
]);

// closeBracket
lexerTestEach('closeBracket', [
  ')', ']', '}'
]);

// operator
lexerTestEach('operator', [
  '+', '-', '*', '/', '%', '^',
  '<>', '><', '&&', '||', '??', '?', '!',
  '<', '<=', '>', '>=', '==', '!=',
  '=', '\\=', '<-', '?=', '+=', '-=', '*=', '/=', '%=', '^=', '#=', '@=',
  ':', '::', '?:',
  '\\', '<\\', '~', '<~',
  '#', '##', '@', '@@'
]);

// backtick - preTick
each(['`+', '`-', '`*', '`/', '`%', '`^'])
  .test('backtick-operator: %s', value => {
    const tkns = tokens(value);
    expect([tkns[0].type, tkns[0].value, tkns[0].preTick, tkns[0].postTick,
        tkns.length])
      .toStrictEqual(['operator', value.slice(1), true, undefined, 1]);
  });

// backtick - postTick
each(['&&`', '||`', '??`', '<`', '<=`'])
  .test('backtick-operator: %s', value => {
    const tkns = tokens(value);
    expect([tkns[0].type, tkns[0].value, tkns[0].preTick, tkns[0].postTick,
        tkns.length])
      .toStrictEqual(['operator', value.slice(0, -1), undefined, true, 1]);
  });

// backtick - preTick and postTick
each(['`>`', '`>=`', '`==`', '`!=`', '`<>`', '`><`'])
  .test('backtick-operator: %s', value => {
    const tkns = tokens(value);
    expect([tkns[0].type, tkns[0].value, tkns[0].preTick, tkns[0].postTick,
        tkns.length])
      .toStrictEqual(['operator', value.slice(1, -1), true, true, 1]);
  });

// word operator (not exhaustive)
lexerTestEach('operator', [
  'if', 'array', 'sin', 'binCount', 'select', '$div', '$svg'
]);

// multiple tokens
each([
  ['x = 5',
    ['identifier', 'operator', 'number']
  ],

  ['@ 5 6 7 `+ y',
    ['operator', 'number', 'number', 'number', 'operator', 'identifier']
  ],

  ['u : v,w : x;y;z : q',
    ['identifier','operator', 'property', 'operator', 'property', 'operator',
     'identifier']
  ],

  ["'ab' + (x + 'cde') : length",
    ['string', 'operator', 'openParentheses', 'identifier', 'operator',
     'string', 'closeBracket', 'operator', 'identifier']
  ],

  ['\\["abc" ~slice 1 toUpperCase] print',
    ['operator', 'function', 'string', 'operator', 'identifier', 'number',
     'operator', 'closeBracket', 'operator']
  ],

  [`
'hi' print
# u 5 // blah
f = {5}
`,
    ['newline', 'string', 'operator', 'newline', 'operator', 'identifier',
     'number', 'newline', 'identifier', 'operator', 'function', 'number',
     'closeBracket', 'newline']
  ],

  [
`//import and export
import "my-mod.js" add
export add10
add10 = [a \\add 10]`,
    ['newline', 'operator', 'string', 'identifier', 'newline', 'operator',
     'identifier', 'newline', 'identifier', 'operator', 'function',
     'identifier', 'operator', 'identifier', 'number', 'closeBracket']
  ],

  ['5 &&&/abc/',
    ['number', 'operator', 'regexp']
  ],

  ['5 3 -//blah',
    ['number', 'number', 'operator']
  ],

  ['f = fun x $_yz (x ^ $_yz)',
    ['identifier', 'operator', 'operator', 'identifier', 'identifier',
     'openParentheses', 'identifier', 'operator', 'identifier',
     'closeBracket']
  ],
 
  ['5"abc"false+toUpperCase!',
    ['number', 'string', 'identifier', 'operator', 'operator', 'operator']
  ]

]).test('multiple tokens, %s', (value, result) => {
    expect(tokens(value).map(obj => obj.type)).toStrictEqual(result);
  });

// invalid
each([
  '&//', '&//g',
  '+-', '-/', '=+', '&&!',
  ',+', ';+', '+,', '+;',
  '->', '-->', '=>', '==>',
  '..', '...', '....',
  '"ab', "'ab", 'ab"', "ab'",
  ',', ';', 'x,', 'x;', ',x', ';x',
  'sum,x', 'x,sum', 'break,x', 
  'sum;x', 'x;sum', 'break;x', 'x;break',
  '5,x', '5;x' 
]).test('invalid, %s', value => {
  expect(isValidToken(value)).toBe(false);
});