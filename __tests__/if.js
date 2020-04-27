const {compute, testEach} = require('./test-helpers.js');

testEach('$if, basic', [
  ['$if 5 6', 6],
  ['5 $if 6', 6],
  ['$if 0 6', undefined],
  ['0 $if 6', undefined],
  ['$if false 5 true 6', 6],
  ['$if true 5 false 6', 5],
  ['$if 0 5 false 6 NaN 7', undefined],
  ['$if 0 5 false 6 [] 7',  7],
  ['x = 5; $if (x < 10) 6', 6]
]);

test('$if, 1 branch, subexpressions', () => {
  expect(compute('x = 5; $if (x < 10) (y = 20; y + 5)')).toBe(25)
});

test('$if, 2 branches, subexpressions', () => {
  expect(compute('x = 5; $if (x > 10) (y = 20; y + 5) "else" (z = 30; z + 6)'))
    .toBe(36)
});

test('$if, 3 branches, subexpressions', () => {
  expect(compute(`
  x = 5;
  $if
    (x > 10) (u = 20; u + 5)
    (x < 0)  (v = 30; v + 6)
    "else"   (w = 40; w + 7)`))
      .toBe(47)
});