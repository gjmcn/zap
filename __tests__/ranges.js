const {testEach} = require('./test-helpers.js');

testEach('range', [
  ['5 to 5 array',    []],
  ['1 to 2 array',    [1, 2]],
  ['3 to 6 array',    [3, 4, 5, 6]],
  ['0 to 4 2 array',  [0, 2, 4]],
  ['1.5 to (-4) (-2) array',    [1.5, -0.5, -2.5]],
  ['5 linSpace 5 0 array',      []],
  ['5 linSpace 5 1 array',      [5]],
  ['5 linSpace 5 3 array',      [5, 5, 5]],
  ['2 linSpace 5 4 array',      [2, 3, 4, 5]],
  ['1.5 linSpace (-4) 3 array', [1.5, -1.25, -4]],
], 'true');