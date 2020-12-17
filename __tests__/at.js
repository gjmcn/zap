const {testEach} = require('./test-helpers.js');

testEach('at', [
  ['# u 5 v 6 w 7 at (@ "w" "u")',    {w: 7, u: 5}],
  ['# u 5 v 6 w 7 at (@ "z" "v")',    {z: undefined, v: 6}],
  ['# u 5 v 6 w 7 at "wu"',           {w: 7, u: 5}],
  ['@ 5 6 7 at (@@ 2 0)',             [7, 5]],
  ['@ 5 6 7 at (@ 1)',                [6]],
  ['@ 0 10 20 30 40 50 at (2 to 4)',  [20, 30, 40]],
  ["'abc' at (@ 2 0)",                'ca'],
  ['# u 5 v 6 at (@)',  {}],
  ['@ 5 6 7 at (@)',    []],
  ['"abc" at (@)',      ''],
  ['# u 5 v 6 w 7 at (@ "w" "u") false',   {w: 7, u: 5}],
  ['# u 5 v 6 w 7 at (@ "w" "u") "array"', [7, 5]],
  ["'abc' at (@ 0 2 1 1) 1",               ['a', 'c', 'b', 'b']],
  ['@ 5 6 7 at (@@ 1) true',               [6]],
], true);