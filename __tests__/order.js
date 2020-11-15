const {compute} = require('./test-helpers.js');

test('order numeric array default', () => {
  expect(compute('@ 5 3 9 5 2 order')).toStrictEqual([2, 3, 5, 5, 9]);
});

test('orderIndex numeric array default', () => {
  expect(compute('@ 5 3 9 2 orderIndex')).toStrictEqual([3, 1, 0, 2]);
});

test('rank numeric array default', () => {
  expect(compute('@ 5 3 9 2 rank')).toStrictEqual([2, 1, 3, 0]);
});

test('rank numeric array default - ties', () => {
  expect(compute('@ 5 2 3 9 2 9 5 rank')).toStrictEqual([3, 0, 2, 5, 0, 5, 3]);
});

test('order numeric array desc', () => {
  expect(compute('@ 5 3 9 5 2 order [b - a]')).toStrictEqual([9, 5, 5, 3, 2]);
});

test('orderIndex numeric array desc', () => {
  expect(compute('@ 5 3 9 2 orderIndex [b - a]')).toStrictEqual([2, 0, 1, 3]);
});

test('rank numeric array desc - ties', () => {
  expect(compute('@ 5 3 9 5 2 rank [b - a]')).toStrictEqual([1, 3, 0, 1, 4]);
});

test('order array-of-objects', () => {
  expect(compute(
    `@ (# u 5 v 20) (# u 6 v 10) (# u 7 v 30) order [b :v - (a :v)]`
  )).toStrictEqual([{u: 7, v: 30}, {u: 5, v: 20}, {u: 6, v: 10}]);
});

test('rank array-of-objects', () => {
  expect(compute(
    `@ (# u 5 v 20) (# u 6 v 10) (# u 7 v 30) rank [b :v - (a :v)]`
  )).toStrictEqual([1, 2, 0]);
});

test('orderIndex set', () => {
  expect(compute('@@ 5 3 9 2 orderIndex')).toStrictEqual([3, 1, 0, 2]);
});

test('order string', () => {
  expect(compute('"bgwpga" order [a > b ? 1 (a < b ? (- 1) 0)]'))
    .toStrictEqual(['a', 'b', 'g', 'g', 'p', 'w']);
});

test('rank string', () => {
  expect(compute('"bgwpga" rank [a > b ? 1 (a < b ? (- 1) 0)]'))
    .toStrictEqual([1, 2, 5, 4, 2, 0]);
});

test('order map', () => {
  expect(compute(
    `## u 5 true 3 null 10 2 6 order [a :1 - (b :1)]`
  )).toStrictEqual([[true, 3], ['u', 5], [2, 6], [null, 10]]);
});

test('rank map', () => {
  expect(compute(
    `## u 5 true 3 null 10 2 6 rank [a :1 - (b :1)]`
  )).toStrictEqual([1, 0, 3, 2]);
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

test('rank generator', () => {
  expect(compute(`
f = fun
    yield 9
    yield 4
    yield 1
    yield 6
\\f rank [b - a]`
  )).toStrictEqual([0, 2, 3, 1]);
});

test('order empty array', () => {
  expect(compute('@ order')).toStrictEqual([]);
});

test('orderIndex empty array', () => {
  expect(compute('@ orderIndex [b - a]')).toStrictEqual([]);
});

test('rank empty array', () => {
  expect(compute('@ rank [b - a]')).toStrictEqual([]);
});

test('order, original unchanged', () => {
  expect(compute(`
x = @ 5 8 6 4
x order
x`
  )).toStrictEqual([5, 8, 6, 4]);
});

test('rank, original unchanged', () => {
  expect(compute(`
x = @ 5 8 6 4
x rank
x`
  )).toStrictEqual([5, 8, 6, 4]);
});