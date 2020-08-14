const {compute} = require('./test-helpers.js');

// each, map

test('each, array, 0 callback args', () => {
  expect(compute(`
s = 0
@ 5 6 7 each (s += 1)
s
`)).toBe(3);
});

test('map, array, 0 callback args', () => {
  expect(compute(`
s = 0
@ 5 6 7 map (s += 1)
s
`)).toBe(3);
});

test('each, array, 1 callback arg', () => {
  expect(compute(`
x = @
@ 5 6 7 each v (x ~push (v + 10))
x
`)).toStrictEqual([15, 16, 17]);
});

test('map, array, 1 callback arg', () => {
  expect(compute(`@ 5 6 7 map v (v + 10)`))
    .toStrictEqual([15, 16, 17]);
});

test('each, range, 2 callback args', () => {
  expect(compute(`
x = @
5 to 7 each v i (x ~push v i)
x
`)).toStrictEqual([5, 0, 6, 1, 7, 2]);
});

test('map, range, 2 callback args', () => {
  expect(compute(`5 to 7 map v i (@ v i)`))
    .toStrictEqual([[5, 0], [6, 1], [7, 2]]);
});

test('each, string, 3 callback args', () => {
  expect(compute(`
x = @
'pq' each v i s
    x ~push v i s
x
`)).toStrictEqual(['p', 0, 'pq', 'q', 1, 'pq']);
});

test('map, string, 3 callback args', () => {
  expect(compute(`
'pq' map v i s
    @ v i s
`)).toStrictEqual([['p', 0, 'pq'], ['q', 1, 'pq']]);
});

test('each, empty array', () => {
  expect(compute(`
s = 0
@ each (s += 1)
s
`)).toBe(0);
});

test('map, empty array', () => {
  expect(compute(`@ map v (v + 10)`))
    .toStrictEqual([]);
});

test('map, 1-entry array', () => {
  expect(compute(`@ 5 map v (v + 10)`))
    .toStrictEqual([15]);
});

test('each, returns iterable', () => {
  expect(compute(`
x = @ 5 6 7
y = x each v (v + 5)
x == y
`)).toBe(true);
});

test('each, loop parameters are local', () => {
  expect(compute(`
x = @
'pq' each v i s
    x ~push v i s
    v = 100
    i = 200
    s = 300
x
`)).toStrictEqual(['p', 0, 'pq', 'q', 1, 'pq']);
});

test('each, array with empty entries', () => {
  expect(compute(`
s = 0
new Array 3 each v (s += 1)
s
`)).toBe(3);
})

test('map, array with empty entries', () => {
  expect(compute(`new Array 2 map v (v == undefined)`))
    .toStrictEqual([true, true]);
});


// ========== !! TO DO !! ==========: 
//  -do
//  -asyncEach, asyncMap. asyncDo loops
//  -stop
//  -yield and yieldRrom in loops