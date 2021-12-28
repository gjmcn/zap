////////////////////////////////////////////////////////////////////////////////
// Tokenize a string of Zap code. The exported function returns an array of
// 'components': each component is a keyword token, comma token, or an array of
// non-keyword-non-comma tokens. Comment and space (including newline) tokens
// are discarded.
////////////////////////////////////////////////////////////////////////////////

import { operatorDetails } from "./operators.js";
import { reserved } from "./reserved.js";

const regexps = new Map([
  ['space', /[^\S\r\n]+/y],  // same-line whitespace
  ['comment', /#.*/y],
  ['newline', /\r?\n/y],
  ['number', /0[bB][01]+n?|0[oO][0-7]+n?|0[xX][\da-fA-F]+n?|0n|[1-9]\d*n|\d+(?:\.\d+)?(?:e[+\-]?\d+)?/y],
  ['string', /'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"/y],
  ['regexp', /\\((?!\/)[^\/\\]*(?:\\.[^\/\\]*)*\/[\w$]*)/y],
  ['identifier', /[a-zA-Z_$][\w$]*/y],
  ['atVariable', /@[a-zA-Z_$][\w$]*/y],
  ['openBracket', /[({[]/y],
  ['closeBracket', /[)}\]]/y],
  ['bar', /\|/y],
  ['ampersand', /&/y],
  ['comma', /,/y],
  ['symbolOperator', /[+\-*/%~<>=?.:^]+/y]
]);

export function lexer(code) {
  
  const components = [];
  let group = null;  // contiguous non-keyword-non-comma tokens
  let index = 0;     // position in code
  let line = 1;      // current line
  let column = 0;    // current column

  // syntax error functions
  function lexerError(msg) {
    throw Error(`Zap syntax at ${line}:${column + 1}, ${msg}`);
  }
  function assertVariableName(name) {
    if (reserved.allWords.has(name) &&
        !reserved.special.has(name)) {
      lexerError(`@-prefix with reserved word: @${name}`);
    }
  }


  // iterate over code
  codeLoop: while (index < code.length) {

    // iterate over regexps
    for (let [type, reg] of regexps) {
      
      reg.lastIndex = index;
      const match = reg.exec(code);

      if (match) {

        const tkn = {
          type,
          value: match[0],
          line,
          column,
          $$$zapToken$$$: true
        };
        
        // comma or keyword
        if (type === 'comma' ||
            (type === 'identifier' && reserved.keywords.has(match[0]))) {
          if (type !== 'comma') {
            tkn.type = 'keyword';
          }
          column += match[0].length;
          if (group?.length) {
            components.push(group);
            group = null;
          }
          components.push(tkn);
        }

        // not keyword or comma
        else {

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

            // string
            if (type === 'string') {
              let hasNewline;
              const quote = match[0][0];
              if (quote === "'") {
                tkn.value = tkn.value.replace(/\r?\n/g, () => {
                  line++;
                  hasNewline = true;
                  return '\\n';
                });
              }
              else {
                tkn.value =
                  tkn.value.replace(/[^\S\r\n]*(?:\r?\n[^\S\r\n]*)+/g, s => {
                    line += s.match(/\n/g).length;
                    hasNewline = true;
                    return ' ';
                  });
              }
              if (hasNewline) {
                column = match[0].length - match[0].lastIndexOf('\n') - 1;
              }
              else {
                column += match[0].length;
              }
              let interpString;
              tkn.value = tkn.value.replace(
                  /(\\?@)([a-zA-Z_$][\w$]*)(\.[a-zA-Z_$][\w$]*|:\d+)*/g,
                  (matchedSubstr, atSymbol, variableName, ...otherArgs) => {
                if (atSymbol.length === 2) {
                  return matchedSubstr;
                }
                interpString = true;
                assertVariableName(variableName);
                let s = `${quote} + ${variableName}`;
                for (let p of otherArgs.slice(0, -3)) {
                  s += p[0] === '.' ? `['${p.slice(1)}']` : `[${p.slice(1)}]`;
                }
                return `${s} + ${quote}`;
              });
              if (interpString) {
                tkn.value = `(${tkn.value})`;
              }
            }

            // no other tokens can be multiline
            else {

              // word operator
              if (type === 'identifier') {
                if (reserved.operators.has(match[0])) {
                  tkn.type = 'operator';
                }
              }

              // atVariable
              else if (type === 'atVariable') {
                tkn.value = match[0].slice(1);
                assertVariableName(tkn.value);
              }

              // symbol operator
              else if (type === 'symbolOperator') {
                if (!operatorDetails[match[0]]) {
                  lexerError(`unrecognized operator: ${match[0]}`);
                }
              }

              // regex
              else if (type === 'regexp') {
                tkn.value = `/${match[1]}`;
              }

              column += match[0].length;

            }

            // push token to group
            if (!group) {
              group = [];
            }
            group.push(tkn);

          }
        
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
    lexerError(`unrecognized token: ${snippet}`);

  }

  // possibly an open group of non-keyword tokens
  if (group?.length) {
    components.push(group);
  }
  
  return components;

};  