////////////////////////////////////////////////////////////////////////////////
// Parse statement.
////////////////////////////////////////////////////////////////////////////////

import { syntaxError } from './syntax-error.js';
import { structures } from './statements.js';
import { resolveBranch, parseComponent } from './components.js';

// tokens: array of tokens (reversed)
// addJS: function to add JavaScript (parameters: js, line, column)
// returns first word of statement
export function parseStatement(tokens, addJS) {

  // first component: opening keyword
  const tkn = tokens.pop();
  if (Array.isArray(tkn) || !tkn.opensStatement) {
    syntaxError(tkn, 'expected a keyword that starts a new statement');
  }
  const firstWord = tkn.value;
  const struc = structures[firstWord];
  addJS(`; ${struc[0][0].compile(firstWord)}`, tkn.line, tkn.column);

  // keyword-only statements
  if (firstWord === 'debugger' ||
      firstWord === 'break' ||
      firstWord === 'continue') {
    return; 
  }

  // resolve using second component
  const branch = struc[resolveBranch(tokens, struc)].slice(1).reverse();  

  // parse from second component to end of statement
  while (branch.length) {
    const comp = branch.pop();
    if (parseComponent(tokens, comp, addJS)) {
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

  return firstWord;
}