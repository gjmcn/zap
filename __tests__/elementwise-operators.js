const {testEach, simpleTest} = require('./test-helpers.js');

// is
simpleTest('isBigInt',    '10n isBigInt',        true);
simpleTest('isBoolean',   '5 isBoolean',         false);
simpleTest('isFinite',    '5 isFinite',          true);
simpleTest('isFunction',  '[a + 5] isFunction',  true);
simpleTest('isInteger',   '5 isInteger',         true);
simpleTest('isNaN',       '5 isNaN',             false);
simpleTest('isNull',      'null isNull',         true);
simpleTest('isNullish',   'undefined isNullish', true);
simpleTest('isNumber',    '"5" isNumber',        false);
simpleTest('isString',    '"5" isString',        true);
simpleTest('isSymbol',    '\\Symbol isSymbol',   true);
simpleTest('isUndefined', 'null isUndefined',    false);

// Math methods
simpleTest('abs',    '- 5 abs',     5);
simpleTest('acos',   '1 acos',      0);
simpleTest('acosh',  '1 acosh',     0);
simpleTest('asin',   '0 asin',      0);
simpleTest('asinh',  '0 asinh',     0);
simpleTest('atan',   '0 atan',      0);
simpleTest('atanh',  '0 atanh',     0);
simpleTest('cbrt',   '8 cbrt',      2);
simpleTest('ceil',   '2.7 ceil',    3);
simpleTest('clz32',  '1000 clz32',  22);
simpleTest('cos',    '0 cos',       1);
simpleTest('cosh',   '0 cosh',      1);
simpleTest('exp',    '0 exp',       1);
simpleTest('expm1',  '0 expm1',     0);
simpleTest('floor',  '2.7 floor',   2);
simpleTest('fround', '5.5 fround',  5.5);
simpleTest('log',    '1 log',       0);
simpleTest('log10',  '1 log10',     0);
simpleTest('log1p',  '0 log1p',     0);
simpleTest('log2',   '1 log2',      0);
simpleTest('round',  '2.7 round',   3);
simpleTest('sign',   '5 sign',      1);
simpleTest('sin',    '0 sin',       0);
simpleTest('sinh',   '0 sinh',      0);
simpleTest('sqrt',   '4 sqrt',      2);
simpleTest('tan',    '0 tan',       0);
simpleTest('tanh',   '0 tanh',      0);
simpleTest('trunc',  '2.7 trunc',   2);

// other
simpleTest('boolean',      '0 boolean',           false);
simpleTest('date',         '0 date ~getFullYear', 1970);
simpleTest('neg',          '5 neg',               -5);
simpleTest('not',          '5 !',                 false);
simpleTest('number',       '"5" number',          5);
simpleTest('string',       '5 string',            '5');
simpleTest('toLowerCase',  '"ABC" toLowerCase',   'abc');
simpleTest('toUpperCase',  '"abc" toUpperCase',   'ABC');
simpleTest('trim',         '" abc  " trim',       'abc');
simpleTest('trimEnd',      '" abc  " trimEnd',    ' abc');
simpleTest('trimStart',    '" abc  " trimStart',  'abc  ');

// prefix
simpleTest('sqrt, prefix',     'sqrt 4',    2);
simpleTest('boolean, prefix',  'boolean 0', false);

// non-string iterables
testEach('non-string iterables', [
  ['@ 4 9 sqrt',                [2, 3]],
  ["@@ 'a' 'bc' toUpperCase",   ['A', 'BC']],
  ["round (2.4 to 4.8 1.2)",    [2, 4, 5]],
  ["@ 0 'a' boolean",           [false, true]],
  ["@ 5 '5' NaN true isNumber", [true, false, true, false]],
  ['number (@)',                []],
  [`
f = fun
    yield false
    yield 5
\\f string`, ['false', '5']
  ],
], true);