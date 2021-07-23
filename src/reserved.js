////////////////////////////////////////////////////////////////////////////////
// Reserved words.
////////////////////////////////////////////////////////////////////////////////

export const reserved = {};

reserved.wordLiterals = new Set([
  'true', 'false', 'null', 'undefined', 'Infinity', 'NaN'
]);

reserved.keywords = new Set([
  'end', '@end', 'break', 'continue', 'do', 'output', 'throw', 'print',
  'delete', 'var', 'var_', 'var__', 'set', 'set_', 'set__', 'to', 'cet', 'def',
  'inc', 'dec', 'by', 'block', 'if', 'elif', 'else', 'while', 'each', 'each_',
  'each__', 'awaitEach', 'awaitEach_', 'awaitEach__', 'of', 'loop', 'index',
  'try', 'catch', 'finally', 'fun', 'gen', 'asyncFun', 'asyncGen', '@fun',
  '@proc', '@gen', '@asyncFun', '@asyncProc', '@asyncGen', 'class', 'extends',
  'export', 'import', 'from', 'all', 'default', 'debugger', 'input'
]);

reserved.invalid = new Set([
  'case', 'const', 'for', 'function', 'let', 'return', 'switch', 'with',
  'enum', 'implements', 'interface', 'package', 'private', 'protected',
  'public', 'static',
  'as'  // pseudokeyword
]);

reserved.nonKeywords = new Set([
  ...reserved.wordLiterals,
  ...reserved.invalid
]);