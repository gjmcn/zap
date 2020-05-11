// Convert indent blocks to bracket blocks. Exported function returns a new
// array of tokens with no newline or adjBlock tokens - new tokens are added
// as required.

'use strict';

export default tokens => {

  const newTokens = [];
  
  // each element of stack is 'inline' or the indent of the block
  // (the base block is an indent block with indent 0)
  const stack = [0];
  const block = () => stack[stack,length - 1];
  let indent = 0;  // indent of nearest indent block

  function syntaxError(tkn, msg) {
    throw Error(`Zap syntax at ${tkn.line}:${tkn.column + 1}, ${msg}`);
  }

  function addNewToken(type, value, line, column) {
    newTokens.push({type, value, line, column});
  }

  // open new indent block, tkn is the newline token that opens it
  function openIndentBlock(tkn) {
    if (block() === 'inline') throw syntaxError('unclosed inline block');
    addNewToken('openParentheses', '(', tkn.line, tkn.column);
    stack.push(tkn.indent);
    indent = tkn.indent;
  }

  // close current indent block, tkn is the newline token that closes it
  function closeIndentBlock(tkn) {
    if (block() === 'inline') throw syntaxError('unclosed inline block');
    addNewToken('closeBracket', ')', tkn.line, tkn.column);
    stack.pop();
    indent -= 4;
  }

  // iterate over tokens
  for (let i = 0; i < tokens.length; i++) {

    const tkn = tokens[i];
    const {value, type} = tkn;
    
    if (type === 'newline') {

      // line continue - same behavior if newline is empty or contains code
      if (tkn.continue) {

        // throw if invalid indent or new indent block
        if (tkn.indent % 4) syntaxError(tkn, 'invalid indentation');
        if (tkn.indent > indent) syntaxError(tkn, 'invalid line continue');
        
        // close blocks if smaller indent
        if (tkn.indent < indent) {
          const nClose = (indent - tkn.indent) / 4;
          for (let k = 0; k <= nClose; k++) closeIndentBlock(tkn); 
        }

        // do nothing if line continuing at same indent 
      }
      
      // not line continue
      else {

        // next token is newline - so this newline has no code
        if (tkn[i + 1] && tkn[i + 1].type === 'newline') continue;
          
        // throw if invalid indent
        if (tkn.indent % 4 || tkn.indent > indent + 4) {
          syntaxError(tkn, 'invalid indentation');
        }

        // ----- line has valid indent and contains code -----

        // open block if bigger indent
        if (tkn.indent > indent) {
          openIndentBlock(tkn);
        }

        // close blocks if smaller indent
        else if (tkn.indent < indent) {
          const nClose = (indent - tkn.indent) / 4;
          for (let k = 0; k <= nClose; k++) closeIndentBlock(tkn); 
          addNewToken('closeSubexpr', ';' , tkn.line, tkn.column);
        }

        // same indent
        else {
          addNewToken('closeSubexpr', ';' , tkn.line, tkn.column);
        }

      }

    }

    else if (type === 'openParentheses' || type === 'function') {
      stack.push('inline')
      newTokens.push(tkn);
    }

    // close inline block - do not check bracket types, handled in parse.js
    else if (type === 'closeBracket') {   
      if (block() !== 'inline') {
        syntaxError(tkn, 'invalid closing bracket');
      }
      stack.pop();
      newTokens.push(tkn);
    }

    else if (type === 'adjBlock') {
      
      !!HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

      //?????correct to not change indent?
      //?????? can ',' appear anywhere? - needn't be on own line?
      //    -can even have code after it?
      //????? do we need to change stack?
      // should check indent has not changed?
      
      if (block() === 'inline') throw syntaxError('unclosed inline block');
      if (block() === 0) throw syntaxError('cannot close base block');
      addNewToken('closeBracket', ')', tkn.line, tkn.column);
      addNewToken('openParentheses', '(', tkn.line, tkn.column);
    }

    // remember to push all other tokens onto new newTokens

    // check that handle
    //  -initial indent = dome since start at 0 so first indent must be 4?
    //      -what if no indent blocks?
    //  -end of code
    //  -any special cases for first line


  }
  
};