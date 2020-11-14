const {testEach} = require('./test-helpers.js');

testEach('interpolate', [
  ['5 9 interpolate 0', 5],
  ['5 9 interpolate 1', 9],
  ['5 9 interpolate 0.5', 7],
  ['5 9 interpolate (3 / 8)', 6.5],
  ['5 9 interpolate 1.5', 11],
  ['5 9 interpolate (-0.5)', 3],
  ['interpolate 2 (-4) 0.5', -1],
  ['interpolate true "3.6" 0.1', 1.26],
]);