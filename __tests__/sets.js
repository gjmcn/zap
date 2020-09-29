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


// ========== intersection ==========

test('intersection, array array', () => {
    expect(compute('@ 2 9 12 intersection (@ 3 12 10 2)'))
      .toStrictEqual(new Set([2, 12]));
});

test('intersection, range array set range', () => {
    expect(compute('intersection (3 to 7) (@ 1 5 4 2 7) (@@ 5 4 0) (4 to 10)'))
      .toStrictEqual(new Set([4, 5]));
});

test('intersection, array', () => {
    expect(compute('intersection (@ 4 5)'))
      .toStrictEqual(new Set([4, 5]));
});

test('intersection, array empty', () => {
    expect(compute('(@ 4 5) (@) intersection'))
      .toStrictEqual(new Set());
});

test('intersection, empty', () => {
    expect(compute('@ intersection'))
      .toStrictEqual(new Set());
});

test('intersection, no operands', () => {
    expect(compute('intersection'))
      .toStrictEqual(new Set());
});

test('intersection, order', () => {
    expect(compute(
        'intersection (@@ 9 4 5 3 2 6) (@ 20 6 4 2 30 5) (2 to 10 2) array'
    )).toStrictEqual([4, 2, 6]);
});
  

// ========== union ==========

test('union, array array', () => {
    expect(compute('@ 2 9 12 union (@ 3 12 10 2)'))
      .toStrictEqual(new Set([2, 9, 12, 3, 10]));
});

test('union, range array set range', () => {
    expect(compute('union (3 to 7) (@ 1 5 4 2 7) (@@ 5 4 0) (4 to 10)'))
      .toStrictEqual(new Set([3, 4, 5, 6, 7, 1, 2, 0, 8, 9, 10]));
});

test('union, array', () => {
    expect(compute('union (@ 4 5)'))
      .toStrictEqual(new Set([4, 5]));
});

test('union, array empty', () => {
    expect(compute('(@ 4 5) (@) union'))
      .toStrictEqual(new Set([4, 5]));
});

test('union, empty', () => {
    expect(compute('@ union'))
      .toStrictEqual(new Set());
});

test('union, no operands', () => {
    expect(compute('union'))
      .toStrictEqual(new Set());
});

test('union, order', () => {
    expect(compute(
        'union (@@ 9 4 5 3 2 6) (@ 20 6 4 2 30 5) (2 to 10 2) array'
    )).toStrictEqual([9, 4, 5, 3, 2, 6, 20, 30, 8, 10]);
});