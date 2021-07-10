////////////////////////////////////////////////////////////////////////////////
// Parse component of statement.
////////////////////////////////////////////////////////////////////////////////

import { syntaxError, last } from './helpers.js';
import { reserved } from './reserved.js';

// check if code component is of given component type
const isComponent = {

  // check the code component is a single keyword token and that its keyword
  // matches the keyword(s) of the statement component
  keyword: (codeComp, stComp) => {
    return !Array.isArray(codeComp) &&
      codeComp.type === 'keyword' &&
      (typeof stComp.word === 'string'
        ? codeComp.value === stComp.word
        : stComp.word.has(codeComp.value)
      );
  },

  unreservedName: codeComp => {
    if (Array.isArray(codeComp) && 
        codeComp.length === 1 &&
        codeComp[0].type === 'identifier') {
      const tkn = codeComp[0];
      if (reserved.nonKeywords.has(tkn.value)) {
        syntaxError(tkn, `${tkn.value} is a reserved word`);
      }
      return true;
    }
  },



};

// resolve branch of statement
export function resolveBranch(codeComponents, struc) {
  if (struc.length === 1) {
    return struc[0];
  }
  for (let i = 0, n = struc.length - 1; i < n; i++) {
    const branch = struc[i];
    const stComp = branch[1];
    if (codeComponents.length === 0) {
      syntaxError('end of code', 'unfinished statement');
    }
    if (isComponent[stComp.type](last(codeComponents), stComp)) {
      return branch;
    }
  }
  return last(struc);
}

// common actions after successfully parsing a component 
function successfullyParsed(codeComponents, stComp) {
  codeComponents.pop();
  if (stComp.after) {
    addJS(stComp.after);
  }
  return true;
}

// Parse component and add JS. Each function returns true if the code component
// is of the type expected by the statement.
export const parseComponent = {
  
  keyword: (codeComponents, stComp, addJS, openStatement) => {
    const codeComp = last(codeComponents);
    if (isComponent.keyword(codeComp, stComp) &&
        (!openStatement || codeComp.opensStatement)) {
      addJS(
        `${openStatement ? '; ' : ''}${stComp.compile(codeComp.value)}`,
        codeComp.line,
        codeComp.column
      );
      return successfullyParsed(codeComponents, stComp);
    }
  },

  unreservedName: (codeComponents, stComp, addJS) => {
    const codeComp = last(codeComponents);
    if (isComponent.unreservedName(codeComp)) {
      const tkn = codeComp[0];
      addJS(stComp.compile(tkn.value), tkn.line, tkn.column);
      return successfullyParsed(codeComponents, stComp);
    }
  }

  // !!!!!!! HERE: add new isComponents and parseComponents functions




};



