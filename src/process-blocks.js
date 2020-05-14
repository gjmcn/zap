// Convert all blocks to bracket blocks. Exported function returns a new array
// of token objects with no newline tokens - new tokens are added as required.

export default tokens => {

  const inline = Symbol('inline');
  const newTokens = [];

  // each element of stack is the inline symbol (parentheses, one-liner
  // function or get property block) or the indent of an indent block (the base
  // block is an indent block with indent 0)
  const stack = [0];
  const block = () => stack[stack.length - 1];
  let indent = 0;  // current indent (i.e. indent of most recent indent block)


  // ===== helper functions ===============================

  function syntaxError(tkn, msg) {
    throw Error(`Zap syntax at ${tkn.line}:${tkn.column + 1}, ${msg}`);
  }

  function checkInlineNotOpen(tkn) {
    if (block() === inline) throw syntaxError(tkn, 'unclosed brackets');
  }

  function addNewToken(type, value, line, column) {
    newTokens.push({type, value, line, column});
  }

  // open new indent block, tkn is the newline token that opens it
  function openIndentBlock(tkn) {
    checkInlineNotOpen(tkn);
    addNewToken('openParentheses', '(', tkn.line, tkn.column);
    stack.push(tkn.indent);
    indent = tkn.indent;
  }

  // close indent block, tkn is the newline token that closes it
  function closeIndentBlock(tkn) {
    checkInlineNotOpen(tkn);
    addNewToken('closeBracket', ')', tkn.line, tkn.column);
    stack.pop();
    indent -= 4;
  }


  // ===== iterate over tokens ============================

  for (let i = 0; i < tokens.length; i++) {

    const tkn = tokens[i];
    const {type} = tkn;
    
    if (type === 'newline') {

      // line continue - same behavior if newline is empty or contains code
      if (tkn.continue) {

        // do nothing if same indent
        if (tkn.indent === indent) continue;

        // throw if invalid indent
        if (tkn.indent % 4 || tkn.indent > indent + 4) {
          syntaxError(tkn, 'invalid indent');
        }

        // open block if bigger indent
        if (tkn.indent > indent) {
          openIndentBlock(tkn);
        }
        
        // close block(s) if smaller indent
        else if (tkn.indent < indent) {
          const nClose = (indent - tkn.indent) / 4;
          for (let k = 0; k < nClose; k++) closeIndentBlock(tkn); 
        }

      }
      
      // close-open indent block
      else if (tkn.closeOpen) {
        
        // indent must not change
        if (tkn.indent !== indent) syntaxError(tkn, 'invalid indent');
        
        // cannot close base block
        if (indent === 0) syntaxError(tkn, 'cannot close base block');
        
        // comma must be on a line of its own
        if (tkn[i + 1] && tkn[i + 1].type !== 'newline') {
          syntaxError(tkn, 'comma must be on a line of its own');
        }
        
        closeIndentBlock();
        openIndentBlock();
      
      }

      // neither line continue nor close-open
      else {

        // next token is newline - so this newline has no code
        if (tkn[i + 1] && tkn[i + 1].type === 'newline') continue;
          
        // throw if invalid indent
        if (tkn.indent % 4 || tkn.indent > indent + 4) {
          syntaxError(tkn, 'invalid indent');
        }

        // open block if bigger indent
        if (tkn.indent > indent) {
          openIndentBlock(tkn);
        }

        // close block(s) if smaller indent
        else if (tkn.indent < indent) {
          const nClose = (indent - tkn.indent) / 4;
          for (let k = 0; k < nClose; k++) closeIndentBlock(tkn); 
          addNewToken('closeSubexpr', ';' , tkn.line, tkn.column);
        }

        // same indent
        else {
          checkInlineNotOpen(tkn);
          addNewToken('closeSubexpr', ';' , tkn.line, tkn.column);
        }

      }

    }

    // non-newline token
    else {
    
      // open inline block
      if (type === 'openOneLiner' || 
          type === 'openParentheses' ||
          type === 'getProperty') {
        stack.push(inline);
      }

      // close inline block
      else if (type === 'closeBracket') {   
        if (block() !== inline) syntaxError(tkn, 'invalid closing bracket');
        stack.pop();
      }

      newTokens.push(tkn);

    }

  }


  // ===== end of code: close any open indent blocks ======
  
  while (stack.length > 1) closeIndentBlock();
  addNewToken('closeSubexpr', ';' , tkn.line, tkn.column);

};