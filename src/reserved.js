////////////////////////////////////////////////////////////////////////////////
// Reserved words.
//
// Reserved words cannot be assigned to.
//
// Currently, all reserved words are identified naively and used for their
// special purpose - so reserved words must be quoted where this is not
// appropriate (even with operators that autoquote).
////////////////////////////////////////////////////////////////////////////////

export const reserved = {};

reserved.wordLiterals = new Set([
  'true', 'false', 'null', 'undefined', 'Infinity', 'NaN'
]);

reserved.operators = new Set([
  // JS word operators
  'New', 'Await', 'Void', 'TypeOf', 'In', 'InstanceOf', 'Yield', 'YieldFrom',
  // JS symbol operators that are replaced with words
  'And', 'Or', 'Un', 'Not', 'Is', 'Isnt',
  // isXXX
  'IsArray', 'IsBigInt', 'IsBoolean', 'IsFinite', 'IsFunction', 'IsInteger',
  'IsNaN', 'IsNullish', 'IsNumber', 'IsString', 'IsSymbol',
  // other
  'AsSet', 'AsMap', 'Pipe', 'Call', 'Prt', 'Zeros', 'Ones'
]);

reserved.special = new Set([
  'this', 'super', '_limit_', '_index_'
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
  'jsonParse', 'jsonStringify', 'promise', 'reflect', 'proxy',
  // undefined
  '__'
]);

reserved.keywords = new Set([
  'end', 'done', 'break', 'continue', 'do', 'out', 'throw', 'print', 'delete',
  'let', 'be', 'set', 'cet', 'to', 'inc', 'dec', 'by', 'block', 'asyncBlock',
  'if', 'elif', 'else', 'while', 'each', 'awaitEach', 'of', 'loop', 'index',
  'try', 'catch', 'finally', 'fun', 'proc', 'gen', 'asyncFun', 'asyncProc',
  'asyncGen', 'class', 'subclass', 'export', 'import', 'default', 'all',
  'from', 'debugger', 'wait'
]);

reserved.invalid = new Set([
  'case', 'const', 'extends', 'for', 'in', 'instanceof', 'new', 'return',
  'switch', 'typeof', 'var', 'void', 'with', 'yield', 'enum', 'implements',
  'interface', 'package', 'private', 'protected', 'public', 'static', 'await',
  'as'  // pseudokeyword
]);

reserved.nonKeywords = new Set([
  ...reserved.wordLiterals,
  ...reserved.operators,
  ...reserved.special,
  ...reserved.swapped,
  ...reserved.invalid
]);