// Tokenize a string of Zap code.

'use strict';

import reserved from './reserved.js';

const regexps = new Map([
  ['space', /[^\S\r\n]+/y],
  ['comment', /\/\/.*/y],
  ['newline', /\r?\n/y],
  ['number', /0[bB][01]+n?|0[oO][0-7]+n?|0[xX][\da-fA-F]+n?|0n|[1-9]\d*n|(?:\.\d+|\d+(?:\.\d*)?)(?:e[+\-]?\d+)?/y],
  ['string', /'[^'\\]*(?:\\.[^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"/y],
  ['regexp', /&\/(?!\/)[^\/\\]*(?:\\.[^\/\\]*)*\/[\w$]*/y],
  ['identifier', /[a-zA-Z_$][\w$]*/y],
  ['openParentheses', /\(/y],
  ['function', /[[{](?:\*\*)?/y], 
  ['closeBracket', /[)\]}]/y],
  ['closeSubexpr', /;/y],
  ['spreadOrRest', /\.{3}/y],
  ['arrow', /[\-=]>/y],
  ['operator', /(`)?([+\-*/%\^?\\=]?[=:]|[@#<>!]=|[+\-*/%\^\\!~]|[|<]?\||<\\|&&|<>?|><|>{1,3}|@{1,2}|#{1,2}|\?[?|]?|::)(`)?(?![+\-*%<>=!?\\#@:\|~\^`]|\/(?:$|[^/])|&&)/y]
]);

// returns an array of tokens (objects) from a string of Zap code
export default code => {
  
  const tokens = [];
  let index = 0;   // position in code
  let line = 1;    // current line
  let column = 0;  // current column

  const canBacktick = new Set ([
    '+', '-', '*', '/', '%', '^', '&&', '||', '??',
    '<', '<=', '>', '>=', '==', '!=', '<>', '><'
  ]);

  // iterate over code
  codeLoop: while (index < code.length) {

    // iterate over regexps
    for (let [type, reg] of regexps.entries()) {
      reg.lastIndex = index;
      const match = reg.exec(code);
      if (match) {

        // newline
        if (type === 'newline') {
          line++;
          column = 0;
        }

        // comment or space
        else if (type === 'comment' || type === 'space') {
          column += match[0].length;
        }

        // add token
        else {

          const tkn = { type, value: match[0], line, column };

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

            // command: change type from 'identifier' to 'operator'
            if (type === 'identifier' && reserved.commands.has(tkn.value)) {              
              tkn.type = 'operator';
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
      column + 1}, unrecognized token: ${snippet}`);
  }

  return tokens;
};