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
  if (Array.isArray(firstTkn) || !firstTkn.opensStatement) {
    syntaxError(
      Array.isArray(firstTkn) ? firstTkn[0] : firstTkn,
      'expected a keyword that starts a new statement'
    );
  }
  const firstWord = firstTkn.value;
  const struc = structures[firstWord];
  parseComponent.keyword(codeComponents, struc[0][0], addJS, true);

  // not keyword-only statement
  if (struc[0].length > 1) {
    
    // resolve branch using second component
    const branch = resolveBranch(codeComponents, struc).slice(1).reverse();  

    // if try statement, need at least one of catch or finally
    if (firstWord === 'try' &&
        !branch.some(stComp => {
          return stComp.type === 'keyword' &&
                (stComp.word === 'catch' || stComp.word === 'finally')
        })) {
      syntaxError(
        firstTkn,
        'try statement must include at least one of catch or finally'
      );
    }

    // parse from second component to end of statement
    while (branch.length) {
      if (codeComponents.length === 0) {
        if (last(branch).optional) {
          branch.length -= last(branch).optional; 
        }
        else {
          syntaxError('end of code', `unfinished ${firstWord} statement`);
        }
      }
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
          if (stComp.ifOmitted) {
            addJS(stComp.ifOmitted);
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

  return firstWord;
}