const {testEach, simpleTest} = require('./test-helpers.js');

simpleTest('isArray, true',  '@ 5 isArray',    true);
simpleTest('isArray, false', '# 0 5 isArray', false);

simpleTest('isBigInt, true',  '10n isBigInt', true);
simpleTest('isBigInt, false', '10 isBigInt',  false);

simpleTest('isBoolean, true',  'false isBoolean', true);
simpleTest('isBoolean, false', '"" isBoolean',    false);

simpleTest('isFinite, true',  '5 isFinite',   true);
simpleTest('isFinite, false', '"5" isFinite', false);

simpleTest('isFunction, true',  '[a + 5] isFunction', true);
simpleTest('isFunction, false', '5 isFunction',       false);

simpleTest('isInteger, true',  '5 isInteger',   true);
simpleTest('isInteger, false', '"5" isInteger', false);

simpleTest('isNaN, true',  'NaN isNaN', true);
simpleTest('isNaN, false', '"a" isNaN', false);

simpleTest('isNull, true',  'null isNull',      true);
simpleTest('isNull, false', 'undefined isNull', false);

simpleTest('isNullish, true',  'undefined isNullish', true);
simpleTest('isNullish, false', '0 isNullish',         false);

simpleTest('isNumber, true',  '5 isNumber',   true);
simpleTest('isNumber, false', '"5" isNumber', false);

simpleTest('isString, true',  '"5" isString',   true);
simpleTest('isString, false', '@ "5" isString', false);

simpleTest('isSymbol, true', '\\Symbol isSymbol',  true);
simpleTest('isSymbol, false', '"symbol" isSymbol', false);

simpleTest('isUndefined, true',  'undefined isUndefined', true);
simpleTest('isUndefined, false', 'null isUndefined',      false);