// Tokenize a string of Zap code. The exported function returns an array of
// token objects. Comment and same-line space tokens are discarded. 

import reserved from './reserved.js';

const regexps = new Map([
  ['space', /[^\S\r\n]+/y],
  ['comment', /\/\/.*/y],
  ['newline', /\r?\n([^\S\r\n]*)/y],  // includes indent
  ['number', /0[bB][01]+n?|0[oO][0-7]+n?|0[xX][\da-fA-F]+n?|0n|[1-9]\d*n|(?:\.\d+|\d+(?:\.\d*)?)(?:e[+\-]?\d+)?/y],
  ['string', /'[^'\\]*(?:\\.[^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"/y],
  ['regexp', /&\/(?!\/)[^\/\\]*(?:\\.[^\/\\]*)*\/[\w$]*/y],
  ['identifier', /[a-zA-Z_$][\w$,;]*/y],  // includes , and ; properties
  ['function', /[\[{]/y],
  ['openParentheses', /\(/y],  
  ['closeBracket', /[)\]}]/y],
  ['operator', /(`)?([+\-*/%\^?\\=@#<>!]?=|[+\-*/%\^\\!~]|\|\||&&|<[>\-\\~]?|><|>|@{1,2}|#{1,2}|\?{1,2}|[?:]?:)(`)?(?![+\-*%<>=!?\\#@:|\^`~]|\/(?:$|[^/])|&&)/y],
  ['lineCont', /\|/y],
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

  // handle indent on first line as a special case
  const initIndent = regexps.get('space').exec(code);

  // check if string is reserved-command or reserved-invalid
  function commandOrInvalid(s) {
    return reserved.commands.has(s) || reserved.invalid.has(s);
  }

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

        // comment or (same-line non-indent) space - discard token
        if (type === 'comment' || type === 'space') {
          column += match[0].length;
        }

        // line continue - merge with newline token
        else if (type === 'lineCont') {
          const lastToken = tokens[tokens.length - 1];
          if (!lastToken || lastToken.type !== 'newline' ||
              lastToken.lineCont) {
            zapSyntaxError('invalid line continue');
          }
          lastToken.lineCont = true;
          column++;
        }
        
        // add token
        else {
          
          // newline (and indent)
          if (type === 'newline') {
            line++;
            tkn.indent = match[1].length;
            column = tkn.indent;
            tkn.line = line;  // use end of indent for error messages
            tkn.column = column;
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
              if (reserved.commands.has(tkn.value)) {  // command
                tkn.type = 'operator';
              }
              else {
                const parts = tkn.value.split(/(?=[,;])/);
                if (parts.length > 1) {  // property
                  if (commandOrInvalid(parts[0])) {
                    zapSyntaxError('reserved word');
                  }
                  const props = parts.slice(1);
                  for (let p of props) {
                    if (p.length < 2) {
                      zapSyntaxError('missing property name');
                    }
                    if (commandOrInvalid(p.slice(1))) {
                      zapSyntaxError('reserved word');
                    }
                  }
                  tkn.type = 'property';
                  tkn.name = parts[0];
                  tkn.props = props;
                }
                else {  // standard identifier
                  if (tkn.value === 'else') tkn.value = 'true';
                  tkn.name = tkn.value;
                }
              }
            }

            // backticks
            else if (type === 'operator' && (match[1] || match[3])) {
              if (!canBacktick.has(match[2])) {
                zapSyntaxError(`cannot use backtick with ${match[2]}`);
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
    zapSyntaxError(`unrecognized token: ${snippet}`);
  }

  // error if indent on first line - unless it has no code
  if (initIndent && tokens[0] && tokens[0].type !== 'newline') {
    throw Error(
      `Zap syntax at 1:${initIndent[0].length + 1
        }, invalid indent - base block cannot be indented`);
  }

  // include end-of-file line and column numbers with the tokens array
  tokens.lineEnd = line;
  tokens.columnEnd = column;

  return tokens;

};