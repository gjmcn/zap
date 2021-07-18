////////////////////////////////////////////////////////////////////////////////
// Operators.
////////////////////////////////////////////////////////////////////////////////

import { syntaxError } from './helpers.js';
import { reserved } from "./reserved.js";


// ========== local helpers ==========

// new token object with given js, and line and column of passed token
function fakeToken(js, tkn) {
  return {
    js,
    line: tkn.line,
    column: tkn.column,
  };
}

// argument list for block, do not include operands with indices in omit
function argumentList(block, omit) {
  const {operands} = block;
  const r = [];
  for (let i = 0; i < operands.length; i++) {
    if (!omit || !omit.has(i)) {
      r.push(operands[i], ',');
    }
  }
  r.pop();
  return r;
}

// check if operand is an identifier token
function isIdentifier(operand) {
  return operand.$$$zapToken$$$ && operand.type === 'identifier';
}

// compile dot getter
function compileDotGetter(block) {
  const {operands, operator} = block;
  if (!isIdentifier(operands[1])) {
    syntaxError(operator, 'identifier expected')
  }
  operator.js = operator.value === '..' ? '.prototype.' : operator.value;
  block.operands = [[operands[0], operator, operands[1]]];
}

// compile colon getter
function compileColonGetter(block) {
  const {operands, operator} = block;
  operator.js = operator.value[0] === '?' ? '?.[' : '[' ;
  block.operands = [[operands[0], operator, operands[1], ']']];
}

// compile unary prefix
function compileUnaryPrefix(block) {
  const {operands, operator} = block;
  operator.js = operator.value === '~' ? '-' : operator.value; 
  block.operands = [['(', operator, operands[0], ')']];
}

// compile basic infix
function compileBasicInfix(block) {
  const {operands, operator} = block;
  operator.js = operator.value; 
  block.operands = [['(', operands[0], operator, operands[1], ')']];
}


// ========== operators ==========

