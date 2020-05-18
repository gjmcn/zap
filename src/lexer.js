// Tokenize a string of Zap code. Exported function returns an array of token
// objects. Comment and same-line space tokens are discarded. 

import reserved from './reserved.js';

const regexps = new Map([
  ['space', /[^\S\r\n]+/y],
  ['comment', /\/\/.*/y],
  ['newline', /\r?\n([^\S\r\n])?(,|\|(?!\|))?/y],
  ['number', /0[bB][01]+n?|0[oO][0-7]+n?|0[xX][\da-fA-F]+n?|0n|[1-9]\d*n|(?:\.\d+|\d+(?:\.\d*)?)(?:e[+\-]?\d+)?/y],
  ['string', /'[^'\\]*(?:\\.[^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"/y],
  ['regexp', /&\/(?!\/)[^\/\\]*(?:\\.[^\/\\]*)*\/[\w$]*/y],
  ['identifier', /[a-zA-Z_$][\w$]*/y],
  ['function', /[\[{]/y],
  ['openParentheses', /\(/y],  
  ['closeBracket', /[)\]}]/y],
  ['closeSubexpr', /;/y],
  ['operator', /(`)?([+\-*/%\^?\\=@#<>!]?=|->|[+\-*/%\^\\!~]|<\\|\|\||&&|<[>\-]?|><|>|@{1,2}|#{1,2}|\?{1,2}|[=?]?:)(`)?(?![+\-*%<>=!?\\#@:\|\^`~]|\/(?:$|[^/])|&&)/y]
]);

const canBacktick = new Set([
  '+', '-', '*', '/', '%', '^', '&&', '||', '??',
  '<', '<=', '>', '>=', '==', '!=', '<>', '><'
]);

export default code => {
  
  const tokens = [];
  let index = 0;   // position in code
  let line = 1;    // current line
  let column = 0;  // current column
  let indentCharsValid = true;

  // handle indent of first line as a special case (new line tokens include
  // indent for all other lines)
  const initIndent = regexps.get('space').exec(code);

  // iterate over code
  codeLoop: while (index < code.length) {

    // iterate over regexps
    for (let [type, reg] of regexps.entries()) {
      
      reg.lastIndex = index;
      const match = reg.exec(code);

      if (match) {

        const tkn = { type, value: match[0], line, column };

        // comment or (same-line non-indent) space - discard token
        if (type === 'comment' || type === 'space') {
          column += match[0].length;
        }
        
        // add token
        else {
          
          // newline (and indent and line continue or close-open)
          if (type === 'newline') {
            line++;
            if (match[1]) {
              indentCharsValid = !/[^ ]/.test(match[1]);
              tkn.indent = match[1].length;
            }
            else {
              indentCharsValid = true;
              tkn.indent = 0;
            }
            column = tkn.indent;
            if (match[2]) {
              tkn[match[2] === ',' ? 'closeOpen' : 'continue'] = true;
              column++;
            }
            tkn.line = line;  //use end of token for error messages
            tkn.column = column;
          }

          else if (!indentCharsValid) {
            throw Error(`Zap syntax at ${line}:${
              column + 1}, non-space indent character`);
          }

          // (potentially) multiline string
          else if (type === 'string' && match[0][0] === '"') {
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

            // identifier
            if (type === 'identifier') {
              if (reserved.commands.has(tkn.value)) {              
                tkn.type = 'operator';
              }
              else {
                tkn.name = tkn.value;
              }
            }

            // backticks
            else if (type === 'operator' && (match[1] || match[3])) {
              if (!canBacktick.has(match[2])) {
                throw Error(`Zap syntax at ${line}:${
                  column + 1}, cannot use backtick with ${match[2]}`);
              }
              tkn.value = match[2];
              if (match[1]) tkn.preTick = true;
              if (match[3]) tkn.postTick = true;
            }

            // function
            else if (type === 'function') {
              tkn.oneLiner = true;
              if (match[0] === '{') tkn.arrow = true;
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
    if (code.length > index + 30) snippet += ' ...';
    throw Error(`Zap syntax at ${line}:${
      column + 1}, unrecognized or unexpected token: ${snippet}`);
  }

  // error if indent on first line - unless it has no code
  if (initIndent && tokens[0] && tokens[0].type !== 'newline') {
    throw Error(
      `Zap syntax at 1:${initIndent[0].length + 1}, invalid indent`);
  }

  return tokens;
};