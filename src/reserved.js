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
  'put', 'load',
]);

reserved.special = new Set([
  'this', 'super'
]);

reserved.keywords = new Set([
  'end', 'break', 'continue', 'now', 'out', 'throw', 'say', 'let', 'be', 'set',
  'nil', 'opt', 'to', 'inc', 'dec', 'by', 'block', 'if', 'elif', 'else',
  'while', 'each', 'of', 'up', 'down', 'try', 'catch', 'finally', 'fun', 'gen',
  'async', 'export', 'import', 'from', 'default', 'all', 'debugger', 'wait',
  'for', 'class', 'extends', 'field', 'getter', 'setter', 'static', 'method'
]);

reserved.invalid = new Set([
  // JS reserved words
  'case', 'const', 'do', 'function', 'return', 'switch', 'this', 'var', 'with',
  'enum', 'implements', 'interface', 'package', 'private', 'protected',
  'public',
  // pseudokeywords
  'par', 'as', 'anon', 'anon_', 'done',
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

reserved.compound = new Set([
  'export let',
  'wait for each',
  'export fun', 'async fun', 'gen fun',
  'export gen fun', 'async gen fun', 'export async fun',
  'export async gen fun',
  'static method', 'async method', 'gen method',
  'static gen method', 'async gen method', 'static async method',
  'static async gen method',
  'static field',
  'export class',
  'export default',
  'import default', 'import all'
]);

reserved.pre = new Set([
  'wait', 'for', 'async', 'gen', 'static', 'import', 'export'
]);

reserved.preOrOpener = new Set(['wait', 'import', 'export']);