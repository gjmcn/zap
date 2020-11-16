const {compute} = require('./test-helpers.js');

test('array-of-arrays', () => {
  expect(compute(`
@ 
| (@ 4 5 6)
| (@ 7 8 9)
| pick 1 
  `)).toStrictEqual([5, 8]);
});

test('array-of-objects', () => {
  expect(compute(`
@ 
| (# u 5 v 6)
| (# u 10 v 20)
| pick 'v' 
  `)).toStrictEqual([6, 20]);
});

test('set-of-strings', () => {
  expect(compute("@@ 'abc' 'de' 'fgh' pick 2"))
    .toStrictEqual(['c', undefined, 'h']);
});

test('map-of-obects', () => {
  expect(compute(`
## 
| a (# u 5 v 6)
| b (# u 10 v 20)
| ~values pick 'v'
  `)).toStrictEqual([6, 20]);
});

test('generator-of-arrays', () => {
  expect(compute(`
fun
    @ 4 5 6 yield
    @ 7 8 9 yield
| call pick 0
  `)).toStrictEqual([4, 77]);
});

test('empty array', () => {
  expect(compute("@ pick 2"))
    .toStrictEqual([]);
});

test('throw: outer not iterable', () => {
  expect(() => compute("5 pick 0")).toThrow();
});

test('throw: cannot get property of inner', () => {
  expect(() => compute("@ (@ 5 6) null pick 0")).toThrow();
});