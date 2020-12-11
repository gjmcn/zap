const {testEach} = require('./test-helpers.js');


// ========== !! TO DO !! ==========
// add remaining reduction operators 
// =================================


// median
testEach('median', [
  ['@ 4 2 7 10 median', 5.5],
  ['@ 4 2 7 median', 4],
  ['@ 4 2 median', 3],
  ['@ 4 median', 4],
  ['@ median isNaN', true],
  ['@ 5 "s" 1 median isNaN', true],
  ['@@ (# u 5 v 25) (# u 6 v 10) (# u 7 v 30) median [a,v]', 25],
  ['@@ (# u 5 v 25) (# u 6 v 10) (# u 7 v 30) median "v"', 25],
  ['@@ (# u 5 v 25) (# u 6 v 10) (# u 7 v 30) median "u" "sorted"', 6],
  ['@@ (# u 6 v 10) (# u 5 v 25) (# u 7 v 30) median "u" "sorted"', 5],
  ['@ 2 4 7 10 median [a] "sorted"', 5.5],
  ['@ 4 2 7 10 median [a] "sorted"', 4.5],
]);

// quantile
testEach('quantile', [
  ['@ 4 2 7 10 quantile 0', 2],
  ['@ 4 2 7 10 quantile (-1)', 2],
  ['@ 4 2 7 10 quantile 1', 10],
  ['@ 4 2 7 10 quantile 2', 10],
  ['@ 4 2 7 10 quantile 0.5', 5.5],
  ['@ 4 2 7 10 quantile "0.5"', 5.5],
  ['@ 4 2 7 10 quantile (2 / 3)', 7],
  ['@ 4 2 7 quantile 0.25', 3],
  ['@ 4 2 quantile 0.6', 3.2],
  ['@ 4 quantile 0', 4],
  ['@ 4 quantile 1', 4],
  ['@ 4 quantile 0.241', 4],
  ['@ quantile 0.8 isNaN', true],
  ['@ 5 "s" 1 quantile 0.6 isNaN', true],
  ['@ 2 3 4 quantile "s" isNaN', true],
  ['@@ (# u 5 v 25) (# u 6 v 10) (# u 7 v 30) quantile 0.25 [a,v]', 17.5],
  ['@@ (# u 5 v 25) (# u 6 v 10) (# u 7 v 30) quantile 0.25 "v"', 17.5],
  ['@@ (# u 5 v 25) (# u 6 v 10) (# u 7 v 30) quantile 0.25 "u" "sorted"', 5.5],
  ['@@ (# u 7 v 30) (# u 6 v 10) (# u 5 v 25) quantile 0.25 "u" "sorted"', 6.5],
  ['@ 2 4 7 10 quantile 0.5 [a] "sorted"', 5.5],
  ['@ 4 2 7 10 quantile 0.5 [a] "sorted"', 4.5],
  ['@ 4 2 7 quantile (0.5 - 1e-15)', 4],
]);