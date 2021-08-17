////////////////////////////////////////////////////////////////////////////////
// Parse component of statement.
////////////////////////////////////////////////////////////////////////////////

import { syntaxError, last } from './helpers.js';
import { reserved } from './reserved.js';
import { parseExpression } from './parse-expression.js';

// check if code component is of given component type
// (not all component types are included here)
const isComponent = {

  // true if the code component is a single keyword token and its keyword
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

  unreservedNames: codeComp => {
    if (Array.isArray(codeComp) &&
        codeComp.every(tkn => tkn.type === 'identifier')) {
      const resTkn = codeComp.find(tkn => reserved.nonKeywords.has(tkn.value));
      if (resTkn) {
        syntaxError(resTkn, `${resTkn.value} is a reserved word`);
      }
      if ((new Set(codeComp.map(tkn => tkn.value))).size < codeComp.length) {
        syntaxError(codeComp[0], 'duplicate name');
      }
      return true;
    }
  },

  pathLit: codeComp => {
    if (Array.isArray(codeComp) && 
        codeComp.length === 1 &&
        codeComp[0].type === 'string') {
      return true;
    }
  },

  // if a namesAs component, returns the names as an array where each element is
  // a name or an array: [oldName, newName]
  namesAs: codeComp => {
    if (Array.isArray(codeComp)) {
      const names = [];
      let i = 0;
      while (i < codeComp.length) {
        if (codeComp[i].type === 'identifer') {
          if (reserved.nonKeywords.has(codeComp[i].value)) {
            syntaxError(codeComp[i], `${codeComp[i].value} is a reserved word`);
          }
          names.push(codeComp[i].value);
          i++;
        }
        else if (i <= codeComp.length - 5 && 
            codeComp[i].type === 'openParentheses' &&
            codeComp[i + 1].type === 'identifier' &&
            codeComp[i + 2].type === 'identifier' &&
            codeComp[i + 2].value === 'as' &&
            codeComp[i + 3].type === 'identifier' &&
            codeComp[i + 4].type === 'closeParentheses') {
          if (reserved.nonKeywords.has(codeComp[i + 3]).value) {
            syntaxError(
              codeComp[i + 3],
              `${codeComp[i + 3].value} is a reserved word`
            );
          }
          names.push([codeComp[i + 1].value, codeComp[i + 3].value]);
          i += 5;
        }
        else {
          return false;
        }
      }
      const newNames = names.map(nm => Array.isArray(nm) ? nm[1] : nm);
      if ((new Set(newNames)).size < names.length) {
        syntaxError(codeComp[0], 'duplicate name');
      }
      return names;
    }
  }

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
function parseSuccessful(codeComponents, stComp) {
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
        (!openStatement || codeComp.openStatement)) {
      addJS(
        `${openStatement ? '; ' : ''}${stComp.compile(codeComp.value)}`,
        codeComp.line,
        codeComp.column
      );
      return parseSuccessful(codeComponents, stComp);
    }
  },

  unreservedName: (codeComponents, stComp, addJS) => {
    const codeComp = last(codeComponents);
    if (isComponent.unreservedName(codeComp)) {
      const tkn = codeComp[0];
      addJS(stComp.compile(tkn.value), tkn.line, tkn.column);
      return parseSuccessful(codeComponents, stComp);
    }
  },

  unreservedNames: (codeComponents, stComp, addJS) => {
    const codeComp = last(codeComponents);
    if (isComponent.unreservedNames(codeComp)) {
      addJS(
        codeComp.map(tkn => tkn.value).join(),
        codeComp[0].line,
        codeComp[0].column
      );
      return parseSuccessful(codeComponents, stComp);
    }
  },

  pathLit: (codeComponents, stComp, addJS) => {
    const codeComp = last(codeComponents);
    if (isComponent.pathLit(codeComp)) {
      const tkn = codeComp[0];
      addJS(tkn.value, tkn.line, tkn.column);
      return parseSuccessful(codeComponents, stComp);
    }
  },

  namesAs: (codeComponents, stComp, addJS) => {
    const codeComp = last(codeComponents);
    const names = isComponent.namesAs(codeComp);
    if (names) {
      const jsStr = names.map(nm => {
        return Array.isArray(nm) ? `${nm[0]} as ${nm[1]}` : nm;
      }).join();
      addJS(`{${jsStr}}`, codeComp[0].line, codeComp[0].column);
      return parseSuccessful(codeComponents, stComp);
    }
  },

  expression: codeComp => {
    if (Array.isArray(codeComp)) {
      HERE!!!!!!!! pass 
      
      const  parseExpression(codeComp);
    }
  }

  ///// ALSO TO DO //////////////////////
  // - getterExpression
  // - asUnreservedName
  // - unreservedNameDef
  // - nameAsDef
  // - block

};