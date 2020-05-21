// Convert all blocks to bracket blocks. The exported function returns a new
// array of token objects with no newline tokens - new tokens are added as
// required.
//
// The exported function validates the block structure:
//  - inline blocks do not span multiple lines (unless lines are continued)
//  - opening and closing brackets match; no extra/missing closing brackets
//  - indents are valid
//  - cannot use close-open comma at base level
//  - close-open comma must be on aline of its own
//  - (does not check that blocks are non-empty)

export default tokens => {

  const closingBrackets = { '(': ')', '[': ']', '{': '}' };
  const newTokens = [];

  // each element of stack is '(', '[' or '{', or is the indent of an indent
  // block (the base block is an indent block with indent 0)
  const stack = [0];
  const block = () => stack[stack.length - 1];
  let indent = 0;  // current indent (i.e. indent of most local indent block)


  // ===== helper functions ===============================

  function syntaxError(tkn, msg) {
    throw Error(`Zap syntax at ${tkn.line}:${tkn.column + 1}, ${msg}`);
  }

  function addNewToken(type, value, line, column) {
    newTokens.push({type, value, line, column});
  }
 
  // throw if inline block open
  function checkInlineNotOpen(tkn) {
    if (typeof block() !== 'number') {
      throw syntaxError(tkn, 'unclosed brackets');
    }
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

      const codeOnLine = tokens[i + 1] && tokens[i + 1].type !== 'newline';

      // check indent is valid if line is not empty
      if (tkn.lineCont || codeOnLine) {
       
        // invalid characters in indent?
        if (!/[^\r\n ]/.test(tkn.value)) {
          syntaxError(tkn, 'invalid indent - only spaces allowed');
        }

        // indent must be a multiple of 4?
        if (tkn.indent % 4) {
          syntaxError(tkn, 'invalid indent - not a multiple of 4');
        }

        // indent increased by more than one level?
        if (tkn.indent > indent + 4) {
          syntaxError(tkn,
            'invalid indent - indent increased by more than 1 level');
        }

      }

      // line continue - same behavior if newline is empty or contains code
      if (tkn.lineCont) {
        
        // decreased indent? - close block(s)
        if (tkn.indent < indent) {
          const nClose = (indent - tkn.indent) / 4;
          for (let k = 0; k < nClose; k++) closeIndentBlock(tkn);
        }

        // increased indent or at start of file? - throw since do not allow line
        // continue at start of block
        else if (tkn.indent > indent || newTokens.length === 0) {
          syntaxError(tkn, 'invalid line continue');
        }

      }
      
      // normal newline - no line continue
      else {

        // no code on the newline? - do nothing
        if (!codeOnLine) continue;

        // increased indent? - open block as long as not at start of file
        if (tkn.indent > indent) {
          if (newTokens.length === 0) {
            syntaxError(tkn, 'invalid indent - base block cannot be indented');
          }
          openIndentBlock(tkn);
        }

        // decreased indent? - close block(s) and subexpression
        else if (tkn.indent < indent) {
          const nClose = (indent - tkn.indent) / 4;
          for (let k = 0; k < nClose; k++) closeIndentBlock(tkn); 
          addNewToken(
            'closeSubexpr', '(close subexpression)', tkn.line, tkn.column);
        }

        // same indent - close subexpression unless at start of file
        else {
          checkInlineNotOpen(tkn);
          if (newTokens.length) {
            addNewToken(
              'closeSubexpr', '(close subexpression)', tkn.line, tkn.column);
          }
        }

      }

    }

    // all other tokens
    else {
    
      // open inline block
      if (type === 'function' || type === 'openParentheses') {
        stack.push(tkn.value);
      }

      // close inline block
      else if (type === 'closeBracket') {
        if (closingBrackets[block()] !== tkn.value) {
          syntaxError(tkn, 'bracket mismatch');
        }
        stack.pop();
      }

      newTokens.push(tkn);

    }

  }


  // ===== end of code: close open indent blocks ==========
  
  while (stack.length > 1) closeIndentBlock();

};