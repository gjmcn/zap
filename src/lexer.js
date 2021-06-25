////////////////////////////////////////////////////////////////////////////////
// Tokenize a string of Zap code. The exported function returns an array of
// token objects. Comment and space (including newline) tokens are discarded.
////////////////////////////////////////////////////////////////////////////////

const operators = new Set([
  '+', '-', '*', '/', '%', '**',
  '~',
  '<>', '><',
  '<', '<=', '>', '>=',
  '==', '!=',
  '!', '?', '&&', '||', '??',
  '->', '=>', '-<', '=<', 
  '>>', '--',
  '.', ':', '::', ',',
  '?.', '?:', '?::', '?,',
  '=', '?=', '+=', '-=', '*=', '/=', '%=', '**='
]);

const regexps = new Map([
  ['space', /[^\S\r\n]+/y],  // same-line whitespace
  ['comment', /(?:\/\/.*|\\\S+)/y],
  ['newline', /\r?\n/y],
  ['number', /0[bB][01]+n?|0[oO][0-7]+n?|0[xX][\da-fA-F]+n?|0n|[1-9]\d*n|\d+(?:\.\d+)?(?:e[+\-]?\d+)?/y],
  ['string', /'[^'\\]*(?:\\.[^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"/y],
  ['regexp', /&\/(?!\/)[^\/\\]*(?:\\.[^\/\\]*)*\/[\w$]*/y],
  ['identifier', /[a-zA-Z_$][\w$]*/y],
  ['openParentheses', /\(/y],  
  ['closeParentheses', /\)/y],  
  ['openSquare', /\[#?/y],
  ['closeSquare', /]/y],  
  ['openCurly', /\{#?/y],
  ['closeCurly', /}/y],
  ['quickFunction', /\|(?!\|)/y],
  ['threeDots', /\.{3}(?!\.)/y],
  ['twoDots', /\.{2}(?!\.)/y],
  ['caret', /\^/y],
  ['operator', /[+\-*/%~<>=!?&|.:,]+/y]
]);

export default code => {
  
  const tokens = [];
  let index = 0;      // position in code
  let line = 1;       // current line
  let column = 0;     // current column

  // zap syntax error
  function zapSyntaxError(msg) {
    throw Error(`Zap syntax at ${line}:${column + 1}, ${msg}`);
  }

  // iterate over code
  codeLoop: while (index < code.length) {

    // iterate over regexps
    for (let [type, reg] of regexps.entries()) {
      
      reg.lastIndex = index;
      const match = reg.exec(code);

      if (match) {

        const tkn = { type, value: match[0], line, column };

        // comment or same-line whitespace: discard token
        if (type === 'comment' || type === 'space') {
          column += match[0].length;
        }
        
        // newline: discard token
        else if (type === 'newline') {
          line++;
          column = 0;
        }

        // add token
        else {

          // (potentially) multiline string
          if (type === 'string' && match[0][0] === '"') {
            let hasNewline;
            tkn.value = tkn.value.replace(/\r?\n/g, () => {
              line++;
              hasNewline = true;
              return '\\n';
            });
            if (hasNewline) {
              column = match[0].length - match[0].lastIndexOf('\n') - 1;
            }
            else {
              column += match[0].length;
            }
          }

          // no other tokens can be multiline
          else {

            // operator symbols: check valid operator  
            if (type === 'operator') {
              if (!operators.has(match[0])) {
                zapSyntaxError(`unrecognized operator: ${match[0]}`);
              }
            }

            column += match[0].length;
          }

          tokens.push(tkn);
        }

        index = reg.lastIndex;
        continue codeLoop;
      }
      
    }

    // throw if unrecognized token
    let snippet = code.slice(index, index + 30);
    if (code.length > index + 30) {
      snippet += ' ...';
    }
    zapSyntaxError(`unrecognized token: ${snippet}`);
  }
  
  // add endOfCode token
  tokens.push({
    type: 'endOfCode',
    value: '(end of code)',
    line,
    column
  })

  return tokens;

};