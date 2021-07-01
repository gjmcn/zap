import { syntaxError } from './syntax-error.js';
import { structures, allFirstWords, simpleFirstWords, blockFirstWords }
  from './statements.js';
import { components } from './components.js';


// tokens: array of tokens that processing (reversed)
// addJS: function to add JavaScript (args: js, line, column)
export function parseStatement(tokens, addJS) {

  let tkn, firstWord, struc, branch;

  function tokenPeek() {
    return tokens[tokens.length - 1];
  }

  function setBranch(i) {
    struc[i].slice(1).reverse();
  }

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

  // second component: resolve branch
  if (struc.length === 1) {
    setBranch(0);
  }
  else if (tkn.value === 'var' || tkn.value === 'fix') {
    setBranch(components.isNext('identifier') ? 0 : 1);
  }
  else if (tkn.value === 'set') {
    setBranch(
      components.isNext('identifier')
        ? 0
        : components.isNext('destructure')
          ? 1
          : 2
      );
  }
  else if (tkn.value === 'export') {
    setBranch(tokenPeek().value === 'default' ? 1 : 0);
  }
  else if (tkn.value === 'import') {
    setBranch(
      tokenPeek().value === 'default'
        ? 0
        : tokenPeek().value === 'all'
          ? 1
          : 2
    );
  }

  // parse from second component to end of statement
  while (branch.length) {
    const comp = branch.pop();
    if (!components.parse(tokens, comp, addJS)) {
      if (comp.optional) {
        if (comp.optional > 1) {
          branch.length = branch.length - comp.optional + 1; 
        }
        if (comp.ifOmitted) {
          addJS(comp.ifOmitted);
        }
        break;
      }
      syntaxError(`invalid ${firstWord} statement, ${comp.type} expected`);
    }
    if (comp.after) {
      addJS(comp.after);
    }
      
    // !!!!!!HERE - DO NOT NEED TO HANDLE BLOCKS EXPLICITLY: when
    //   components.parse  a block component, it will parse the statements in the
    //   block, ...  then return to outer block, ...?

    //   !!!!!!! enforce statement-specific rules such
    //     - allow multiple elifs
    //     - at least catch or finally

  }

