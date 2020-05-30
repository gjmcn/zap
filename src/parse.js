import reserved from './reserved.js';
import applyOperator from './apply-operator.js';
import _z_methods from './_z_methods.js';
import sourceMapObject from 'source-map';
const {SourceNode} = sourceMapObject;

// helper functions and constants

function syntaxError(t, msg) {
  throw Error(`Zap syntax at ${
    typeof t === 'string' ? t : `${t.line}:${t.column + 1}`}, ${msg}`);
};

function arityError(operator) {
  syntaxError(operator, 'invalid number of operands');
}

function checkValidName(tkn, msg) {
  if (Array.isArray(tkn) || tkn.type !== 'identifier' ||
      reserved.nonCommands.has(tkn.name)) {
    syntaxError(tkn, msg);
  }
}

// new token object with line and column of tkn and given js
function tokenWithPosn(tkn, js) {
  return {
    js,
    line: tkn.line,
    column: tkn.column,
  };
}

const functionCreators = new Set([
  'fun', 'proc', 'gen', 'scope', 'as', 'asyncFun', 'asyncProc', 'asyncGen',
  'asyncScope', 'asyncAs', 'class', 'extends'
]);

const triggerApplyOp = new Set([
  'closeSubexpr', 'closeBracket', 'operator'
]);

const assignmentOps = new Set(['=', '#=', '@=', '<-', '\\=', '?=']);
const updateOps = new Set(['+=', '-=', '*=', '/=', '%=', '^=']);
const lhsSetterOps = new Set([':', '::', ',']);

