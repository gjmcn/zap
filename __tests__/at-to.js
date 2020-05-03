const {testEach} = require('./test-helpers.js');

testEach('$at', [
  ['# u 5 v 6 $at "v"', 6],
  ['# u 5 v 6 $at "w"', undefined],
  ['@ 5 6 $at 1', 6],
  ['@ 5 6 $at 2', undefined],
  ['@ 5 (# u 6 v 7) $at 1 "u"', 6],
  ['@ 5 (# u 6 v 7) $at 1 "w"', undefined],
  ['# u (@ 5 6) v 7 $at "u" 0', 5],
  ['# u (@ 5 6) v 7 $at "u" 2', undefined],
  ["'abc' $at 2", 'c'],
  ["'abc' $at 3", undefined],
  ['# u 5 v (@ "abc" "def") $at "v" 1 0', 'd'],
  ['$at (@ 5 (# u 6 v 7)) 1 "u"', 6],
  ['(@ 5 (# u 6 v 7)) 1 $at "u"', 6],
  ['(@ 5 (# u 6 v 7)) 1 "u" $at', 6],
]);

testEach('$ats', [
  ['# u 5 v 6 w 7 $ats (@ "w" "u")',  {w: 7, u: 5}],
  ['# u 5 v 6 w 7 $ats (@ "z" "v")',  {z: undefined, v: 6}],
  ['# u 5 v 6 w 7 $ats "wu"',         {w: 7, u: 5}],
  ['@ 5 6 7 $ats (@ 2 0)',            [7, 5]],
  ["'abc' $ats (@ 2 0)",              'ca'],
  ['@ 5 (# u 6 v 7 w 8) $ats 1 (@ "w" "v")',    {w: 8, v: 7}],
  ['# u (@ 5 6 "abc") v 7 $ats "u" 2 (@@ 1 0)', 'ba'],
  ['x = # u (@ 5 6 7) v 7; $ats x "u" (@ 1 0)', [6, 5]],
  ['x = # u (@ 5 6 7) v 7; x "u" $ats (@ 1 0)', [6, 5]],
  ['x = # u (@ 5 6 7) v 7; x "u" (@ 1 0) $ats', [6, 5]],
  ['# u 5 v 6 $ats (@)',  {}],
  ['@ 5 6 7 $ats (@)',    []],
  ['"abc" $ats (@)',      ''],
], true);

testEach('$to', [
  ['# u 5 v 6 $to "v" 7', 7],
  ['o = # u 5 v 6; o "v" $to 7; o', {u:5, v: 7}],
  ['@ 5 6 $to 1 7', 7],
  ['x = @ 5 6; x 1 $to 7; x', [5, 7]],
  ['o = # u (@ 5 6) v 7; o "u" 1 $to 8; o', {u: [5, 8], v: 7}],
  ['x = @ 5 (# u 6 v 7); $to x 0 8; x 1 "v" 9 $to; x', [8, {u: 6, v: 9}]],
  ['x = @ 5 (# u 6 v 7); x 2 $to 8; x 1 "w" $to 9; x',
    [5, {u: 6, v: 7, w: 9}, 8]],
  ['x = @ 5 6; x 2 $to (@ 7 8) $to 1 9; x', [5, 6, [7, 9]]],
], true);
