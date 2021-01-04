const {compute} = require('./test-helpers.js');

const pStr = `(@ (# u 1 v 4) (# u 2 v 5) (# u 3 v 6))`;
const qStr = `(@ (# u 0 w 7 x 10) (# u 3 w 8 x 20) (# u 1 w 9 x 30))`;
const rStr = `(@ (# x 10 y 11) (# x 30 y 31))`;
const xStr = `(@ (@ 1 2) (@ 3 4))`;
const yStr = `(@ (@ 1 6) (@ 7 8))`;
const zStr = `(@@ (# a 2 b 10) (# a 2 b 11) (# a false b 12))`;

test('innerJoin', () => {
  expect(compute(`${pStr} innerJoin ${qStr} 'u' array`)).toStrictEqual([
    [{u: 1, v: 4}, {u: 1, w: 9, x: 30}],
    [{u: 3, v: 6}, {u: 3, w: 8, x: 20}]
  ]);
});

test('leftJoin', () => {
  expect(compute(`${pStr} leftJoin ${qStr} 'u' array`)).toStrictEqual([
    [{u: 1, v: 4}, {u: 1, w: 9, x: 30}],
    [{u: 3, v: 6}, {u: 3, w: 8, x: 20}],
    [{u: 2, v: 5}, null               ]
  ]);
});

test('rightJoin', () => {
  expect(compute(`${pStr} rightJoin ${qStr} 'u' array`)).toStrictEqual([
    [{u: 1, v: 4}, {u: 1, w: 9, x: 30}],
    [{u: 3, v: 6}, {u: 3, w: 8, x: 20}],
    [null,         {u: 0, w: 7, x: 10}]
  ]);
});

test('outerJoin', () => {
  expect(compute(`${pStr} outerJoin ${qStr} 'u' array`)).toStrictEqual([
    [{u: 1, v: 4}, {u: 1, w: 9, x: 30}],
    [{u: 3, v: 6}, {u: 3, w: 8, x: 20}],
    [{u: 2, v: 5}, null               ],
    [null,         {u: 0, w: 7, x: 10}]
  ]);
});

test('semiJoin', () => {
  expect(compute(`${pStr} semiJoin ${qStr} 'u' array`)).toStrictEqual([
    [{u: 1, v: 4}],
    [{u: 3, v: 6}]
  ]);
});

test('antiJoin', () => {
  expect(compute(`${pStr} antiJoin ${qStr} 'u' array`)).toStrictEqual([
    [{u: 2, v: 5}]
  ]);
});

test('crossJoin', () => {
  expect(compute(`${pStr} crossJoin ${rStr} array`)).toStrictEqual([
    [{u: 1, v: 4}, {x: 10, y: 11}], 
    [{u: 1, v: 4}, {x: 30, y: 31}], 
    [{u: 2, v: 5}, {x: 10, y: 11}], 
    [{u: 2, v: 5}, {x: 30, y: 31}], 
    [{u: 3, v: 6}, {x: 10, y: 11}], 
    [{u: 3, v: 6}, {x: 30, y: 31}] 
  ]);
});

test('innerJoin, inner arrays', () => {
  expect(compute(`${xStr} innerJoin ${yStr} 0 array`)).toStrictEqual([
    [[1, 2], [1, 6]], 
  ]);
});

test('leftJoin, inner arrays', () => {
  expect(compute(`${xStr} leftJoin ${yStr} 0 array`)).toStrictEqual([
    [[1, 2], [1, 6]], 
    [[3, 4], null  ] 
  ]);
});

test('righJoin, inner arrays', () => {
  expect(compute(`${xStr} rightJoin ${yStr} 0 array`)).toStrictEqual([
    [[1, 2], [1, 6]], 
    [null,   [7, 8]]  
  ]);
});

test('outerJoin, inner arrays', () => {
  expect(compute(`${xStr} outerJoin ${yStr} 0 array`)).toStrictEqual([
    [[1, 2], [1, 6]], 
    [[3, 4], null  ], 
    [null,   [7, 8]]
  ]);
});

test('crossJoin, inner arrays', () => {
  expect(compute(`${xStr} crossJoin ${yStr} array`)).toStrictEqual([
    [[1, 2], [1, 6]], 
    [[1, 2], [7, 8]], 
    [[3, 4], [1, 6]], 
    [[3, 4], [7, 8]] 
  ]);
});

test('semiJoin, inner arrays', () => {
  expect(compute(`${xStr} semiJoin ${yStr} 0 array`)).toStrictEqual([
    [[1, 2]], 
  ]);
});

test('antiJoin, inner arrays', () => {
  expect(compute(`${xStr} antiJoin ${yStr} 0 array`)).toStrictEqual([
    [[3, 4]], 
  ]);
});

