////////////////////////////////////////////////////////////////////////////////
// Tokenize a string of Zap code. The exported function returns an array of
// 'components': each element is a keyword token, or an array of non-keyword
// tokens. Comment and space (including newline) tokens are discarded.
////////////////////////////////////////////////////////////////////////////////

import { operatorDetails } from "./operators.js";
import { reserved } from "./reserved.js";
import { commaFirstWords, allFirstWords } from "./statements.js";

const regexps = new Map([
  ['space', /[^\S\r\n]+/y],  // same-line whitespace
  ['comment', /\/\/.*|#\S*/y],
  ['newline', /\r?\n/y],
  ['number', /0[bB][01]+n?|0[oO][0-7]+n?|0[xX][\da-fA-F]+n?|0n|[1-9]\d*n|\d+(?:\.\d+)?(?:e[+\-]?\d+)?/y],
  ['string', /'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"/y],
  ['regexp', /`([^`\\/]*(?:\\.[^`\\/]*)*)`([\w$]*)/y],
  ['identifier', /([!\^\\]?)([a-zA-Z_$][\w$]*)/y],
  ['openBracket', /[({[]/y],
  ['closeBracket', /[)}\]]/y],
  ['bar', /\|/y],
  ['ampersand', /&/y],
  ['comma', /,/y],
  ['symbolOperator', /[+\-*/%~<>=!?.:;]+/y]
]);

export function lexer(code) {
  
  const components = [];
  let group = null;      // contiguous non-keyword tokens
  let firstWord = null;  // first word of current statement
  let index = 0;         // position in code
  let line = 1;          // current line
  let column = 0;        // current column

  // zap syntax error
  function lexerError(msg) {
    throw Error(`Zap syntax at ${line}:${column + 1}, ${msg}`);
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

        // identifier
        if (type === 'identifier') {
          const prefix = match[1];
          const word = match[2];
          if (prefix) {
            if (reserved.all.has(word)) {
              lexerError(`invalid prefix "${
                prefix}" with reserved word "${word}"`);
            }
            if (!/A-Z/.test(word[0])) {
              lexerError(`invalid prefix "${prefix}" ("${
                word}" does not start with an uppercase letter)`);
            }
          }
          if (reserved.keywords.has(match[0])) {
            type = tkn.type = 'keyword';
            column += match[0].length;
          }
          else if (reserved.operators.has(match[0])) {
            type = tkn.type = 'operator';
          }
          else {
            tkn.prefix = prefix;
            tkn.word = word;
          }
        }

        // comma
        else if (type === 'comma') {
          if (!commaFirstWords.has(firstWord)) {
            lexerError('invalid comma');
          }
          tkn.value = firstWord;
          type = tkn.type = 'keyword';
          column += match[0].length;
        }

        // keyword
        if (type === 'keyword') {
          if (group) {
            if (group.length) {
              components.push(group);
            }
            group = null;
          }
          if (allFirstWords.has(match[0])) {
            firstWord = match[0];
            tkn.openStatement = true;
          }
          components.push(tkn);
        }

        // non-keywords
        else {

          if (!group) {
            group = [];
          }

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
              if (match[0][0] === '"') {
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
            }

            // no other tokens can be multiline
            else {

              // symbol operator
              if (type === 'symbolOperator') {
                if (!operatorDetails[match[0]]) {
                  lexerError(`unrecognized operator: ${match[0]}`);
                }
              }

              // regex
              else if (type === 'regexp') {
                tkn.value = `/${match[1]}/${match[2]}`;
              }

              column += match[0].length;

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