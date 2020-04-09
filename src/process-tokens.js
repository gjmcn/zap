// Add properties to tokens and combine some tokens into compound tokens.

'use strict';

// token types that can accept unary minus
const canUnaryMinus = new Set([
  'number', 'string', 'regexp', 'identifier', 'openParentheses', 'function'
]);

// token types that can spread
const canSpread = new Set([
  'string', 'identifier', 'openParentheses'
]);

// returns a new array of token objects, some of which represent multiple
// original tokens
export default tokens => {

  const newTokens = [];

  function syntaxError(tkn, msg) {
    throw Error(`Zap syntax at ${tkn.line}:${tkn.column + 1}, ${msg}`);
  };

  // iterate over tokens
  for (let i = 0; i < tokens.length; i++) {

    const tkn = tokens[i];
    const {value, type} = tkn;

    // unary minus
    if (value === '~') {
      let k;
      for (let j = i + 1; j < tokens.length; j++) {
        if (tokens[j].value !== '~') {
          k = j;
          break;
        }
      }
      if (!k) syntaxError(tkn, 'invalid use of unary minus');
      const target = tokens[k];
      if (!canUnaryMinus.has(target.type)) {
        syntaxError(tkn, 'invalid use of unary minus');
      }
      target.unaryMinus = k - i;
      i = k - 1;
    }

    // spread
    else if (type === 'spreadOrRest') {
      const target = tokens[i + 1];
      if (!target || !canSpread.has(target.type)) {
        syntaxError(tkn, 'invalid use of spread syntax');
      }
      target.spread = true;
    }

    // other operators (including commands)
    else if (type === 'operator') {
      if (/^(?:[+\-*/%\^?\\@#]?=|=:)$/.test(tkn.value)) {
        syntaxError(tkn, `${tkn.value} requires a left operand`);
      }
      newTokens.push(tkn);
    }

    // number, string, regexp or open parentheses
    else if (type === 'number' || type === 'string' || type === 'regexp' ||
        type === 'openParentheses') {
      newTokens.push(tkn);
    }

    // identifier (includes assignment and destructure)
    else if (type === 'identifier') {
      if (tokens[i + 1] && /^(?:[+\-*/%\^?\\]?=|=:)$/
          .test(tokens[i + 1].value)) {
        tkn.type = 'assign';
        tkn.name = tkn.value;
        tkn.operator = tokens[i + 1].value;
        i++;
      }
      else {
        const names = [tkn.value];
        let rest, earlierRest, op;
        for (let j = i + 1; j < tokens.length; j++) {
          if (tokens[j].type === 'identifier') {
            names.push(tokens[j].value);
          }
          else if (tokens[j].type === 'spreadOrRest') {
            if (rest) earlierRest = rest;
            rest = j;
          }
          else {
            if (/^[#@]=$/.test(tokens[j].value)) op = j;
            break;
          }
        }
        if (op) {
          if (rest) {
            if (earlierRest) {
              syntaxError(tokens[earlierRest], 'invalid use of rest syntax');
            }
            if (rest !== op - 2) {
              syntaxError(tokens[rest], 'invalid use of rest syntax');
            }
            const k = names.length - 1;
            names[k] = `...${names[k]}`; 
          }
          tkn.names = names;
          tkn.operator = tokens[op].value;
          tkn.type = 'destructure';
          i = op;
        }
        else {
          tkn.name = tkn.value;
        }
      }
      if (tkn.type !== 'identifier') {
        if (tkn.unaryMinus) {
          syntaxError(tkn, 'assignment must be at start of subexpression');
        }
        if (tkn.spread) {
          syntaxError(tkn, tkn.type === 'assign'
            ? 'invalid use of rest syntax'
            : 'cannot use rest syntax with first variable when destructure');
        }
      }
      newTokens.push(tkn);
    }

    // function
    else if (type === 'function') {
      if (tkn.value[0] === '{') tkn.async = true;
      if (tkn.value.length === 3) tkn.generator = true;
      const args = [];
      let rest, earlierRest, arrow;
      for (let j = i + 1; j < tokens.length; j++) {
        if (tokens[j].type === 'identifier') {
          args.push(tokens[j].value);
        }
        else if (tokens[j].type === 'spreadOrRest') {
          if (rest) earlierRest = rest;
          rest = j;
        }
        else {
          if (tokens[j].type === 'arrow') arrow = j;
          break;
        }
      }
      if (arrow) {
        if ((new Set(args)).size < args.length) {
          syntaxError(tokens[arrow], 'duplicate parameter name');
        }
        if (rest) {
          if (earlierRest) {
            syntaxError(tokens[earlierRest], 'invalid use of rest syntax');
          }
          const k = args.length - 1;
          if (rest !== arrow - 2 || args[k] === 'ops') {
            syntaxError(tokens[rest], 'invalid use of rest syntax');
          }
          args[k] = `...${args[k]}`;
        }
        tkn.args = new Set(args);
        tkn.arrow = tokens[arrow].value;
        i = arrow;
      }
      else {
        tkn.args = new Set('abcd');
      }
      newTokens.push(tkn);
    }

    // close bracket
    else if (type === 'closeBracket') {
      tkn.bracket = tkn.value;
      newTokens.push(tkn);
    }

    // arrow
    else if (type === 'arrow') {
      syntaxError(tkn, `unexpected ${tkn.value}`);
    }

    // close subexpression
    else if (type === 'closeSubexpr') {
      const next = tokens[i + 1];
      if (!next ||
          (next.type !== 'closeSubexpr' && next.type !== 'closeBracket')) {
        newTokens.push(tkn);
      }
    }

    // missing a token type!
    else {
      throw new Error(`token type ${type} not processed`);
    }

  };

  return newTokens;
};