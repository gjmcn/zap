////////////////////////////////////////////////////////////////////////////////
// Parse component of statement.
////////////////////////////////////////////////////////////////////////////////

import { reserved } from './reserved.js';
import { syntaxError } from './syntax-error.js';

// last element of array
function last(arr) {
  return arr[arr.length - 1];
}

// check if any tokens in arr are reserved non-keywords
function containsReservedWord(arr) {
  return arr.some(elm => reserved.nonKeywords.has(elm.value));
}

// bracket pairs
const bracketPairs = { '(': ')', '[': ']', '{': '}', '|': '|' };

// check if tokensElement is given component type
// - elm parameter will be an element of the tokens array, so can be a single
//   keywork token or an array of non-keyword tokens
const componentIs = {

  reservedName: (elm, isArray) => {
    if (isArray && elm.length === 1 && elm[0].type === 'identifier') {
      if (containsReservedWord(elm)) {
        syntaxError(elm[0], `${elm[0].value} is a reserved word`);
      }
      return true;
    }
  },

!!!!!!!!!!!!!!!!HERE!!!!!!!!!!!!!!!!!!

  destructure: (elm, isArray) => {
    if (isArray && elm.length > 3) {
      const k = elm.length - 1;
      if (elm[0].type === 'openCurly'  || elm[0] === 'openSquare') ||
          (elm[0].type === 'openSquare' && elm[k] === 'closeSquare'))


    } 
        ()
      
      
      ) {
      
    
    
    // SPREAD, INVALID, ...
      return false;
    }
  }



}

// Resolve branch of statement (struc object) that on
export function resolveBranch(tokens, struc) {

  // only one branch
  if (struc.length === 1) {
    return struc[0];
  }

  // loop over branches until can resolve
  const nextTokens = last(tokens);
  const nextTokensIsArray = Array.isArray(nextToknes);
  for (let branch of struc) {
    const secondComp = branch[1];
    switch (secondComp.type) {  // uses fall-through intentionally!
      case 'reservedName':
        if (nextTokensIsArray && 
            nextTokensIsArray.length === 1 &&
            nextTokens[0].type === 'identifier' &&
            !reserved.nonKeywords.has(nextTokens[0])) {
          return branch;
        }
      case 'destructure':
        if (componentIs)  !!!!!!!!!!!!!!!!!!!!! CREATE componentsIs  and even add reservedName to it!

        



      if (nextTkn.type !== identif)

      
      )
    }





  else if ()
  
  else if (nameOrOther.has(firstWord)) {
    setBranch(components.isNext(tokens, 'name', {: 'to'}) ? 0 : 1
    );
  }
  else if (firstWord === 'set') {
    setBranch(
      components.isNext(tokens, {type: 'name'})
        ? 0
        : components.isNext(tokens, {'destructure')
          ? 1
          : 2
    );
  }
  else if (firstWord === 'export') {
    setBranch(tokenPeek().value === 'default' ? 0 : 1);
  }
  else if (firstWord === 'import') {
    setBranch(
      tokenPeek().value === 'default'
        ? 0
        : tokenPeek().value === 'all'
          ? 1
          : 2
    );
  }
  else {
    throw Error(`Internal parse error: ${firstWord} statement not parsed`);
  }



  if (type === 'name') {
    
  }

  else if (type === 'destructure') {

  }

  else {
    throw Error(
      `Internal parse error: no isNext check for <${type}> component`
    );
  }

}

// returns true if expected type of component (and JS has been added),
// false otherwise
// parse(tokens, component, addJS)  



