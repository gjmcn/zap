////////////////////////////////////////////////////////////////////////////////
// Helper functions.
////////////////////////////////////////////////////////////////////////////////

// throw syntax error, t can be a string or a token object
export function syntaxError(t, msg) {
  throw Error(`Zap syntax at ${
    typeof t === 'string' ? t : `${t.line}:${t.column + 1}`}, ${msg}`);
}

// last element of array
export function last(arr) {
  return arr[arr.length - 1];
}

// does string start with capital letter?
export function isCapitalized(s) {
  return /^[A-Z]/.test(s);
}