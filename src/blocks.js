// Convert all blocks to bracket blocks. The exported function returns a new
// array of token objects with no newline tokens.
//
// The exported function validates the block structure:
//  - inline blocks do not span multiple lines
//  - opening and closing brackets match
//  - indents are valid

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
      syntaxError(tkn, 'unclosed brackets');
    }
  }

  // open new indent block, tkn is the newline token that opens it
  function openIndentBlock(tkn) {
    checkInlineNotOpen(tkn);
    addNewToken('openParentheses', '(open indent)', tkn.line, tkn.column);
    stack.push(tkn.indent);
    indent = tkn.indent;
  }

  // close indent block, tkn is the newline token that closes it
  function closeIndentBlock(tkn) {
    checkInlineNotOpen(tkn);
    addNewToken('closeBracket', '(close indent)', tkn.line, tkn.column);
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
        if (/[^\r\n ]/.test(tkn.value)) {
          syntaxError(tkn, 'invalid indent - only spaces are allowed');
        }

        // indent not a multiple of 4?
        if (tkn.indent % 4) {
          syntaxError(tkn, 'invalid indent - must be a multiple of 4 spaces');
        }

        // indent increased by more than one block?
        if (tkn.indent > indent + 4) {
          syntaxError(tkn, 'invalid indent - increase of more than 1 block');
        }

      }

      // line continue
      if (tkn.lineCont) {
        
        // increased indent or at start of file? - throw since do not allow
        // line continue at start of block
        if (tkn.indent > indent || newTokens.length === 0) {
          syntaxError(tkn, 'invalid line continue');
        }

        // decreased indent? - close block(s)
        if (tkn.indent < indent) {
          const nClose = (indent - tkn.indent) / 4;
          for (let k = 0; k < nClose; k++) closeIndentBlock(tkn);
        }

        // do nothing if same indent and not at start of file 

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
  
  const endOfCodeToken = {
    type: 'endOfCode',
    value: '(end of code)',
    line: tokens.lineEnd,
    column: tokens.columnEnd
  };
  while (stack.length > 1) closeIndentBlock(endOfCodeToken);

  return newTokens;

};