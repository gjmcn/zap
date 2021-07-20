////////////////////////////////////////////////////////////////////////////////
// Parse expression. If the tokens array represents a valid expression, the
// exported function returns the 'expression stack' an array where each element
// is an operand: a token object or a substack array. Each stack/substack array
// has a _zapOp property which is the operator token or open-bracket token
// corresponding to the operands in the array. For call operators, the array
// also has a _zapFun property with the function token - the other operands
// (the function arguments) are in the array as usual.
////////////////////////////////////////////////////////////////////////////////

// import sourceMapObject from '../node_modules/source-map/dist/source-map.js';
// const { SourceNode } = sourceMapObject;
import { syntaxError } from "./helpers.js";
import { operatorDetails, applyOperator} from "./operators.js";

export function parseExpression(tokens) {
  
  const stack = [];
  let block;  // 'expression block', not statement block
  let tkn;    // current token and its type property


  // ========== local helpers ==========

  function openBlock(openingToken) {
    const b = {
      openedWith: openingToken,  // token that opens block - undefined if base block 
      operator: null,            // current operator token
      operands: [],              // each element is an array, each element of which is a token,
                                 //   fake-token or string, or an array of these, or array-of-arrays, ...
      position: null,            // number of operands before operator,
    };
    if (block) {
      stack.push(block);
    }
    block = b;
  }

  function closeBlock() {
    closeSubexpr();
    if (block.openedWith) {  // current block is not base block
      const js = block.js;
      block = stack.pop();
      block.operands.push(js);
    }
  }

  function applyOperator(newOperator) {
    // !! CHECK NUMBER OPERANDS AGAINST ARITY OF OP HERE
    block.operands = block.operator.compile(block.operands);
    block.operator = newOperator;  // may be undefined
    


  }

  function closeSubexpr() {
    if (block.operator) {
      applyOperator();
    }
    else if (operands.length > 1) {
      syntaxError(tkn, 'multiple operands but no operator');
    }
    else if (operands.length === 0) {
      operands.js
    }
  }

  // ========== loop over tokens ==========

  for (let tkn of tokens) {

    const {type, value} = tkn;
    const {operands, position} = block

    // operator
    if (type === 'operator') {
      const {prec, type: opType, arity} = operators[value];
      
      

      else if (opType === 'infix') {
        if (stack.length !== 1) {
          syntaxError(
            tkn,
            `infix operator ${value}, one left operand expected`
          );
        }
        newStack(tkn);
      }

      else {  // call
        
      }

    }

  }

}


// BRACKETS!!!!!!!!!!!!!!!!

const bracketPairs = { '(': ')', '[': ']', '{': '}', '|': '|' };

function checkMatch(tkn, block) {
  if (tkn.value !== bracketPairs[block.openedWith]) {
    syntaxError(tkn, 'bracket mismatch');
  }
}

export const brackets = {

  '{': (tkn, block, stack) => {

  },

  '}': (tkn, block, stack) => {
    checkMatch(tkn, block);

  },

  '[': (tkn, block, stack) => {

  },

  ']': (tkn, block, stack) => {
    checkMatch(tkn, block);
    
  },

  '(': (tkn, block, stack) => {

  },

  ')': (tkn, block, stack) => {
    checkMatch(tkn, block);
    
  },

  '|': (tkn, block, stack) => {
    
    
  },

};