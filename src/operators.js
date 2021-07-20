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

// compile unary postfix
function compileUnaryPostfix(block) {
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

// compile unary JS word 
function compileUnaryJSWord(block) {
  const {operands, position} = block;
  const jsWord = operands[position];
  if (operands.length > 2) {
    syntaxError(jsWord, 'too many arguments');
  }
  const firstTkn = fakeToken(
    `(${jsWord.value === 'yieldFrom' ? 'yield*' : jsWord.value} `, jsWord);
  if (operands.length === 2) {
    block.operands = [[
      firstTkn,
      operands[position === 0 ? 1 : 0],
      ')'
    ]];
  }
  else {
    if (jsWord.value !== 'yield') {
      syntaxError(jsWord, 'missing argument');
    }
    block.operands = [[ firstTkn, ')' ]];
  }
}

// compile two parameter JS word
function compileTwoParamJSWord(block) {
  const {operands, position} = block;
  const jsWord = operands[position];
  if (operands.length !== 3) {
    syntaxError(jsWord, 'unexpected number of arguments');
  }
  const argsInds = position === 0 ? [1, 2] : (position === 1 ? [0, 2] : [0, 1]); 
  block.operands = [[
    '(',
    operands[argsInds[0]],
    ' ',
    jsWord,
    ' ',
    operands[argsInds[1]],
    ')'
  ]];
}

// JavaScript 'word operators'
const compileJSWords = new Map([

  ['new', (block, spread) => {
    const {operands, position} = block;
    const newWord = operands[position];
    if (operands.length < 2) {
      syntaxError(newWord, 'missing constructor');
    }
    const constructorIndex = position === 0 ? 1 : 0;
    const constructor = operands[constructorIndex];
    block.operands = [[
      fakeToken('(new ', newWord),
      constructor,
      fakeToken(spread ? '(...[' : '(', constructor),
      argumentList(block, new Set(position, constructorIndex)),
      fakeToken(spread ? '].flat()))' : '))', constructor)
    ]]
  }],

  ['await', compileUnaryJSWord],

  ['void', compileUnaryJSWord],

  ['typeof', compileUnaryJSWord],

  ['in', compileTwoParamJSWord],

  ['instanceof', compileTwoParamJSWord],

  ['yield', compileUnaryJSWord],

  ['yieldFrom', compileUnaryJSWord]

]);

// ========== operators ==========

export const operators = {

  // get property (unquoted)
  '.': {prec: 0, type: 'infix', arity: [2, 2], compile: compileDotGetter},

  // optional chaining .
  '?.': {prec: 0, type: 'infix', arity: [2, 2], compile: compileDotGetter},

  // get property of prototype (unquoted)
  '..': {prec: 0, type: 'infix', arity: [2, 2], compile: compileDotGetter},

  // get property
  ':': {prec: 0, type: 'infix', arity: [2, 2], compile: compileColonGetter},

  // optional chaining :
  '?:': {prec: 0, type: 'infix', arity: [2, 2], compile: compileColonGetter},

  // unary minus
  '~': {prec: 1, type: 'postfix', arity: [1, 1], compile: compileUnaryPostfix},

  // get property
  '::': {prec: 2, type: 'infix', arity: [2, 2], compile: compileColonGetter},

  // optional chaining ::
  '?::': {prec: 2, type: 'infix', arity: [2, 2], compile: compileColonGetter},

  // call function on rhs
  '=>': {prec: 2, type: 'call', arity: [1, Infinity],
          compile: block => {
            const {operands, operator, position} = block;
            const func = operands[position];
            if (isIdentifier(func) &&
                compileJSWords.has(func.value)) {
              compileJSWords.get(func.value)(block);
            }
            else {
              operator.js = '(';
              block.operands = [[
                func,
                operator,
                argumentList(block, new Set(position)),
                ')'
              ]];
            }
          }
        },

  // as => but spread array arguments
  '==>': {prec: 2, type: 'call', arity: [1, Infinity],
            compile: block => {
              const {operands, operator, position} = block;
              const func = operands[position];
              if (isIdentifier(func) && func.value === 'new') {
                compileJSWords.get('new')(block, true);
              }
              else {
                block.operands = [[
                  func,
                  fakeToken('(...[', operator),
                  argumentList(block, new Set(position)),
                  fakeToken('].flat())', operator)
                ]];
              }
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
  '&': {prec: 2, type: 'infix', arity: [2, 2],  
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
  '<<': {prec: 2, type: 'infix', arity: [2, 2],
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
  '>>': {prec: 2, type: 'infix', arity: [2, 2],
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
  '**': {prec: 2, type: 'infix', arity: [2, 2], compile: compileBasicInfix},

  // multiplication
  '*': {prec: 2, type: 'infix', arity: [2, 2], compile: compileBasicInfix},

  // division
  '/': {prec: 2, type: 'infix', arity: [2, 2], compile: compileBasicInfix},

  // remainder
  '%': {prec: 2, type: 'infix', arity: [2, 2], compile: compileBasicInfix},

  // addition
  '+': {prec: 2, type: 'infix', arity: [2, 2], compile: compileBasicInfix},

  // subtraction
  '-': {prec: 2, type: 'infix', arity: [2, 2], compile: compileBasicInfix},

  // less than
  '<': {prec: 3, type: 'infix', arity: [2, 2], compile: compileBasicInfix},

  // less than or equal
  '<=': {prec: 3, type: 'infix', arity: [2, 2], compile: compileBasicInfix},

  // greater than
  '>': {prec: 3, type: 'infix', arity: [2, 2], compile: compileBasicInfix},

  // greater than or equal
  '>=': {prec: 3, type: 'infix', arity: [2, 2], compile: compileBasicInfix},

  // strict equality 
  '=': {prec: 4, type: 'infix', arity: [2, 2], compile: compileBasicInfix},

  // strict inequality
  '!=': {prec: 4, type: 'infix', arity: [2, 2], compile: compileBasicInfix},

  // logical not
  '!': {prec: 5, type: 'postfix', arity: [1, 1], compile: compileUnaryPostfix},
   
  // logical and
  '&&': {prec: 6, type: 'infix', arity: [2, 2], compile: compileBasicInfix},

  // logical or
  '||': {prec: 6, type: 'infix', arity: [2, 2], compile: compileBasicInfix},

  // nullish coalescing
  '??': {prec: 6, type: 'infix', arity: [2, 2], compile: compileBasicInfix},

  // conditional
  '?': {prec: 7, type: 'infix', arity: [2, 3], 
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
  ',': {prec: 8, type: 'infix', arity: [2, 2], compile: compileBasicInfix}

};