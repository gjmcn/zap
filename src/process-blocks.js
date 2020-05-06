// Convert indented blocks to bracketed blocks.
// Exported function removes indent, newline and adjBlock
// tokens, and adds closeBracket and closeSubexpr tokens.

'use strict';

export default tokens => {

  const blocks = [];  //!! IN EACH BLOCK, DO WE NEED TO KNOW IF CURRENT SUBEXPR ALREADY CONTINUED? - NO SINCE CAN CONT IT WITHER WAY?
  const indent = 0;
  const blockCode = false;  // all indent-blocks must contain code

  function syntaxError(tkn, msg) {
    throw Error(`Zap syntax at ${tkn.line}:${tkn.column + 1}, ${msg}`);
  };

  // iterate over tokens
  for (let i = 0; i < tokens.length; i++) {

    const tkn = tokens[i];
    const {value, type} = tkn;
    
    if (type === 'indent') {

      const newIndent = value.length;
      
      // open block
      if (newIndent === indent + 4) {

      }

      // continue subexpression
      else if (newIndent === indent + 2) {
        //  ONLY ALLOW IF NOT ALREADY CONTINUING SUBEXPR
      }

      // new subexpr or continuing an already-continued subexpr
      else if (newIndent === indent) {

      }
      
      // decreasing indent
      else if (newIndent < indent)
      
      }

      else {
        syntaxError(tkn, 'invalid indent');
      }
            

      indent = value.length;
    
    }

    else if (type === 'newline') {
    }

    else if (type === 'openParentheses') {
    }

    else if (type === 'function') {
    }

    else if (type === 'closeBracket') {
    }

    else {
      blockCode = true;
    }


    
  }
  
};

/*
- do we need to consider closeSubexpr tokens? - any other tokens?
- make sure closing subepressions for all blocks that close



*/