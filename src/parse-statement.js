////////////////////////////////////////////////////////////////////////////////
// Parse statement.
////////////////////////////////////////////////////////////////////////////////

import reserved from './reserved.js';
import { statements, simpleStarts, allStarts } from './statements.js';
import { resolveBranch, parseComponent } from './components.js';
import { syntaxError } from './helpers.js';

// Decide if at start of new statement. Returns false or an object:
//  - word: string, keyword or space-separated string of keywords
//  - tokens: array containing the corresponding keyword tokens
// Mutations (only if at start of a statement):
//  - removes returned keyword tokens from end of codeComponents
//  - sets _lastStart property of codeComponents
function isNewStatement(codeComponents) {

  const lastComp = codeComponents.at(-1);
  const tokens = [lastComp];
  let word;

  // non-keyword or "end" keyword
  if (Array.isArray(lastComp) || lastComp.value === 'end') {
    return false;
  }
  
  // comma
  if (lastComp.value === ',') {
    if (!simpleStarts.has(codeComponents._lastStart) ||
        !Array.isArray(codeComponents.at(-2))) {
      syntaxError(lastComp, 'invalid comma');
    }
    codeComponents.pop();
    return { word: codeComponents._lastStart, tokens };
  }

  // add any additional keywords
  for (let i = 2; i <= codeComponents.length; i++) {
    const comp = codeComponents.at(-i);
    if (Array.isArray(comp) || comp.value === 'end') {
      break;
    }
    tokens.push(comp);
  }

  // single keyword - may or may not be start of statement
  if (tokens.length === 1) {  
    word = lastComp.value;
    if (!allStarts.has(word)) {
      return false;
    }
    codeComponents.pop();
  }

  // multiple keywords - must be start of statement
  else {
    word = tokens.map(t => t.value).join(' ');
    if (!allStarts.has(word)) {
      syntaxError(lastComp, 'invalid combination of keywords');
    }
    codeComponents.length -= tokens.length;
  }
  
  codeComponents._lastStart = word;
  return { word, tokens };

}

// !!! DONE TO HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!



// returns first word of statement
export function parseStatement(codeComponents, addJS) {

  // first component: keyword that opens statement
  const firstTkn = last(codeComponents);
  if (Array.isArray(codeComp)) {
    syntaxError(firstTkn[0], 'keyword expected');
  }
  const firstWord = firstTkn.value;
  const struc = structures[firstWord];
  if (!parseComponent.openingKeyword(codeComponents, struc[0][0], addJS)) {
    syntaxError(firstTkn, 'expected a keyword that starts a new statement');
  }



!! IF HAVE AN INSERT IN AN OPTIONAL (ONLY ELSE IF?) JUST SKIP AS IF SEEN?

!! ALWAYS NEED TO KNOW PARENT BLOCK TYPE SO KNOW IF IN CLASS OR NOT - SINCE CAN
ONLY METHOD AND FIELD STATEMENTS IN CLASSES, AND USE ANYTHING ELSE IN OTHER
NON-CLASS
  -- ALSO NO SEMICOLONS AFTER STATEMENTS IN CLASS BLOCK

-- ifOmitted and insert components are always updateStrings now, never functions

  // not keyword-only statement
  if (struc[0].length > 1) {
    
    // resolve branch using second component
    const branch = resolveBranch(codeComponents, struc).slice(1).reverse();  

    // parse from second component to end of statement
    while (branch.length > 0) {

      // no code left to parse
      if (codeComponents.length === 0) {
        const stComp = last(branch);
        if (stComp.optional) {
          branch.length -= stComp.optional;
          const { ifOmitted } = stComp;
          if (ifOmitted) {
            addJS(typeof ifOmitted === 'function' ? ifOmitted() : ifOmitted);
          }
        }
        else {
          syntaxError('end of code', `unfinished ${firstWord} statement`);
        }
      }

      // there is code to parse
      else {
        const stComp = branch.pop();
        if (parseComponent[stComp.type](codeComponents, stComp, addJS)) {
          if (stComp.repeat) {
            const j = -(stComp.optional - 1) || Infinity;
            branch.splice(j, 0, ...branch.slice(j), stComp);
          } 
        }
        else {  
          if (stComp.optional) {
            branch.length -= stComp.optional - 1;
            const { ifOmitted } = stComp;
            if (ifOmitted) {
              addJS(typeof ifOmitted === 'function' ? ifOmitted() : ifOmitted);
            }
            continue;
          }
          syntaxError(
            firstTkn,
            `invalid ${firstWord} statement (expected <${stComp.type}>)`
          );
        }
      }
      
    }

  }

  return firstWord;
}