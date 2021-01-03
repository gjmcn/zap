const {compute} = require('./test-helpers.js');

test('bin numeric array default', () => {
  expect(compute('@ 5 10 12 7 bin (@ 10 20)'))
    .toStrictEqual(new Map([[10, [5, 10, 7]], [20, [12]]]));
});

test('binCount numeric array default', () => {
  expect(compute('@ 5 10 12 7 binCount (@ 10 20)'))
    .toStrictEqual(new Map([[10, 3], [20, 1]]));
});

const xStr = `
x = @ 
| (@ 23 0)
| (@  7 1)
| (@ 32 2)
| (@ 38 3)
| (@  3 4)
| (@ 34 5)`;
limitsStr = 'limits = @ 10 20 30 40';

test('bin array-of-arrays', () => {
  expect(compute(`
${xStr}
${limitsStr}
x bin limits [a,0 - b]`)).toStrictEqual(new Map([
    [10, [ [7, 1], [3, 4] ]], 
    [20, []],
    [30, [ [23, 0] ]],
    [40, [ [32, 2], [38, 3], [34, 5] ]]
  ]));
});

test('bin array-of-arrays, second callback', () => {
  expect(compute(`
${xStr}
${limitsStr}
x bin limits [a : 0 - b] [a map v (v : 1)]`)).toStrictEqual(new Map([
    [10, [1, 4]], 
    [20, []],
    [30, [0]],
    [40, [2, 3, 5]]
  ]));
});

test('binCount array-of-arrays', () => {
  expect(compute(`
${xStr}
${limitsStr}
x binCount limits [a,0 - b]`)).toStrictEqual(new Map([
    [10, 2], 
    [20, 0],
    [30, 1],
    [40, 3]
  ]));
});

test('binCount array-of-arrays, second callback', () => {
  expect(compute(`
${xStr}
${limitsStr}
x binCount limits [a,0 - b] [a > 1]`)).toStrictEqual(new Map([
    [10, true], 
    [20, false],
    [30, false],
    [40, true]
  ]));
});

test('bin, values in set, lower limits in array', () => {
  expect(compute(`
values = @@ 10 3 8 12 15 7 6
limits = @ 13 8 1
values bin limits [b - a]`
  )).toStrictEqual(new Map([
    [13, [15]],
    [8, [10, 8, 12]],
    [1, [3, 7, 6]]
  ]));
});

test('bin, values in array, lower limits in set', () => {
  expect(compute(`
values = @ 10 3 8 12 15 7 6
limits = @@ 13 8 1
values bin limits [b - a]`
  )).toStrictEqual(new Map([
    [13, [15]],
    [8, [10, 8, 12]],
    [1, [3, 7, 6]]
  ]));
});

test('bin, empty values', () => {
  expect(compute('@ bin (@ 10 20)'))
    .toStrictEqual(new Map([[10, []], [20, []]]));
});

test('bin, empty limits', () => {
  expect(compute('@ 3 7 6 9 bin (@)'))
    .toStrictEqual(new Map([]));
});

test('bin, ignore values outside last limit', () => {
  expect(compute('@ 5 (- 2) 25 10 20 12 20.1 bin (@ 10 20)'))
    .toStrictEqual(new Map([[10, [5, -2, 10]], [20, [20, 12]]]));
});

test('bin, values in map, limits from generator', () => {
  expect(compute(`
values = ## u (@ 5 10) v (@ 15 8) w (@ 2 11)
f = fun
    @ 5 9 yield
    @ 10 20 yield
limits = \\f
values bin limits [a,1 sum - (b sum)]`
  )).toStrictEqual(new Map([
    [[5, 9], [['w', [2, 11]]]],
    [[10, 20], [['u', [5, 10]], ['v', [15, 8]]]]
  ]));
});
