////////////////////////////////////////////////////////////////////////////////
// Reserved words.
////////////////////////////////////////////////////////////////////////////////

export const reserved = {};

reserved.wordLiterals = new Set([
  'true', 'false', 'null', 'undefined', 'Infinity', 'NaN'
]);

reserved.operators = new Set([
  // JS word operators
  'new', 'await', 'void', 'delete', 'typeof', 'in', 'instanceof', 'yield',
  'yield_',
  // JS symbol operators that are replaced with words
  'and', 'or', 'or_', 'not', 'is', 'isnt',
  // isXXX
  'isarray', 'isbigint', 'isboolean', 'isfinite', 'isfunction', 'isinteger',
  'isnan', 'isnullish', 'isnumber', 'isstring', 'issymbol',
  // other
  'put', 'load', 'do', 'pass'
]);

reserved.special = new Set([
  'this', 'super'
]);

reserved.keywords = new Set([
  'end', 'break', 'continue', 'cmd', 'out', 'throw', 'say', 'let', 'be', 'set',
  'nil', 'opt', 'to', 'inc', 'dec', 'by', 'block', 'if', 'elif', 'else',
  'while', 'loop', 'for', 'of', 'up', 'down', 'try', 'catch', 'finally', 'fun',
  'gen', 'async', 'export', 'import', 'from', 'default', 'all', 'debugger',
  'wait', 'class', 'extends', 'field', 'getter', 'setter', 'static', 'method'
]);

reserved.invalid = new Set([
  // JS reserved words
  'case', 'const', 'function', 'return', 'switch', 'var', 'with', 'enum',
  'implements', 'interface', 'package', 'private', 'protected', 'public',
  // pseudokeywords
  'par', 'as', 'sfun', 'sfun_', 'efun',
  // up/down loop variables
  'z_start_', 'z_limit_', 'z_by_', 'z_loop_'
]);

reserved.allWords = new Set([
  ...reserved.wordLiterals,
  ...reserved.operators,
  ...reserved.special,
  ...reserved.keywords,
  ...reserved.invalid
]);