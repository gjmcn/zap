////////////////////////////////////////////////////////////////////////////////
// Parse component of statement.
////////////////////////////////////////////////////////////////////////////////

function tokenPeek() {
  return tokens[tokens.length - 1];
}

// Resolve branch of statement (struc object) that on
export function resolveBranch(tokens, struc) {

  // only one branch
  if (struc.length === 1) {
    return struc[0];
  }

  // loop over branches until can resolve
  for (let branch of struc) {
    secondComp = branch[1];
    const nextTkn = tokenPeek();
    
    !!!!!!!!!!HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    
    if (secondComp.type === 'name') {
      if (nextTkn.type === 'identifier' && !nextTkn.keyword
      
      
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



