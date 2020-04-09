const {compute, testEach, simpleTest} = require('./test-helpers.js');

testEach('$each', [
  ['x = 0; @ 5 6 $each [x += a]; x',                     11],
  ['x = 0; \\[** $yield 5; $yield 6] $each [x += a]; x', 11],
  ['x = @; $each (@@ 5 6) [x |push a]; x',    [5, 6]],
  ['x = @; ## u 5 v 6 $each [x |push a]; x',  [['u', 5], ['v', 6]]],
  ['x = @; 5 >> 7 $each [x |push a]; x',      [5, 6, 7]],
  ['x = @@; "abc" [x |add a] $each; x',       new Set(['a', 'b', 'c'])],
  ['@ 5 6 $each [a + 10];',                   [5, 6]],
  ['## u 5 v 6 $each [a :length];',           new Map([['u', 5], ['v', 6]])],
  ['"abc" $each [a $toUpperCase];',           'abc'],
  ['@ $each [a \\someFunc];',                 []],
  ['x = @; @ 5 6 $each [x |push (+ "" a b (c |join))]; x', ['505,6', '615,6']],
  ['x = @; $each [x |push b; b == 2 ? (c |return)]; x',    [0, 1, 2]],
  ['x = @; $new Array 2 $each [x |push a]; x', [undefined, undefined]],
], true);

testEach('$map', [
  ['@ 5 6 $map [a + 10]',                       [15, 16]],
  ['\\[** $yield 5; $yield 6] $map [a + 10];',  [15, 16]],
  ['(@@ 5 6) [a + 10] $map;',                   [15, 16]],
  ['$map (## u 5 v 6) [a |join]',               ['u,5', 'v,6']],
  ['5 >> 7 $map [a + 10]',                      [15, 16, 17]],
  ['"abc" $map [a $toUpperCase]',               ['A', 'B', 'C']],
  ['@ $map [a \\someFunc];',                    []],
  ['@ 5 6 $map [+ "" a b (c |join)]',           ['505,6', '615,6']],
  ['$map [b == 2 ? (c |return); b]',            [0, 1, 2]],
  ['$new Array 2 $map [a]',                     [undefined, undefined]],
], true);

testEach('$nestEach', [
  ['x = @; @@ 5 6 $nestEach (10 >> 30 10) [x |push (a + b)]; x',
    [15, 25, 35, 16, 26, 36]],
], true);

testEach('$nestMap', [
  ['"abc" $nestMap (@ 5 6) [a + b];',
    [['a5', 'a6'], ['b5', 'b6'], ['c5', 'c6']]],
], true);

testEach('$nest', [
  ['"ab" $nest (5 >> 7) $array;',
    [['a', 5], ['a', 6], ['a', 7], ['b', 5], ['b', 6], ['b', 7]]],
], true);

testEach('$zipEach', [
  ['x = @; @@ 5 6 7 $zipEach (10 >> 30 10) [x |push (a + b)]; x',
    [15, 26, 37]],
  ['x = @; @@ 5 6 7 $zipEach (10 >> 50 10) [x |push (a + b)]; x',
    [15, 26, 37]],
], true);

testEach('$zipMap', [ 
  ['"abc" $zipMap (@ 5 6 7) [a + b];', ['a5', 'b6', 'c7']],
  ['"ab"  $zipMap (@ 5 6 7) [a + b];', ['a5', 'b6']],
], true);

testEach('$zip', [ 
  ['$zip (5 >> 7) (@ 10 20 30) $array', [[5, 10], [6, 20], [7, 30]]],
  ['"abc" $zip (@ 5 6) $array',         [['a', 5], ['b', 6]]],
], true);

testEach('$do', [ 
  [`
    i = 5;
    x = @;
    $do [x |push i; i += 1; i + 10] $each [
      a == 17 ? (c |return);
    ];
    x;
  `, [5, 6]],
], true);

testEach('$while', [ 
  [`
    i = 7;
    x = @;
    $while [i > 4] $each [
      x |push i;
      i -= 1;
    ];
    x;
  `, [7, 6, 5]],
], true);

testEach('$seq', [
  ['$seq 1 [a < 10] [a * 2] $array', [1, 2, 4, 8]],
], true);
