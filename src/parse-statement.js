////////////////////////////////////////////////////////////////////////////////
// Parse statement.
////////////////////////////////////////////////////////////////////////////////

import { structures } from './statements.js';
import { resolveBranch, parseComponent } from './components.js';
import { syntaxError, last } from './helpers.js';

// returns first word of statement
export function parseStatement(codeComponents, addJS) {

  // first component: keyword that opens statement
  const firstTkn = last(codeComponents);
  if (Array.isArray(codeComp)) {
    syntaxError(firstTkn[0], 'expected a keyword that starts a new statement');
  }
  const firstWord = firstTkn.value;
  const struc = structures[firstWord];
  if (!parseComponent.openingKeyword(codeComponents, struc[0][0], addJS)) {
    syntaxError(firstTkn, 'expected a keyword that starts a new statement');
  }

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