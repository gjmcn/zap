////////////////////////////////////////////////////////////////////////////////
// Parse statement.
////////////////////////////////////////////////////////////////////////////////

import { syntaxError } from './syntax-error.js';
import { structures } from './statements.js';
import { resolveBranch, parseComponent } from './components.js';

// returns first word of statement
export function parseStatement(tokenGroups, addJS) {

  // first component: opening keyword
  const tkn = tokenGroups.pop();
  if (Array.isArray(tkn) || !tkn.opensStatement) {
    syntaxError(tkn, 'expected a keyword that starts a new statement');
  }
  const firstWord = tkn.value;
  const struc = structures[firstWord];
  addJS(`; ${struc[0][0].compile(firstWord)}`, tkn.line, tkn.column);

  // not keyword-only statement
  if (struc.length > 1 || struc[0].length > 1) {

    // resolve using second component
    const branch = resolveBranch(tokenGroups, struc).slice(1).reverse();  

    // parse from second component to end of statement
    while (branch.length) {
      const comp = branch.pop();
      if (parseComponent(tokenGroups, comp, addJS)) {
        if (comp.after) {
          addJS(comp.after);
        }
      }
      else {
        if (comp.optional) {
          if (comp.optional > 1) {
            branch.length = branch.length - comp.optional + 1; 
          }
          if (comp.ifOmitted) {
            addJS(comp.ifOmitted);
          }
          continue;
        }
        syntaxError(tkn, `invalid ${firstWord} statement`);
      }
    }

  }

  return firstWord;
}