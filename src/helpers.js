////////////////////////////////////////////////////////////////////////////////
// Helper functions.
////////////////////////////////////////////////////////////////////////////////

import { reserved } from './reserved.js';

// throw syntax error, t can be a string or a token object
export function syntaxError(t, msg) {
  throw Error(`Zap syntax at ${
    typeof t === 'string' ? t : `${t.line}:${t.column + 1}`}, ${msg}`);
}

// last element of array
export function last(arr) {
  return arr[arr.length - 1];
}