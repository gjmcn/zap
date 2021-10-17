////////////////////////////////////////////////////////////////////////////////
// Reserved words.
////////////////////////////////////////////////////////////////////////////////

export const reserved = {};

reserved.wordLiterals = new Set([
  'true', 'false', 'null', 'undefined', 'Infinity', 'NaN'
]);

reserved.operators = new Set([
  // JS word operators
  'New', 'Await', 'Void', 'Delete', 'TypeOf', 'In', 'InstanceOf', 'Yield',
  'YieldFrom',
  // JS symbol operators that are replaced with words
  'And', 'Or', 'Or_', 'Not', 'Is', 'Isnt',
  // isXXX
  'IsArray', 'IsBigInt', 'IsBoolean', 'IsFinite', 'IsFunction', 'IsInteger',
  'IsNaN', 'IsNullish', 'IsNumber', 'IsString', 'IsSymbol',
  // other
  'At', 'AsSet', 'AsMap', 'AsArray', 'Call', 'Put', 'Zeros', 'Ones', 'Load',
  'JsonParse', 'JsonStringify', 'CopyFrom', 'CopyTo'
]);

reserved.special = new Set([
  'this', 'super'
]);

reserved.swapped = new Set([
  // main JS objects built-ins
  'object', 'function', 'boolean', 'symbol', 'error', 'number', 'bigInt',
  'math', 'date', 'string', 'regExp', 'array',
  // typed arrays and related built-ins
  'int8Array', 'uint8Array', 'uint8ClampedArray', 'int16Array', 'uint16Array',
  'int32Array', 'uint32Array', 'float32Array', 'float64Array', 'bigInt64Array',
  'bigUint64Array', 'arrayBuffer', 'sharedArrayBuffer', 'atomics', 'dataView',
  // other built-ins
  'promise', 'reflect', 'proxy'
]);

reserved.keywords = new Set([
  'end', 'break', 'continue', 'now', 'out', 'throw', 'say', 'var', 'set', 'nil',
  'opt', 'to', 'inc', 'dec', 'by', 'block', 'if', 'elif', 'else', 'while',
  'each', 'await', 'of', 'up', 'down', 'try', 'catch', 'finally', 'fun', 'gen',
  'async', 'par', 'export', 'import', 'from', 'default', 'all', 'debugger',
  'wait', 'class', 'extends', 'field', 'getter', 'setter', 'static'
]);

reserved.invalid = new Set([
  // JS reserved words
  'case', 'const', 'delete', 'do', 'for', 'in', 'instanceof', 'let', 'return',
  'switch', 'typeof', 'void', 'with', 'yield', 'enum', 'implements',
  'interface', 'package', 'private', 'protected', 'public',
  // pseudokeywords
  'as', 'anon', 'anon_', 'done',
  // up/down loop variables
  'z_start_', 'z_limit_', 'z_by_', 'z_loop_'
]);

reserved.all = new Set([
  ...reserved.wordLiterals,
  ...reserved.operators,
  ...reserved.special,
  ...reserved.swapped,
  ...reserved.keywords,
  ...reserved.invalid
]);

reserved.compound = new Set([
  'export var',
  'await each',
  'async fun', 'gen fun', 'export fun',
  'async gen fun', 'export gen fun', 'export async fun', 'export async gen fun',
  'static fun', 'static async fun', 'static gen fun', 'static async gen fun',
  'getter fun', 'setter fun',
  'export class',
  'static field',
  'export default',
  'import default', 'import all'
]);