export const operators = {

  // get property (unquoted)
  '.': {prec: 0, type: 'infix', arity: 2, compile: compileDotGetter},

  // optional chaining .
  '?.': {prec: 0, type: 'infix', arity: 2, compile: compileDotGetter},

  // get property of prototype (unquoted)
  '..': {prec: 0, type: 'infix', arity: 2, compile: compileDotGetter},

  // get property
  ':': {prec: 0, type: 'infix', arity: 2, compile: compileColonGetter},

  // optional chaining :
  '?:': {prec: 0, type: 'infix', arity: 2, compile: compileColonGetter},

  // sum/concatenate
  '#': {prec: 1, type: 'prefix', arity: [2, Infinity],  
          compile: block => {
            const {operands, operator} = block;
            const r = [fakeToken('`', operator)];
            for (let o of operands) {
              r.push('${', o, '}');
            }
            r.push(fakeToken('`', operator));
            block.operands = [r];
          }
       },

  // logical not
  '!': {prec: 1, type: 'prefix', arity: 1, compile: compileUnaryPrefix},

  // unary minus
  '~': {prec: 1, type: 'prefix', arity: 1, compile: compileUnaryPrefix},

  // get property
  '::': {prec: 2, type: 'infix', arity: 2, compile: compileColonGetter},

  // optional chaining ::
  '?::': {prec: 2, type: 'infix', arity: 2, compile: compileColonGetter},

  // call function on rhs
  '=>': {prec: 2, type: 'call', arity: [1, Infinity],   
          compile: block => {
            const {operands, operator, position} = block;
            operator.js = '(';
            block.operands = [[
              operands[position],
              operator,
              argumentList(block, new Set(position)),
              ')'
            ]];
          }
        },

  // as => but spread array arguments
  '==>': {prec: 2, type: 'call', arity: [1, Infinity],   
            compile: block => {
              const {operands, operator, position} = block;
              block.operands = [[
                operands[position],
                fakeToken('(...[', operator),
                argumentList(block, new Set(position)),
                fakeToken('].flat())', operator)
              ]];
            }
         },

  // call method
  '->': {prec: 2, type: 'call', arity: [2, Infinity],   
          compile: block => {
            const {operands, operator} = block;
            const method = operands[1];
            block.operands = [[
              operands[0],
              fakeToken('[', operator),
              isIdentifier(method) ? ["'", method, "'"] : method,
              fakeToken('](', operator),
              argumentList(block, new Set(0, 1)),
              ')'
            ]];
          }
        },

  // as -> but spread array arguments (except first)
  '-->': {prec: 2, type: 'call', arity: [2, Infinity],
            compile: block => {
              const {operands, operator} = block;
              const method = operands[1];
              block.operands = [[
                operands[0],
                fakeToken('[', operator),
                isIdentifier(method) ? ["'", method, "'"] : method,
                fakeToken('](...[', operator),
                argumentList(block, new Set(0, 1)),
                fakeToken('].flat())', operator)
              ]];
            }
         },

  // as -> but return calling object
  '<>': {prec: 2, type: 'call', arity: [2, Infinity],
          compile: block => {
            const {operands, operator} = block;
            const method = operands[1];
            operator.js = '((o, m, ...z) => (o[m](...z), o))(';
            block.operands = [[
              operator,
              operands[0],
              isIdentifier(method) ? [",'", method, "',"] : [',', method, ','],
              argumentList(block, new Set(0, 1)),
              ')'
            ]];
          }
        },

  // set property with variable
  '&': {prec: 2, type: 'infix', arity: 2,  
          compile: block => {
            const {operator, operands} = block;
            const vble = operands[1]
            if (!isIdentifier(vble)) {
              syntaxError(operator, 'identifier expected');
            }
            if (reserved.nonKeywords.has(vble.value)) {
              syntaxError(vble, `${vble.value} is a reserved word`);
            }
            operator.js = '((o, p, v) => (o[p] = v, o))(';
            block.operands = [[
              operator,
              operands[0],
              ",'",
              vble.value,
              "',",
              vble,
              ')'
            ]]
          }
       },

  // copy properties from rhs to lhs
  '<<': {prec: 2, type: 'infix', arity: 2,
          compile: block => {
            const {operator} = block;
            operator.js = 'Object.assign(';
            block.operands = [[
              operator,
              argumentList(block),
              ')'
            ]]
          }
        },

  // copy properties from lhs to rhs
  '>>': {prec: 2, type: 'infix', arity: 2,
          compile: block => {
            const {operator, operands} = block;
            operator.js = 'Object.assign(';
            block.operands = [[
              operator,
              operands[1],
              ',',
              operands[0],
              ')'
            ]]
          }
        },

  // exponentiation
  '**': {prec: 2, type: 'infix', arity: 2, compile: compileBasicInfix},

  // multiplication
  '*': {prec: 2, type: 'infix', arity: 2, compile: compileBasicInfix},

  // division
  '/': {prec: 2, type: 'infix', arity: 2, compile: compileBasicInfix},

  // remainder
  '%': {prec: 2, type: 'infix', arity: 2, compile: compileBasicInfix},

  // addition
  '+': {prec: 2, type: 'infix', arity: 2, compile: compileBasicInfix},

  // subtraction
  '-': {prec: 2, type: 'infix', arity: 2, compile: compileBasicInfix},

  // less than
  '<': {prec: 3, type: 'infix', arity: 2, compile: compileBasicInfix},

  // less than or equal
  '<=': {prec: 3, type: 'infix', arity: 2, compile: compileBasicInfix},

  // greater than
  '>': {prec: 3, type: 'infix', arity: 2, compile: compileBasicInfix},

  // greater than or equal
  '>=': {prec: 3, type: 'infix', arity: 2, compile: compileBasicInfix},

  // strict equality 
  '=': {prec: 4, type: 'infix', arity: 2, compile: compileBasicInfix},

  // strict inequality
  '!=': {prec: 4, type: 'infix', arity: 2, compile: compileBasicInfix},

   // logical and
  '&&': {prec: 5, type: 'infix', arity: 2, compile: compileBasicInfix},

  // logical or
  '||': {prec: 5, type: 'infix', arity: 2, compile: compileBasicInfix},

  // nullish coalescing
  '??': {prec: 5, type: 'infix', arity: 2, compile: compileBasicInfix},

  // conditional
  '?': {prec: 6, type: 'infix', arity: [2, 3], 
          compile: block => {
            const {operator, operands} = block;
            block.operands = [[
              '(',
              operands[0],
              fakeToken('?', operator),
              operands[1],
              fakeToken(':', operator),
              operands[2] ?? 'undefined',
              ')'
            ]]
          }
       },

  // comma
  ',': {prec: 7, type: 'infix', arity: 2, compile: compileBasicInfix}

};