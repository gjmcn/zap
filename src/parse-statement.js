import { syntaxError } from './syntax-error.js';
import { structures, allFirstWords, simpleFirstWords, blockFirstWords }
  from './statementsjs';

// tokens: array of tokens that processing (reversed)
// addJS: function to add JavaScript (args: js, line, column)
// blockStack: array of statement branches currently open
//  - each branch is an array of objects (a reversed copy)
//  - current position for each branch (i.e. the last element) will be the
//    block component that currently in
export function parseStatement(tokens, addJS, blockStack) {

  let tkn, firstWord, struc, branch;

  // first component: opening keyword (first component is same in all branches)
  tkn = tokens.pop();
  firstWord = tkn.value;
  struc = structures[firstWord];
  addJS(`; ${struc[0][0].compile(firstWord)}`, tkn.line, tkn.column);

  // keyword-only statements
  if (firstWord === 'debugger' ||
      firstWord === 'break' ||
      firstWord === 'continue') { 
    return; 
  }

  // second component: use to resolve branch
  if (struc.length === 1) {
    branch = struc[0].slice(1).reverse();
  }
  else {
    !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    JUST ADDED mut SO NOW CAN ALWAYS RESOLVING SECOND BRANCH IS ALWAYS
    NAME <-> DESTRUC, OR KEYWORD <-> SOMETHING ELSE?
  }



  for (let branch of struc) {
    
  }





 


// const openBracket =
// new Set(['openParentheses',  'openProp',  'openFunction', 'quickFunction']);
// const closeBracket =
// new Set(['closeParentheses', 'closeProp', 'closeFunction', 'quickFunction']);
// const bracketPairs = { '(': ')', '[': ']', '{': '}', '|': '|' };


//             // brackets
//             else if (openBracket.has(type)) {
//               bracketStack.push(tkn.valuue);
//             }
//             else if (closeBracket.has(type)) {
//               if (bracketPairs[bracketStack.pop()] !== tkn.value) {
//                 zapSyntaxError('bracket mismatch');
//               }
//             }