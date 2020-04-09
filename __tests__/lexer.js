const zap = require('../dist/zap.cjs');
const each = require('jest-each').default;

const zapOptions = {tokens: true, js: false};

function tokens(zapCode) {
  try {
    return zap(zapCode, zapOptions).tokens;
  }
  catch (err) {  // return error (if throw, jest output includes entire zap.cjs)
    return err;
  }
}

function isValidToken(zapCode) {
  try {
    const tkns = zap(zapCode, zapOptions).tokens;
    if (tkns.length !== 1) throw '';
    return true;
  }
  catch (err) {
    return false;
  }
}

function lexerTestEach(type, arr) {
  each(arr).test(`${type}: %s`, value => {
    expect(tokens(value)).toStrictEqual([{type, value, line: 1, column: 0}]);
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

// openParentheses
lexerTestEach('openParentheses', [
  '('
]);

// function
lexerTestEach('function', [
  '[', '{', '[**', '{**'
]);

// closeBracket
lexerTestEach('closeBracket', [
  ')', ']', '}'
]);

// closeSubexpr
lexerTestEach('closeSubexpr', [
  ';'
]);

// spreadOrRest
lexerTestEach('spreadOrRest', [
  '...'
]);

// arrow
lexerTestEach('arrow', [
  '->', '=>'
]);

// operator
lexerTestEach('operator', [
  '~', '+', '-', '*', '/', '%', '^',
  '<>', '><', '&&', '||', '??', '?', '!',
  '<', '<=', '>', '>=', '==', '!=',
  '=', '\\=', '?=', '+=', '-=', '*=', '/=', '%=', '^=', '#=', '@=', '=:',
  ':', '\\:', '?:', '+:', '-:', '*:', '/:', '%:', '^:', '::',
  '\\', '<\\', '|', '<|', '?|', '#', '##', '@', '@@', '>>', '>>>'
]);

// bactick-operator
each(['`+', '`-', '`*', '`/', '`%', '`^'])
  .test('backtick-operator: %s', value => {
  expect(tokens(value)).toStrictEqual([
    {type: 'operator', value: value.slice(1), line: 1, column: 0,
     preTick: true}
  ]);
});
each(['&&`', '||`', '??`', '<`', '<=`'])
  .test('backtick-operator: %s', value => {
  expect(tokens(value)).toStrictEqual([
    {type: 'operator', value: value.slice(0, -1), line: 1, column: 0,
     postTick: true}
  ]);
});
each(['`>`', '`>=`', '`==`', '`!=`', '`<>`', '`><`'])
  .test('backtick-operator: %s', value => {
  expect(tokens(value)).toStrictEqual([
    {type: 'operator', value: value.slice(1, -1), line: 1, column: 0,
     preTick: true, postTick: true}
  ]);
});

// word operator (not exhaustive)
lexerTestEach('operator', [
  '$if', '$array', '$sin', '$binCount', '$pick', '$div', '$svg'
]);

// multiple tokens
each([
  ['x = 5;',
    ['identifier', 'operator', 'number', 'closeSubexpr']],
  ['@ 5 6 7 `+ y',
    ['operator', 'number', 'number', 'number', 'operator', 'identifier']],
  ["'ab' + (x + 'cde') :length",
    ['string', 'operator', 'openParentheses', 'identifier', 'operator',
     'string', 'closeBracket', 'operator', 'identifier']],
  ['\\["abc" |slice 1 |toUpperCase] $print',
    ['operator', 'function', 'string', 'operator', 'identifier', 'number',
     'operator', 'identifier', 'closeBracket', 'operator']],
  ["'hi' $print; # u 5; // blah\nf = {5}",
    ['string', 'operator', 'closeSubexpr', 'operator', 'identifier', 'number',
     'closeSubexpr', 'identifier', 'operator', 'function', 'number',
     'closeBracket']],
  ['//import and export\n$import "my-mod.js" add;\n$export add10;\nadd10 = [a \\add 10];',
    ['operator', 'string', 'identifier', 'closeSubexpr', 'operator',
     'identifier', 'closeSubexpr', 'identifier', 'operator', 'function',
     'identifier', 'operator', 'identifier', 'number', 'closeBracket',
     'closeSubexpr']],
  ['[*** false 6] ',
    ['function', 'operator', 'identifier', 'number', 'closeBracket']],
  ['5 &&&/abc/',
    ['number', 'operator', 'regexp']],
  ['5 3 -//blah',
    ['number', 'number', 'operator']],
  ['[x ->- x 3]',
    ['function', 'identifier', 'arrow','operator', 'identifier', 'number',
     'closeBracket']],
  ['f = [x $_yz => x ^ $_yz]',
    ['identifier', 'operator', 'function', 'identifier', 'identifier', 'arrow',
     'identifier', 'operator', 'identifier', 'closeBracket']],
  ['\\{** abc -> @@ abc :size} true |next',
    ['operator', 'function', 'identifier', 'arrow', 'operator', 'identifier',
     'operator', 'identifier', 'closeBracket', 'identifier', 'operator',
     'identifier']],
  ['5"abc"false+$toUpperCase!',
    ['number', 'string', 'identifier', 'operator', 'operator', 'operator']]
]).test('multiple tokens, %s', (value, result) => {
    expect(tokens(value).map(obj => obj.type)).toStrictEqual(result);
  });

// invalid
each([
  '&//', '&//g', '+-', '-/',
  '-->', '==>', '=+', '&&!',
  '..', '....',
  '"ab', "'ab", 'ab"', "ab'"
]).test('invalid, %s', value => {
  expect(isValidToken(value)).toBe(false);
});