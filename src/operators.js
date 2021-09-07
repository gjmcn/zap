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
  return [operands[0], operator, operands[1]];
}

// compile colon getter
function compileColonGetter(block) {
  const {operands, operator} = block;
  operator.js = operator.value[0] === '?' ? '?.[' : '[' ;
  return [operands[0], operator, operands[1], ']'];
}

// compile unary postfix
function compileUnaryPostfix(block) {
  const {operands, operator} = block;
  operator.js = operator.value === '~' ? '-' : operator.value; 
  return ['(', operator, operands[0], ')'];
}

// compile basic infix
function compileBasicInfix(block) {
  const {operands, operator} = block;
  operator.js = operator.value; 
  return ['(', operands[0], operator, operands[1], ')'];
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
    return [firstTkn, operands[position === 0 ? 1 : 0], ')'];
  }
  else {
    if (jsWord.value !== 'yield') {
      syntaxError(jsWord, 'missing argument');
    }
    return [firstTkn, ')'];
  }
}

// compile two parameter JS word
function compileTwoParamJSWord(block) {
  const {operands, position} = block;
  const jsWord = operands[position];
  if (operands.length !== 3) {
    syntaxError(jsWord, 'unexpected number of arguments');
  }
  const firstArg = operands[position === 0 ? 1 : 0]; 
  return ['(', firstArg, ' ', jsWord, ' ', operands[2], ')'];
}

// JavaScript 'word operators'
const compileJSWords = new Map([

  ['new', (block, spread) => {
    const {operands, position} = block;
    const newWord = operands[position];
    if (operands.length < 2) {
      syntaxError(newWord, 'missing constructor');
    }
    const constructor = operands[position === 0 ? 1 : 0];
    return [
      fakeToken('(new ', newWord),
      constructor,
      fakeToken(spread ? '(...[' : '(', constructor),
      argumentList(block, new Set(0, 1)),
      fakeToken(spread ? '].flat()))' : '))', constructor)
    ];
  }],

  ['await', compileUnaryJSWord],

  ['void', compileUnaryJSWord],

  ['typeof', compileUnaryJSWord],

  ['in', compileTwoParamJSWord],

  ['instanceof', compileTwoParamJSWord],

  ['yield', compileUnaryJSWord],

  ['yieldFrom', compileUnaryJSWord]

]);


!! NEED TO ADD  Delete AND Load !!!!!!!!!!!!!!!!!!!

// ========== operator details ==========

export const operatorDetails = {

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

  // get property  BACK TO ::
  'At': {prec: 2, type: 'infix', arity: [2, 2], compile: compileColonGetter},

  // call function
  '=>': {prec: 2, type: 'function-call', arity: [1, Infinity],
          compile: block => {
            const {operands, operator, position} = block;
            const func = operands[position];
            if (isIdentifier(func) &&
                compileJSWords.has(func.value)) {
              return compileJSWords.get(func.value)(block);
            }
            else {
              operator.js = '(';
              return [
                func,
                operator,
                argumentList(block, new Set(position)),
                ')'
              ];
            }
          }
        },

  // as => but spread array arguments
  SHOULD USE f.apply(this, [allArgsHere].flat()) - SINCE IF USE ..., WILL SPREAD ALL ITERABLES INC STRINGS!
  '==>': {prec: 2, type: 'function-call', arity: [1, Infinity],
            compile: block => {
              const {operands, operator, position} = block;
              const func = operands[position];
              if (isIdentifier(func) && func.value === 'new') {
                return compileJSWords.get('new')(block, true);
              }
              else {
                return [
                  func,
                  fakeToken('(...[', operator),
                  argumentList(block, new Set(position)),
                  fakeToken('].flat())', operator)
                ];
              }
            }
         },

  // call method
  '->': {prec: 2, type: 'method-call', arity: [2, Infinity],   
          compile: block => {
            const {operands, operator} = block;
            const method = operands[1];
            return [
              operands[0],
              fakeToken('[', operator),
              isIdentifier(method) ? ["'", method, "'"] : method,
              fakeToken('](', operator),
              argumentList(block, new Set(0, 1)),
              ')'
            ];
          }
        },

  // as -> but spread array arguments (except first)
  '-->': {prec: 2, type: 'method-call', arity: [2, Infinity],
            compile: block => {
              const {operands, operator} = block;
              const method = operands[1];
              return [
                operands[0],
                fakeToken('[', operator),
                isIdentifier(method) ? ["'", method, "'"] : method,
                fakeToken('](...[', operator),
                argumentList(block, new Set(0, 1)),
                fakeToken('].flat())', operator)
              ];
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
            return [
              operator,
              operands[0],
              ",'",
              vble.value,
              "',",
              vble,
              ')'
            ];
          }
       },

  // copy
  'copy': {prec: 2, type: 'postfix', arity: [1, 1],
          compile: block => {
            const {operator} = block;
            operator.js = '{...';
            return [operator, operands[0], '}'];
          }
        },

  // copyFrom
  'copyfrom': {prec: 2, type: 'infix', arity: [2, 2],
          compile: block => {
            const {operator} = block;
            operator.js = 'Object.assign(';
            return [operator, argumentList(block), ')'];
          }
        },

  // copy
  'copyTo': {prec: 2, type: 'infix', arity: [2, 2],
          compile: block => {
            const {operator, operands} = block;
            operator.js = 'Object.assign(';
            return [operator, operands[1], ',', operands[0], ')'];
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
            return [
              '(',
              operands[0],
              fakeToken('?', operator),
              operands[1],
              fakeToken(':', operator),
              operands[2] ?? 'undefined',
              ')'
            ];
          }
       },

  // comma
  ',': {prec: 8, type: 'infix', arity: [2, 2], compile: compileBasicInfix}

};


// ========== apply operator ==========

// returns an array representing the result of the applied operator
export function applyOperator(block) {

  const {operator, operands, position} = block;
  const {arity, type, compile} = operatorDetails[operator.value];

  // check arity
  if (operands.length < arity[0] || operands.length > arity[1]) {
    syntaxError(operator, 'invalid number of operands');
  }

  // check position
  if (type === 'postfix') {
    if (position !== 1) {
      syntaxError(operator, `${type} operator must be after its operand`);
    }
  }
  else if (type === 'infix' || type === 'method-call') {
    if (position !== 1) {
      syntaxError(operator, `${type} operator must be after its first operand`);
    }
  }
  else {  // function-call
    if (position > 1) {
      syntaxError(
        operator,
        `${type} operator must be before or after its first operand`
      );
    }
  }

  // 'apply' operator
  return compile(block);

} 