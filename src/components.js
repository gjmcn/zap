////////////////////////////////////////////////////////////////////////////////
// Parse component of statement.
////////////////////////////////////////////////////////////////////////////////

import { reserved } from './reserved.js';
import { syntaxError } from './syntax-error.js';

// last element of array
function last(arr) {
  return arr[arr.length - 1];
}

// check if any tokens in array are reserved non-keywords
function containsReservedWord(arr) {
  return arr.some(elm => reserved.nonKeywords.has(elm.value));
}

// check if tknGrp is given component type
const isComponent = {

  reservedName: tknGrp => {
    if (Array.isArray(tknGrp) && 
        tknGrp.length === 1 &&
        tknGrp[0].type === 'identifier') {
      if (containsReservedWord(tknGrp)) {
        syntaxError(tknGrp[0], `${tknGrp[0].value} is a reserved word`);
      }
      return true;
    }
  },

  // checks is given keyword
  keyword: (tknGrp, kw) => {
    return !Array.isArray(tknGrp) && tknGrp.value === kw;
  }

};

// Resolve branch of statement that on
export function resolveBranch(tokenGroups, struc) {

  // only one branch
  if (struc.length === 1) {
    return struc[0];
  }

  // loop over branches until can resolve
  for (let i = 0, n = struc.length - 1; i < n; i++) {
    const branch = struc[i];
    const secondComp = branch[1]; 
    if (isComponent[secondComp.type](last(tokenGroups), secondComp?.word)) {
      return branch;
    }
  }
  return last(struc);

}


// returns true if expected type of component (and JS has been added),
// false otherwise
// parse(tokens, component, addJS)  



