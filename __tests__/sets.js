const {compute} = require('./test-helpers.js');


// ========== difference ==========

test('difference, array array', () => {
  expect(compute('@ 2 9 12 4 difference (@ 12 2)'))
    .toStrictEqual(new Set([9, 4]));
});

test('difference, range array set range', () => {
  expect(compute(
    'difference (5 to 12) (@ 4 "6" 8 12 3) (@@ "7" 20 5) (9 to 11)'
  )).toStrictEqual(new Set([6, 7]));
});

test('difference, array', () => {
  expect(compute('difference (@ 4 5)'))
    .toStrictEqual(new Set([4, 5]));
});

test('difference, array empty empty', () => {
  expect(compute('(@ 4 5) (@) (@@) difference'))
    .toStrictEqual(new Set([4, 5]));
});

test('difference, empty', () => {
  expect(compute('@ difference'))
    .toStrictEqual(new Set());
});

test('difference, no operands', () => {
  expect(compute('difference'))
    .toStrictEqual(new Set());
});

test('difference, order', () => {
  expect(compute('difference (@ 2 9 6 8 3 14) (@@ 6 0 10 2) (@ 22 3) array'))
    .toStrictEqual([9, 8, 14]);
});