// parse array of processed tokens to JavaScript
//  - options 'jsTree', 'sourceMap', 'js' indicate what to include in returned
//    object
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
      token: tkn || null,   // token that opens block - null if base block 
      operator: null,       // current operator token
      operands: [],         // each entry is an object or an array
      position: null,       // number of operands before operator
      assign: null,         // LHS and assignment, an array if used
      assignOpValue: null,  // assignment operator value, e.g. '#='
      variables: new Set(), // names of local variables - these bubble up to
                            // the parent function or base block
      awaitUsed: false,     // indicates if await is used inside the block - 
                            // bubbles up to the parent function or base block
      js: [],               // each entry is an array representing a subexpr,
                            // or a comma (string) separating these
    }
    if (!b.token) {
      b.import = [];         // import statements
      b.export = new Set();  // export variable names
    }
    if (block) stack.push(block);
    block = b;
  }

  // close block
  //  - add appropriate token objects to start and end of block
  //  - if base block, return the array representing the block's JS tree
  //  - if not base block, pop the stack and push the current block's JS tree
  //    (an array) onto the operands of the popped block
  function closeBlock() {
    
    closeSubexpr();
    const isBase = !block.token;
    const blockJS = block.js;
    let endJS;
    
    // base block
    if (isBase) {
      endJS = ';';
    }

    // function or parentheses
    else {
      
      // function
      if (block.token.type === 'function') {
        const paramsString = [...block.token.params].join();
        if (block.token.class) {
          block.token.js = `(class {constructor(${paramsString}) {`;
          tkn.js = '}})';
        }
        else if (block.token.extends) {
          block.token.js = [
            '(class extends ',
            block.token.extends,
            ` {constructor(${paramsString}) {`
          ];
          tkn.js = '}})';
        }
        else {
          block.token.js = `${block.token.async ? '(async ' : '('}${
            block.token.arrow
              ? `(${paramsString}) => {return `
              : `function${block.token.generator ? '*' : ''}(${
                  paramsString}) {return `}`;
          if (block.token.scope) tkn.js = '})()';
          else if (block.token.as) tkn.js = ['})(', block.token.as, ')'];
          else tkn.js =  '})';
        }
      }

      // parentheses
      else {
        if (blockJS.length === 0) syntaxError(tkn, 'empty block');
        block.token.js = '(';
        tkn.js = ')';
      }

      blockJS.unshift(block.token);
      endJS = tkn;
    
    }

    // base block or function - declare variables, check async/await
    if (isBase || block.token.type === 'function') {
     
      let varArr = [...block.variables];

      // base block - do not declare variables that are exported
      if (isBase) {
        varArr = varArr.filter(v => !block.export.has(v));
        if (_z_used.size) varArr.push('_z_');
      }

      // function - do not declare variables that are params
      else if (block.token.params.size) {  
        varArr = varArr.filter(v => !block.token.params.has(v));
      }
      
      // push variables
      if (varArr.length) blockJS.push(`; var ${varArr.join()}`);

      // throw if await is used inside a synchronous function
      if (block.awaitUsed && !isBase && !block.token.async) {
        syntaxError(isBase ? '(end of code)' : tkn,
          'await inside synchronous function');
      }

    }
    
    // parentheses - push variables and awaitUsed to parent block
    else {
      const parentBlock = stack[stack.length - 1];
      if (block.variables.size) {
        block.variables.forEach(v => parentBlock.variables.add(v));
      }
      if (block.awaitUsed) {
        parentBlock.awaitUsed = true;
      }
    }
    
    blockJS.push(endJS);
    if (isBase) {
      return blockJS;
    }
    else {
      block = stack.pop();
      block.operands.push(blockJS);
    }

  }

  // close subexpression - add a comma (unless block.js is empty) and the array
  // representing the current subexpression to block.js
  function closeSubexpr() {
    if (block.operands.length || block.operator || block.assign) {
      if (block.assign && !(block.operands.length || block.operator)) {
        syntaxError(endOfCode ? '(end of code)' : tkn,
          'assignment has no right-hand side');
      }
      applyCurrentOperator();  // block.operands now has 1 entry (an array)
      const op0 = block.operands.pop();
      if (block.assign) {
        op0.unshift(block.assign);
        if (block.assignOpValue === '#=' || block.assignOpValue === '?='||
            block.assignOpValue === '<-') {
          op0.push(')');
        }
        block.assign = null;
        block.assignOpValue = null;
      }
      if (block.js.length) block.js.push(', ');
      block.js.push(op0);
    }
  }

  // apply current operator - once applied, block.operands has a single entry
  // (an array)
  function applyCurrentOperator() {
    
    // block has operator
    if (block.operator) {

      // create-function operator should have been applied 'manually' except
      // for class or extends with no constructor
      if (functionCreators.has(block.operator.value)) {
        if (block.operator.value === 'class' && block.operands.length === 0) {
          block.operands = [[ tokenWithPosn(block.operator, '(class {})') ]];
        }
        else if (block.operator.value === 'extends' &&
            block.operands.length === 0) {
          syntaxError(block.operator, 'missing parent class');
        }
        else if (block.operator.value === 'extends' &&
            block.operands.length === 1) {
          block.operands = [[
            tokenWithPosn(block.operator, '(class extends '),
            block.operands[0],
            tokenWithPosn(block.operator, ' {})')
          ]];
        }
        else {
          syntaxError(block.operator, 'missing function body');
        }
      }

      // apply operator  
      else {
        block.operands = [ applyOperator(block, _z_used) ];
      }

      block.operator = null;
      block.position = null;
    
    }

    // no operator and a single operand - check operand is a valid result and
    // wrap in an array if not already one
    else if (block.operands.length === 1) {
      const op0 = block.operands[0];
      if (!Array.isArray(op0)) {
        if (op0.type === 'identifier' && reserved.invalid.has(op0.name)) {
          syntaxError(op0, `invalid use of reserved word: ${op0.name}`);
        }
        block.operands[0] = [op0];
      }
    }

    // multiple operands error - this function is never called with no operator
    // and no operands
    else {
      syntaxError(endOfCode ? '(end of code)' : tkn,
        'multiple operands but no operator');
    }

  }

  // iterate over tokens
  for (let tknIndex = 0; tknIndex < tokens.length; tknIndex++) {

    tkn = tokens[tknIndex];  
    type = tkn.type;

    // number or string
    if (type === 'number' || type === 'string') {
      tkn.js = tkn.value;
      block.operands.push(tkn);
    }

    // regex
    else if (type === 'regexp') {
      tkn.js = tkn.value.slice(1);
      block.operands.push(tkn);
    }

    // identifier
    else if (type === 'identifier') {
      tkn.js = tkn.name;
      block.operands.push(tkn);
    }

    // one-liner function
    else if (type === 'function') {
      if (tkn.value === '{') tkn.arrow = true;
      tkn.params = new Set('abc');
      openBlock();
    }

    // open parentheses
    else if (type === 'openParentheses') {
      openBlock();
    }

    // close block - if the block is a function body, change the block type to
    // function and apply the create-function operator
    else if (type === 'closeBracket') {

      // one-liner function
      if (tkn.value === '}' || tkn.value === ']') {
        closeBlock();
      }
      
      // parentheses    
      else {

        const parentBlock = stack[stack.length - 1];
        const parentOp = parentBlock.operator;
        const nextToken = tokens[tknIndex + 1];

        // the block is a function body if the parent block's current
        // operator is a create-function operator and the next token triggers
        // the operator to be applied (or at end of code)  
        if (parentOp && functionCreators.has(parentOp.value) &&
            (!nextToken || triggerApplyOp.has(nextToken.type))) {

          // calling extends with only this block as an operand? - this block
          // is the parent class and no constructor is passed
          if (parentOp.value === 'extends' &&
              parentBlock.operands.length === 0) {
            closeBlock();
            return;    
          }
        
          block.token.type = 'function';

          // add properties indicating type of function
          if (parentOp.value.slice(0, 5) === 'async') block.token.async = true;
          const kind = block.token.async
            ? parentOp.value.slice(5).toLowerCase()
            : parentOp.value;
          if (kind === 'proc' || kind === 'as') block.token.arrow = true;
          else if (kind === 'gen') block.token.generator = true;
          else if (kind === 'scope') {
            block.token.arrow = block.token.scope = true;
          }
          else if (kind === 'class') block.token.class = true;
          
          // params
          block.token.params = new Set();

          // scope - no param
          if (kind === 'scope') {
            if (parentBlock.operands.length) arityError(parentOp);
          }
          
          // as - 1 arg, 1 param
          else if (kind === 'as') {
            if (parentBlock.operands.length !== 2) arityError(parentOp);
            block.token.as = parentBlock.operands[0];
            const paramToken = parentBlock.operands[1];
            checkValidName(paramToken, 'invalid parameter name');
            if (paramToken.name === 'rest') {
              syntaxError(paramToken, 'invalid rest parameter');
            }
            block.token.params.add(
              paramToken.name === 'ops' ? 'ops={}' : paramToken.name
            );
          }
          
          // params for all other function-create kinds
          else {
            
            // extends - first param is parent class
            if (kind === 'extends') {
              block.token.extends = parentBlock.operands[0];
            }
        
            // check param names
            const paramTokens = parentBlock.operands;
            if (kind === 'extends') paramTokens = paramTokens.slice(1);
            for (let j = 0; j < paramTokens.length; j++) {
              let tj = paramTokens[j];
              checkValidName(tj, 'invalid parameter name');
              if (tj.name === 'ops') {
                block.token.params.add('ops={}');
              }
              else if (tj.name === 'rest') {
                if (j !== paramTokens.length - 1) {
                  syntaxError(tj, 'rest parameter must be final parameter');
                }
                block.token.params.add('...rest');
              }
              else {
                block.token.params.add(tj.name);
              }
            }
            if (block.token.params.size < paramTokens.length) {
              syntaxError(parentOp, 'duplicate parameter name');
            }

          }

          // close block - changes block to parent block; this needs modified
          // since we have just 'manually' applied its operator
          closeBlock();
          block.operands = [ block.operands.pop() ];
          block.operator = null;
          block.position = null;
        
        }

        // standard parentheses
        else {
          closeBlock();
        }

      }

    }

    // operator
    else if (type === 'operator') {
      
      // apply current operator if exists
      const currentOp = block.operator;
      if (currentOp) applyCurrentOperator();

      // assignment
      if (assignmentOps.has(tkn.value) || updateOps.has(tkn.value)) {

        if (block.assign) syntaxError(tkn, 'multiple assignment operators');
        
        block.assign = [];
        block.assignOpValue = tkn.value;

        // destructure
        if (tkn.value === '#=' || tkn.value === '@=') {
          if (block.operands.length === 0) {
            syntaxError(tkn,
              'expected one or more operands on left-hand side of assignment');
          }
          block.assign.push(tokenWithPosn(tkn,
            tkn.value === '#=' ? '({' : '['));
          const lhsNames = new Set();
          block.operands.forEach(o => {
            checkValidName(o,
              'invalid variable name on left-hand side of assignment');
            lhsNames.add(o.name);
            block.variables.add(o.name);
            block.assign.push(o.name, ',');
          });
          if (lhsNames.size < block.operands.length) {
            syntaxError(tkn,
              'duplicate variable name on left-hand side of assignment');
          }
          block.assign.push(tokenWithPosn(tkn,
            tkn.value === '#=' ? '} = ' : '] = '));
        }

        // assign to one variable/property
        else {

          if (block.operands.length !== 1) {
            syntaxError(tkn,
              'expected one operand on left-hand side of assignment');
          }
          const lhs = block.operands[0];

          // assign to outer variable
          if (tkn.value === '\\=') {
            checkValidName(lhs,
              'invalid variable name on left-hand side of assignment');
            block.assign.push(lhs, tokenWithPosn(tkn, ' = '));
          }
           
          // conditional assign or use ops
          else if (tkn.value === '?=' || tkn.value === '<-') {
            checkValidName(lhs,
              'invalid variable name on left-hand side of assignment');
            if (tkn.value === '<-') block.variables.add(lhs.name);
            block.assign.push(
              lhs.name,
              tokenWithPosn(tkn, (tkn.value === '<-' ? ' = ops.' : ' = ')),
              lhs.name,
              tokenWithPosn(tkn, ' ?? (')
            );
          }
          
          // standard assign or update-assign - to variable or property
          else {
            let settingVariable = false;
            if (currentOp) {
              if (!lhsSetterOps.has(currentOp.value)) {
                syntaxError(tkn, 'invalid left-hand side of assignment');
              }
            }
            else {
              checkValidName(lhs, 'invalid left-hand side of assignment');
              settingVariable = true;
            }
            if (tkn.value === '=' && settingVariable) {
              block.variables.add(lhs.name);
            }
            block.assign.push(lhs, tokenWithPosn(tkn,
              (tkn.value === '^=' ? ' **= ' : ` ${tkn.value} `)));
          }

        }

        // reset block operands - block operator and position were either
        // already null or were set to null when applied currentOp
        block.operands = [];

      }

      // non-assignment operator
      else {
        block.operator = tkn;
        block.position = block.operands.length;
      }
    
    }

    // close subexpression
    else if (type === 'closeSubexpr') {
      closeSubexpr();
    }

    // unhandled token type
    else {
      syntaxError(tkn, 'unhandled token type');
    }

  }

  endOfCode = true;
  
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