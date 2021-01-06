const {testEach} = require('./test-helpers.js');

testEach('array', [
  ['array 5 6 7', [5, 6, 7]],
  ['array (@ 5 6) 7', [5, 6, 7]],
  ['(@ 5) array (@ 6) (@ 7)', [5, 6, 7]],
  ['array 5 (@ (@ 6 7) 8)', [5, [6, 7], 8]],
  ['(5 to 7) (@@ 8 9) array ', [5, 6, 7, 8, 9]],
  ['"567" array ', ['567']],
  ["@ 4 '567' array", [4, '567']],
  ['array', []],
  ["@ array", []],
  ["array 5 (@) 6", [5, 6]],
  [`
fun
    @ 5 6 yield
    @ 7 8 yield
| call array  
  `, [[5, 6], [7, 8]]
  ],
], true);