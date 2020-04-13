const {compute} = require('./test-helpers.js');

test('filter numeric array', () => {
  expect(compute('@ 3 7 4 9 $filter [a > 5]'))
    .toStrictEqual([7, 9]);
});

test('filter array-of-objects', () => {
  expect(compute(`
    @ (# u 5 v 10)
      (# u 6 v 20)
      (# u 5 v 30)
        $filter [a :u == 5];
  `)).toStrictEqual([
    {u: 5, v: 10},
    {u: 5, v: 30}
  ]);
});

test('filter set', () => {
  expect(compute("@@ true false 1 0 '' 'abc' $filter [a]"))
    .toStrictEqual([true, 1, 'abc']);
});

test('filter empty set', () => {
  expect(compute('@@ $filter [true]'))
    .toStrictEqual([]);
});

test('filter string', () => {
  expect(compute('"banana" $filter [a != "a"]'))
    .toStrictEqual(['b', 'n', 'n']);
});

test('filter generator', () => {
  expect(compute('1 >> 10 $filter [a % 3 == 2]'))
    .toStrictEqual([2, 5, 8]);
});

test('filter map', () => {
  expect(compute(`
    ##
      u (@ 3 18 6)
      v (@ 4 8 2 5)
      w (@ 12)
        $filter [a :1 $max > 10];
  `)).toStrictEqual([
    ['u', [3, 18, 6]],
    ['w', [12]]
  ]);
});

test('filter, use index argument', () => {
  expect(compute('@ 10 20 30 $filter [b != 1]'))
    .toStrictEqual([10, 30]);
});

test('filter, use iterable argument', () => {
  expect(compute('@ 10 20 30 $filter [c $at b != 20]'))
    .toStrictEqual([10, 30]);
});