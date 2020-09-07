const {testEach} = require('./test-helpers.js');

testEach('ones', [
  ['3 ones', [1, 1, 1]],
  ['0 ones', []],
  ['2 3 ones', [[1, 1, 1], [1, 1, 1]]],
  ['ones 4 2 3',
    [
      [[1, 1, 1], [1, 1, 1]],
      [[1, 1, 1], [1, 1, 1]],
      [[1, 1, 1], [1, 1, 1]],
      [[1, 1, 1], [1, 1, 1]],
    ]
  ],
], 'true');

testEach('zeros', [
  ['3 zeros', [0, 0, 0]],
  ['2 3 zeros', [[0, 0, 0], [0, 0, 0]]],
  ['3 1 zeros', [[0], [0], [0]]],
  ['3 0 zeros', [[], [], []]],
  ['3 0 5 zeros', [[], [], []]],
], 'true');

testEach('empties', [
  ['3 empties', [ , , , ]],
  ['2 3 empties', [[ , , , ], [ , , , ]]],
  ['1 3 empties', [[ , , , ]]],
  ['2 0 empties', [[], []]],
  ['0 2 empties', []]
], 'true');