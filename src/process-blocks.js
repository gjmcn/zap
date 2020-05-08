// Convert indented blocks to bracketed blocks. Exported function returns a
// new array of tokens with no newline or adjBlock tokens - new tokens are
// added as required.

'use strict';

export default tokens => {

  const newTokens = [];
  
  // each element of stack will be an object representing an inline or indent
  // block. Properties:
  //    indent: bool, true if inline block
  //    close: ')', ']' or '}' 
  //    line: line of block (inline blocks only)
  //    indent: indent of block (indent blocks only)
  const stack = [];
  let block = null;
  let indent = 0;

  function syntaxError(tkn, msg) {
    throw Error(`Zap syntax at ${tkn.line}:${tkn.column + 1}, ${msg}`);
  }

  // iterate over tokens
  for (let i = 0; i < tokens.length; i++) {

    const tkn = tokens[i];
    const {value, type} = tkn;
    
    if (type === 'newline') {

      // next token is newline: this line is empty, do nothing - regardless
      // of indent and line-continue
      if (tkn[i + 1] && tkn[i + 1].type === 'newline') {
        continue;

        !!!!!!!!! will not skip if token include function brackets?


      }

      // open new block
      else if (tkn.indent - indent === 4) {
        
        if (block && !block.indent) {
          syntaxError(tkn, 'unclosed inline block');
        }
        if (tkn.continue) {
          syntaxError(tkn, 'line continue in new indent block');
        }

        block = {
          type: indent;

        }
        stack.push(block);
        indent = block.indent;
        

    
    }


    else if (type === 'openParentheses') {
    }

    else if (type === 'function') {
    }

    else if (type === 'closeBracket') {
    }

    else if (type === 'adjBlock') {
    }


  }
  
};