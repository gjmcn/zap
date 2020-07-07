const {compute} = require('./test-helpers.js');

test('order numeric array default', () => {
  expect(compute('@ 5 3 9 5 2 order')).toStrictEqual([2, 3, 5, 5, 9]);
});

test('orderIndex numeric array default', () => {
  expect(compute('@ 5 3 9 2 orderIndex')).toStrictEqual([3, 1, 0, 2]);
});

test('order numeric array desc', () => {
  expect(compute('@ 5 3 9 5 2 order [b - a]')).toStrictEqual([9, 5, 5, 3, 2]);
});

test('orderIndex numeric array desc', () => {
  expect(compute('@ 5 3 9 2 orderIndex [b - a]')).toStrictEqual([2, 0, 1, 3]);
});

test('order array-of-objects', () => {
  expect(compute(
    `@ (# u 5 v 20) (# u 6 v 10) (# u 7 v 30) order [b :v - (a :v)]`
  )).toStrictEqual([{u: 7, v: 30}, {u: 5, v: 20}, {u: 6, v: 10}]);
});

test('orderIndex set', () => {
  expect(compute('@@ 5 3 9 2 orderIndex')).toStrictEqual([3, 1, 0, 2]);
});

test('order string', () => {
  expect(compute('"bgwpga" order [a > b ? 1 (a < b ? (- 1) 0)]'))
    .toStrictEqual(['a', 'b', 'g', 'g', 'p', 'w']);
});

test('order map', () => {
  expect(compute(
    `## u 5 true 3 null 10 2 6 order [a :1 - (b :1)]`
  )).toStrictEqual([[true, 3], ['u', 5], [2, 6], [null, 10]]);
});

test('orderIndex generator', () => {
  expect(compute(`
f = fun
    yield 9
    yield 4
    yield 1
    yield 6
\\f orderIndex [b - a]`
  )).toStrictEqual([0, 3, 1, 2]);
});

test('order empty array', () => {
  expect(compute('@ order')).toStrictEqual([]);
});

test('orderIndex empty array', () => {
  expect(compute('@ orderIndex [b - a]')).toStrictEqual([]);
});

test('order, original unchanged', () => {
  expect(compute(`
x = @ 5 8 6 4
x order
x`
  )).toStrictEqual([5, 8, 6, 4]);
});