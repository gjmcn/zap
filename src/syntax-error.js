// Throw syntax error.
// t: token object
// msg: error message
export function syntaxError(t, msg) {
  throw Error(`Zap syntax at ${
    typeof t === 'string' ? t : `${t.line}:${t.column + 1}`}, ${msg}`);
}