'use strict';

import reserved from './reserved.js';
import applyOperator from './apply-operator.js';
import _z_methods from './_z_methods.js';
import sourceMapObject from 'source-map';
const {SourceNode} = sourceMapObject;

// helper functions and constants

const closingBrackets = { '(': ')', '[': ']', '{': '}' };

function syntaxError(t, msg) {
  throw Error(`Zap syntax at ${
    typeof t === 'string' ? t : `${t.line}:${t.column + 1}`}, ${msg}`);
};

function checkNotReserved(name, tkn, isArg) {
  name = name.replace('...', '');
  if (reserved.nonCommands.has(name)) {
    syntaxError(tkn, isArg 
      ? `parameter name is a reserved word: ${name}`
      : `assigning to a reserved word: ${name}`);
  }
}

// parse array of processed tokens to JavaScript
//  - options 'jsTree', 'sourceMap', 'js' indicate what to include in returned object
//  - 'sourceFile' option should be used if 'sourceMap' option true
//  - 'asyncIIFE' option indicates if wrapper IIFE is to be asynchronous
//  - returns object with none/some/all properties: 'jsTree', 'sourceMap', 'js' 
export default (tokens, options = {}) => {

  // state
  let tkn, type;              // current token and its type property
  let block = null;           // current block
  const stack = [];           // block-stack
  const _z_used = new Set();  // names of _z_ methods used
  let endOfCode = false;      // parsed last token
  
  openBlock();
  const baseBlock = block;

  // open block
  function openBlock() {
    const b = {
      token: tkn || null,  // token that opens block - null if base block 
      operator: null,      // current operator/command token
      operands: [],        // each entry is an object or an array
      position: null,      // number of operands before operator/command
      assign: null,        // current assignment token
      function: null,      // most local open function (or base) block
      variables: null,     // local variable names, used by function and base blocks
      js: []               // each entry is an array representing a subexpression, or
                           // a comma (string) separating these
    }
    if (!b.token) {
      b.import = [];         // import statements
      b.export = new Set();  // export variable names
    }
    if (!b.token || b.token.type === 'function') {
      b.variables = new Set();
      b.function = b;  // base block equivalent to function for declaring variables 
    }
    else {
      b.function = block.function;
    }
    if (block) stack.push(block);
    block = b;
  }

  // close block
  //  - add appropriate token objects to start and end of block
  //  - if base block, return the array representing the block's JS tree
  //  - if not base block, pop stack and push array representing the
  //    block's JS tree to operands of popped block
  function closeBlock() {
    closeSubexpr();
    const isBase = !block.token;
    if (!isBase && tkn.bracket !== closingBrackets[block.token.value[0]]) {
      syntaxError(tkn, 'bracket mismatch');
    }
    const blockJS = block.js;
    let endJS;
    if (isBase) {
      endJS = {js: ';'};
    }
    else {  // function or parentheses
      if (block.token.type === 'function') {
        const argString = Array.from(block.token.args, a => {
          return a === 'ops' ? 'ops={}' : a;
        }).join(', ');
        block.token.js = `${block.token.async ? '(async ' : '('}${
          (block.token.arrow === '=>') 
            ? `(${argString}) => {return `
            : `function${
                block.token.generator ? '*' : ''}(${argString}) {return `}`;
        tkn.js = '})';
        if (block.token.arrow !== '=>' && !block.token.async && 
              !block.token.generator && !block.token.unaryMinus
            ) {  //standard function so can be a constructor literal
          blockJS._zap_constructor = {
            start: `{constructor(${argString}) {`,
            end: '}}'
          };
        }
      }  
      else {  // parentheses
        if (blockJS.length === 0) {
          syntaxError(tkn, 'empty parentheses');
        }
        if (block.token.spread) {
          blockJS._zap_parenthSpread = true;
          block.token.js = '...(';
        }
        else {
          block.token.js = '(';
        }
        tkn.js = ')';
      }
      if (block.token.unaryMinus) {  // will not have spread
        block.token.js =
          `(${'- '.repeat(block.token.unaryMinus)}${block.token.js}`;
        tkn.js += ')';
      }
      blockJS.unshift(block.token);
      endJS = tkn;
    }
    if (block.variables) {
      let varArr = [...block.variables];
      if (isBase) {
        varArr = varArr.filter(v => !block.export.has(v));
        if (_z_used.size) varArr.push('_z_');
      }
      if (varArr.length) blockJS.push({js: `; var ${varArr.join()}`});
    }
    blockJS.push(endJS);
    if (!isBase) {
      block = stack.pop();
      block.operands.push(blockJS);
    }
    else {
      return blockJS;
    }
  }

  // started subexpression
  function startedSubexpr() {
    return block.operands.length || block.operator || block.assign;
  }

  // close subexpression
  //  - add comma token (unless block.js empty) and array representing
  //    current subexpression to block.js
  function closeSubexpr() {
    if (startedSubexpr()) {
      if (block.assign && !(block.operands.length || block.operator)) {
        syntaxError(endOfCode ? 'end of code' : tkn,
          'assignment has no right-hand side');
      }
      applyCurrentOperator();  //once applied, block.operands has 1 entry - an array
      const op0 = block.operands.pop();
      if (block.assign) {
        op0.unshift(block.assign);
        if (block.assign.operator === '#=') op0.unshift({js: '('});
        if (/^(?:[#?]=|=:)$/.test(block.assign.operator)) op0.push({js: ')'});
        block.assign = null;
      }
      if (block.js.length) block.js.push(',');
      block.js.push(op0);
    }
  }

  // apply current operator
  //  - once applied, block.operands has a single entry - an array
  function applyCurrentOperator() {
    const n = block.operands.length;
    if (block.operator) {
      block.operands = [applyOperator(block, _z_used)];
      block.operator = null;
      block.position = null;
    }
    else if (n === 1) {  // check operand a valid result, wrap in array if not already one
      const op0 = block.operands[0];
      const isToken = !Array.isArray(op0);
      if (isToken && op0.type === 'identifier' &&
          reserved.invalid.has(op0.name)) {
        syntaxError(`${op0.line}:${op0.column + 1}`,
          `invalid use of reserved word: ${op0.name}`);
      }
      const firstToken = isToken && op0.spread
        ? op0
        : (op0._zap_parenthSpread ? op0[0] : null);
      if (firstToken) {
        syntaxError(`${firstToken.line}:${firstToken.column + 1}`,
          'spread syntax but no operator');
      }
      if (isToken) block.operands[0] = [op0];
    }
    else {  // n > 1 (never try to apply operator when no operator and no operands)
      syntaxError(endOfCode ? 'end of code' : tkn,
        'multiple operands but no operator');
    }
  }

  // iterate over tokens
  for (tkn of tokens) {

    type = tkn.type;

    // literal or identifier
    if (type === 'number' || type === 'string' || type === 'regexp' ||
        type === 'identifier') {
      if (type === 'identifier') {
        if (reserved.nonCommands.has(tkn.name) && tkn.spread) {
          syntaxError(tkn, `cannot use spread with: ${tkn.name}`);
        }
        if (reserved.invalid.has(tkn.name) && tkn.unaryMinus) {
          syntaxError(tkn, `cannot use unary minus with: ${tkn.name}`);
        }
        tkn.js = `${tkn.spread ? '...' : ''}${tkn.name}`;
      }
      else if (type === 'string') {
        tkn.js = `${tkn.spread ? '...' : ''}${tkn.value}`;
      }
      else if (type === 'regexp') {
        tkn.js = tkn.value.slice(1);
      }
      else {  // number
        tkn.js = tkn.value;
      }
      if (tkn.unaryMinus) {  // will not have spread
        tkn.js = `(${'- '.repeat(tkn.unaryMinus)}${tkn.js})`;
      }
      block.operands.push(tkn);
    }

    // open function
    else if (type === 'function') {
      if (tkn.generator && tkn.arrow === '=>') {
        syntaxError(tkn, 'arrow function cannot be a generator function');
      }
      for (let nm of tkn.args) checkNotReserved(nm, tkn, 'isArg');
      openBlock();
    }

    // open parentheses
    else if (type === 'openParentheses') {
      openBlock();
    }

    // close block
    else if (type === 'closeBracket') {
      if (!block.token) syntaxError(tkn, 'bracket mismatch');
      closeBlock();
    }

    // operator
    else if (type === 'operator') {
      if (block.operator) applyCurrentOperator();
      block.operator = tkn;
      block.position = block.operands.length;
    }

    // close subexpression
    else if (type === 'closeSubexpr') {
      closeSubexpr();
    }

    // assign or destructure
    else if (type === 'assign' || type === 'destructure') {
      if (startedSubexpr()) {
        syntaxError(tkn, 'assignment must be at start of subexpression');
      }
      if (tkn.operator === '=' ||
          tkn.operator === '=:' ||
          type === 'destructure') {  //declare as local variable(s) unless arguments
        let args = block.function.token && block.function.token.args;
        if (args) args =
          new Set(Array.from(args, nm => nm.replace('...', '')));
        let addVariable = (args
          ? name => { if (!args.has(name)) block.function.variables.add(name) }
          : name => block.function.variables.add(name));
        if (type === 'destructure') {
          let names = [...tkn.names];
          names.forEach((nm, i) => {
            if (tkn.operator === '@=' && nm === 'null') {
              names[i] = '';
            }
            else {
              checkNotReserved(nm, tkn);
              addVariable(nm.replace('...', ''));
            }
          });
          tkn.js = (tkn.operator === '#=')
            ? `{${names.join(', ')}} = `
            : `[${names.join(', ')}] = `;
        }
        else {  // = or =:
          checkNotReserved(tkn.name, tkn);
          addVariable(tkn.name);
          if (tkn.operator === '=:') {
            tkn.js = `${tkn.name} = ops.${tkn.name} ?? (`;
          }
          else {
            tkn.js = `${tkn.name} = `;
          }
        }
      }
      else {
        checkNotReserved(tkn.name, tkn);
        if (tkn.operator === '?=') {
          tkn.js = `${tkn.name} = ${tkn.name} ?? (`;
        }
        else {
          let op = tkn.operator;
          if (op === '\\=') op = '=';
          else if (op === '^=') op = '**=';
          tkn.js = `${tkn.name} ${op} `;
        }
      }
      block.assign = tkn;
    }

  }
  endOfCode = true;
  if (stack.length) {
    throw Error(`Zap syntax, unclosed block at end of code`);
  }
  
  // generate JS
  {

    const baseTree = closeBlock();
    const result = {};

    if (options.js || options.sourceMap) {
     
      const addToStart = [];
      const pointToStart = js => ({js, line: 1, column: 0});

      // import and export statements, IIFE and 'use strict'
      if (baseBlock.export.size) {
        addToStart.push(
          pointToStart(`export var ${[...baseBlock.export].join(', ')};\n`));
      }
      if (baseBlock.import.length) {
        addToStart.push(baseBlock.import);
      }
      addToStart.push(`(${
        options.asyncIIFE ? 'async ' : ''}() => {\n'use strict'; return `);
      baseTree.push('\n})();');

      // add used _z_ methods
      if (_z_used.size) {
        let _z_js = '_z_ = {';
        const _z_helpersUsed = new Set();
        for (let mthd of _z_used) {
          _z_js += `\n${_z_methods[mthd].toString()},`;
          const aux = _z_methods[mthd + 'Use'];
          if (aux) aux.forEach(nm => _z_helpersUsed.add(nm));
        }
        for (let mthd of _z_helpersUsed) {
          _z_js += `\n${_z_methods[mthd].toString()},`;
        };
        _z_js += '\n},\n';
        addToStart.push(pointToStart(_z_js));
      }

      baseTree.unshift(addToStart);

      // generate JS with source map
      if (options.sourceMap) {
        const node = new SourceNode(1, 0, options.sourceFile, '');
        const addNode = c => {
          if (Array.isArray(c)) c.forEach(addNode);
          else if (typeof c === 'string') {
            node.add(c);
          }
          else {
            node.add(new SourceNode(c.line, c.column, options.sourceFile, c.js));
          }
        };
        addNode(baseTree);
        const {code, map} = node.toStringWithSourceMap();
        if (options.js) result.js = code;
        result.sourceMap = map;
      }

      // generate JS without source map
      else {
        let js = '';
        const writeJS = c => {
          if (Array.isArray(c)) c.forEach(writeJS);
          else if (typeof c === 'string') js += c;
          else js += c.js;
        };
        writeJS(baseTree);
        result.js = js;
      }

    }

    if (options.jsTree) result.jsTree = baseTree;
    return result;

  }

};