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