test('outerJoin, limit', () => {
  expect(compute(`${pStr} outerJoin ${qStr} 'u' 3 array`)).toStrictEqual([
    [{u: 1, v: 4}, {u: 1, w: 9, x: 30}],
    [{u: 3, v: 6}, {u: 3, w: 8, x: 20}],
    [{u: 2, v: 5}, null               ]
  ]);
});

test('crossJoin, limit', () => {
  expect(compute(`${pStr} crossJoin ${rStr} 2 array`)).toStrictEqual([
    [{u: 1, v: 4}, {x: 10, y: 11}], 
    [{u: 1, v: 4}, {x: 30, y: 31}]
  ]);
});

test('semiJoin, limit', () => {
  expect(compute(`${pStr} semiJoin ${qStr} 'u' 1 array`)).toStrictEqual([
    [{u: 1, v: 4}]
  ]);
});

test('antiJoin, limit', () => {
  expect(compute(`${pStr} antiJoin ${qStr} 'u' 10 array`)).toStrictEqual([
    [{u: 2, v: 5}]
  ]);
});

test('outerJoin, chained', () => {
  expect(compute(
    `${pStr} outerJoin ${qStr} 'u' outerJoin ${rStr} [a,1 ?: 'x' == b,x] array`
  )).toStrictEqual([
    [{u: 1, v: 4}, {u: 1, w: 9, x: 30}, {x: 30, y: 31}], 
    [null,         {u: 0, w: 7, x: 10}, {x: 10, y: 11}], 
    [{u: 3, v: 6}, {u: 3, w: 8, x: 20}, null          ], 
    [{u: 2, v: 5}, null,                null          ]
  ]);
});

test('outerJoin, empty first operand', () => {
  expect(compute(`@ outerJoin ${pStr} 'u' array`)).toStrictEqual([
    [null, {u: 1, v: 4}],
    [null, {u: 2, v: 5}],
    [null, {u: 3, v: 6}]
  ]);
});

test('outerJoin, empty second operand', () => {
  expect(compute(`${pStr} outerJoin (@) 'u' array`)).toStrictEqual([
    [{u: 1, v: 4}, null],
    [{u: 2, v: 5}, null],
    [{u: 3, v: 6}, null]
  ]);
});

test('outerJoin, empty operands', () => {
  expect(compute(`@ outerJoin (@) 'u' array`)).toStrictEqual([]);
});

test('crossJoin, empty first operand', () => {
  expect(compute(`@ crossJoin ${pStr} array`)).toStrictEqual([]);
});

test('crossJoin, empty second operand', () => {
  expect(compute(`${pStr} crossJoin (@) array`)).toStrictEqual([]);
});

test('crossJoin, empty operands', () => {
  expect(compute(`@ crossJoin (@) array`)).toStrictEqual([]);
});

test('crush, outerJoin', () => {
  expect(compute(`${pStr} outerJoin ${qStr} 'u' crush`)).toStrictEqual([
    {u: 1, v: 4, w: 9, x: 30},
    {u: 3, v: 6, w: 8, x: 20},
    {u: 2, v: 5             },
    {u: 0,       w: 7, x: 10}
  ]);
});

test('crush, outerJoin, prefix and keep', () => {
  expect(compute(
`${pStr} outerJoin ${qStr} 'u' 
| crush (# prefix 'p_') (# prefix 'q_' keep (@ 'u' 'x'))`
  )).toStrictEqual([
    {p_u: 1, p_v: 4, q_u: 1, q_x: 30},
    {p_u: 3, p_v: 6, q_u: 3, q_x: 20},
    {p_u: 2, p_v: 5                 },
    {                q_u: 0, q_x: 10}
  ]);
});

test('crush, outerJoin, chained', () => {
  expect(compute(
    `${pStr} outerJoin ${qStr} 'u' crush outerJoin ${rStr} 'x' crush`
  )).toStrictEqual([
    {u: 1, v: 4, w: 9, x: 30, y: 31}, 
    {u: 0,       w: 7, x: 10, y: 11}, 
    {u: 3, v: 6, w: 8, x: 20       }, 
    {u: 2, v: 5                    }
  ]);
});

test('innerJoin, set and array, repeats, different column names', () => {
  expect(compute(
    `${zStr} innerJoin ${pStr} (@ 'a' 'u') array`
  )).toStrictEqual([
    [{a: 2, b: 10}, {u: 2, v: 5}],
    [{a: 2, b: 11}, {u: 2, v: 5}]
  ])
});

test('innerJoin, array and set, repeats, callback', () => {
  expect(compute(
    `${pStr} innerJoin ${zStr} [a,v == 6 && (b,b == 11) || (b,a !)] array`
  )).toStrictEqual([
    [{u: 1, v: 4}, {a: false, b: 12}],
    [{u: 2, v: 5}, {a: false, b: 12}],
    [{u: 3, v: 6}, {a: 2    , b: 11}],
    [{u: 3, v: 6}, {a: false, b: 12}],
  ])
});