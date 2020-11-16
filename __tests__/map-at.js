const {compute} = require('./test-helpers.js');

test('array-of-arrays', () => {
  expect(compute(`
@
| (@ 4 5 6)
| (@ 7 8 9)
| mapAt (@ 2 0) 
  `)).toStrictEqual([
    [6, 4],
    [9, 7]
  ]);
});

test('set-of-objects', () => {
  expect(compute(`
@@
| (# u 4 v 5)
| (# u 6 v 7 w 8)
| (# u 9 w 10)
| mapAt (@ 'u' 'w')
  `)).toStrictEqual([
    {u: 4, w: undefined},
    {u: 6, w: 8},
    {u: 9, w: 10}
  ]);
});

test('array-of-strings', () => {
  expect(compute("@ 'abc' 'def' mapAt (@ 0 2)"))
    .toStrictEqual(['ac', 'df']);
});

test('generator-of-arrays', () => {
  expect(compute(`
fun
    @ 4 5 6 yield
    @ 7 8 9 yield
| call mapAt '21'
  `)).toStrictEqual([[6, 5], [9, 8]]);
});

test('empty array', () => {
  expect(compute("@ mapAt (@ 0 2)"))
    .toStrictEqual([]);
});

test('throw: outer not iterable', () => {
  expect(() => compute("5 mapAt (@ 0 2)")).toThrow();
});

test('throw: cannot get property of inner', () => {
  expect(() => compute("@ (@ 5 6 7) null mapAt (@ 0 2)")).toThrow();
});