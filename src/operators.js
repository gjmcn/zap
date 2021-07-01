////////////////////////////////////////////////////////////////////////////////
// Operators and assignment symbols.
////////////////////////////////////////////////////////////////////////////////

export const operators = {
  '.':   {prec: 0, type: 'infix',  arity: 2},         // get property (unquoted)
  '..':  {prec: 0, type: 'infix',  arity: 2},         // get property of prototype (unquoted)
  ':':   {prec: 0, type: 'infix',  arity: 2},         // get property
  '?.':  {prec: 0, type: 'infix',  arity: 2},         // optional chaining .
  '?..': {prec: 0, type: 'infix',  arity: 2},         // optional chaining ..
  '?:':  {prec: 0, type: 'infix',  arity: 2},         // optional chaining :
  '!':   {prec: 1, type: 'prefix', arity: 1},         // logical not
  '~':   {prec: 1, type: 'prefix', arity: 1},         // unary minus
  '::':  {prec: 2, type: 'infix',  arity: 2},         // get property
  '?::': {prec: 2, type: 'infix',  arity: 2},         // optional chaining ::
  '=>':  {prec: 2, type: 'right',  arity: Infinity},  // call function on right
  '=<':  {prec: 2, type: 'left',   arity: Infinity},  // call function on left
  '->':  {prec: 2, type: 'right',  arity: Infinity},  // call method on right 
  '>>':  {prec: 2, type: 'right',  arity: Infinity},  // call function on right with new
  '?=>': {prec: 2, type: 'right',  arity: Infinity},  // optional chaining =>
  '?=<': {prec: 2, type: 'left',   arity: Infinity},  // optional chaining =<
  '?->': {prec: 2, type: 'right',  arity: Infinity},  // optional chaining ->
  '?>>': {prec: 2, type: 'right',  arity: Infinity},  // optional chaining >>
  '**':  {prec: 2, type: 'infix',  arity: 2},         // exponentiation
  '*':   {prec: 2, type: 'infix',  arity: 2},         // multiplication
  '/':   {prec: 2, type: 'infix',  arity: 2},         // division
  '%':   {prec: 2, type: 'infix',  arity: 2},         // remainder
  '+':   {prec: 2, type: 'infix',  arity: 2},         // addition
  '-':   {prec: 2, type: 'infix',  arity: 2},         // subtraction
  '<':   {prec: 3, type: 'infix',  arity: 2},         // less than
  '<=':  {prec: 3, type: 'infix',  arity: 2},         // less than or equal
  '>':   {prec: 3, type: 'infix',  arity: 2},         // greater than
  '>=':  {prec: 3, type: 'infix',  arity: 2},         // greater than or equal
  '==':  {prec: 4, type: 'infix',  arity: 2},         // strict equality 
  '!=':  {prec: 4, type: 'infix',  arity: 2},         // strict inequality
  '&&':  {prec: 5, type: 'infix',  arity: 2},         // logical and
  '||':  {prec: 5, type: 'infix',  arity: 2},         // logical or
  '??':  {prec: 5, type: 'infix',  arity: 2},         // nullish coalescing
  '?!':  {prec: 6, type: 'infix',  arity: 3},         // conditional
  ',':   {prec: 7, type: 'infix',  arity: 2},         // comma
};

// assignment 'symbols' are not true operators
export const assignmentSymbols = new Set([
  '=', '?=', '+=', '-=', '*=', '/=', '%=', '**='
]);