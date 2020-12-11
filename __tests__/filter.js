const {compute} = require('./test-helpers.js');

test('filter numeric array', () => {
  expect(compute('@ 3 7 4 9 filter [a > 5]'))
    .toStrictEqual([7, 9]);
});
test('filterIndex numeric array', () => {
  expect(compute('@ 3 7 4 9 filterIndex [a > 5]'))
    .toStrictEqual([1, 3]);
});

test('filter default callback', () => {
  expect(compute('@ 3 null "a" undefined 0 filter'))
    .toStrictEqual([3, 'a']);
});
test('filterIndex default callback', () => {
  expect(compute('@ 3 null "a" undefined 0 filterIndex'))
    .toStrictEqual([0, 2]);
});

test('filter array-of-objects', () => {
  expect(compute(`
@
| (# u 5 v 10)
| (# u 6 v 20)
| (# u 5 v 30)
| filter [a,u == 5]
  `)).toStrictEqual([
    {u: 5, v: 10},
    {u: 5, v: 30}
  ]);
});
test('filterIndex array-of-objects', () => {
  expect(compute(`
@
| (# u 5 v 10)
| (# u 6 v 20)
| (# u 5 v 30)
| filterIndex [a,u == 5]
  `)).toStrictEqual([0, 2]);
});

test('filter array-of-objects on property', () => {
  expect(compute(`
@
| (# u 5 v null)
| (# u 6 v 20)
| (# u 5 v 30)
| filter 'v'
  `)).toStrictEqual([
    {u: 6, v: 20},
    {u: 5, v: 30}
  ]);
});
test('filterIndex array-of-objects on property', () => {
  expect(compute(`
@
| (# u 5 v null)
| (# u 6 v 20)
| (# u 5 v 30)
| filterIndex 'v'
  `)).toStrictEqual([1, 2]);
});

test('filter generator-of-arrays on index', () => {
  expect(compute(`
fun
    @ 1 2 yield
    @ 7 2 4 yield
    @ 1 5 0 yield
| call filter 2    
  `)).toStrictEqual([
    [7, 2, 4]
  ]);
});
test('filterIndex generator-of-arrays on index', () => {
  expect(compute(`
fun
    @ 1 2 yield
    @ 7 2 4 yield
    @ 1 5 0 yield
| call filterIndex 2    
  `)).toStrictEqual([1]);
});

test('filter set', () => {
  expect(compute("@@ true false 1 0 '' 'abc' filter [a]"))
    .toStrictEqual([true, 1, 'abc']);
});
test('filterIndex set', () => {
  expect(compute("@@ true false 1 0 '' 'abc' filterIndex [a]"))
    .toStrictEqual([0, 2, 5]);
});

test('filter empty set', () => {
  expect(compute('@@ filter [true]'))
    .toStrictEqual([]);
});
test('filterIndex empty set', () => {
  expect(compute('@@ filterIndex [true]'))
    .toStrictEqual([]);
});

test('filter string', () => {
  expect(compute('"banana" filter [a != "a"]'))
    .toStrictEqual(['b', 'n', 'n']);
});
test('filterIndex string', () => {
  expect(compute('"banana" filterIndex [a != "a"]'))
    .toStrictEqual([0, 2, 4]);
});

test('filter generator', () => {
  expect(compute('1 to 10 filter [a % 3 == 2]'))
    .toStrictEqual([2, 5, 8]);
});
test('filterIndex generator', () => {
  expect(compute('1 to 10 filterIndex [a % 3 == 2]'))
    .toStrictEqual([1, 4, 7]);
});

test('filter map', () => {
  expect(compute(`
##
| u (@ 3 18 6)
| v (@ 4 8 2 5)
| w (@ 12)
| filter [a,1 max > 10]
  `)).toStrictEqual([
    ['u', [3, 18, 6]],
    ['w', [12]]
  ]);
});
test('filterIndex map', () => {
  expect(compute(`
##
| u (@ 3 18 6)
| v (@ 4 8 2 5)
| w (@ 12)
| filterIndex [a,1 max > 10]
  `)).toStrictEqual([0, 2]);
});

test('filter, use index argument', () => {
  expect(compute('@ 10 20 30 filter [b != 1]'))
    .toStrictEqual([10, 30]);
});
test('filterIndex, use index argument', () => {
  expect(compute('@ 10 20 30 filterIndex [b != 1]'))
    .toStrictEqual([0, 2]);
});

test('filter, use iterable argument', () => {
  expect(compute('@ 10 20 30 filter [c;b != 20]'))
    .toStrictEqual([10, 30]);
});
test('filterIndex, use iterable argument', () => {
  expect(compute('@ 10 20 30 filterIndex [c : b != 20]'))
    .toStrictEqual([0, 2]);
});