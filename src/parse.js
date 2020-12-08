import reserved from './reserved.js';
import applyOperator from './apply-operator.js';
import _z_methods from './_z_methods.js';
import sourceMapObject from 'source-map';
const {SourceNode} = sourceMapObject;


// ===== helper functions and constants ===================

const functionCreators = new Set([
  'fun', 'proc', 'scope', 'as', 'each', 'map', 'do', 'try', 'catch',
  'asyncFun', 'asyncProc', 'asyncScope', 'asyncAs', 'asyncEach', 'asyncMap',
  'asyncDo', 'asyncTry', 'asyncCatch', 'class', 'extends'
]);
const yieldKinds = new Set([
  'fun', 'scope', 'as', 'each', 'do'
]);
const loopKinds = new Set([
  'each', 'map', 'do'
]);
const triggerApplyOp = new Set([
  'closeSubexpr', 'closeBracket', 'operator'
]);
const assignmentOps = new Set([
  '=', '#=', '@=', '<-', '\\=', '?='
]);
const updateOps = new Set([
  '+=', '-=', '*=', '/=', '%=', '^='
]);
const lhsSetterOps = new Set([
  ':', '::'
]);

function syntaxError(t, msg) {
  throw Error(`Zap syntax at ${
    typeof t === 'string' ? t : `${t.line}:${t.column + 1}`}, ${msg}`);
}

function arityError(operator) {
  syntaxError(operator, 'invalid number of operands');
}

function checkValidName(tkn, errTkn, msg) {
  if (Array.isArray(tkn) || tkn.type !== 'identifier' ||
      reserved.nonCommands.has(tkn.name)) {
    syntaxError(errTkn, msg);
  }
}

// new token object with line and column of tkn and given js
function tokenPosn(tkn, js) {
  return {
    js,
    line: tkn.line,
    column: tkn.column,
  };
}


 // ===== exported parse function ==========================

// parse array of processed tokens to JavaScript
//  - options 'jsTree', 'sourceMap', 'js' indicate what to include in returned
//    object
//  - 'sourceFile' option should be used if 'sourceMap' option true
//  - 'iife': wrapper iife, can be 'none', 'sync' (default) or 'async'
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
                            //   the parent function or base block
      awaitUsed: false,     // awaitUsed, stopUsed and yieldUsed indicate
      stopUsed: false,      //   if await, stop and yield/yieldFrom are used
      yieldUsed: false,     //   inside the block - if truthy, these properties
                            //   bubble up to the parent function or base block
      js: [],               // each entry is an array representing a subexpr,
                            //   or a comma (string) separating these
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
  //  - if base block, return the block's JS tree (an array)
  //  - if not base block, pop the stack and push the current block's JS tree
  //    (an array) onto the operands of the popped block
  function closeBlock() {
    
    closeSubexpr();
    const isBase = !block.token;
    const blockJS = block.js;
    const startJS = [];
    const endJS = [];
    
    // base block
    if (isBase) {
      if (block.stopUsed) {
        syntaxError('(top-level scope)', 'invalid use of stop');
      }
      if (block.yieldUsed) {
        syntaxError('(top-level scope)', 'invalid use of yield');
      }
      let varArray = [...block.variables].filter(v => !block.export.has(v));
      if (_z_used.size) varArray.push('_z_');
      endJS.push(varArray.length ? `; var ${varArray.join()};` : ';');
    }
    
    // function
    else if (block.token.type === 'function') {

      const kind = block.token.kind;

      // check for invalid use of await, stop or yield
      if (block.awaitUsed && !block.token.async) {
        syntaxError(tkn, 'await used inside synchronous scope');
      }
      if (block.stopUsed && !loopKinds.has(kind)) {
        syntaxError(tkn, 'stop used inside non-loop scope');
      }
      if (block.yieldUsed && !yieldKinds.has(kind)) {
        syntaxError(tkn, 'invalid use of yield');
      }
      
      // parameters and variables
      const paramsArray = [...block.token.params];
      const paramsString = paramsArray.join();
      const asyncString = block.token.async ? 'async ' : '';
      let varArray = [...block.variables];
      if (block.token.params.size) {  
        varArray = varArray.filter(v => !block.token.params.has(v));
      }
      const varString = varArray.length
        ? `${loopKinds.has(kind) ? 'let ' : 'var '}${varArray.join()}`
        : '';
      
      // class
      if (kind === 'class') {
        let s = `(class {constructor(${paramsString}) {`;
        if (blockJS.length === 0 && paramsArray.length) {
          for (let p of paramsArray) {
            if (p === 'ops={}') p = 'ops';
            else if (p === '...rest') p = 'rest';
            s += `this.${p} = ${p}; `;
          }
        }
        startJS.push(tokenPosn(block.token, s));
        endJS.push(tokenPosn(tkn, `; ${varString}}})`));
      }

      // extends
      else if (kind === 'extends') {
        startJS.push(
          tokenPosn(block.token, '(class extends '),
          block.token.extends
        );
        if (blockJS.length === 0) {
          if (paramsArray.length) {
            syntaxError(tkn,
              'subclass constructor has parameters but empty body');
          }
          startJS.push(tokenPosn(block.token, ' {'));
          endJS.push(tokenPosn(tkn, '})'));
        }
        else {
          startJS.push(tokenPosn(block.token,
            ` {constructor(${paramsString}) {`));
          endJS.push(tokenPosn(tkn, `; ${varString}}})`));
        }
      }

      // each, map
      else if (kind === 'each' || kind === 'map') {
        const [valParam = '_z_v', indexParam, iterParam] = paramsArray;
        const isMap = (kind === 'map');
        if (isMap) {
          if (blockJS.length) {
            blockJS.unshift('(');
            blockJS.push(')');
          }
          else {
            blockJS.push('void 0');
          }
        }
        let s = `(${asyncString}`;
        s += block.yieldUsed ? 'function*(_z_x) {' : '_z_x => {';
        if (indexParam || isMap) s += `let _z_i = -1; `;
        if (isMap) s += 'let _z_m = []; ';
        if (block.stopUsed) s += 'let _z_s; ';
        s += `for (let ${valParam} of _z_x) {`;
        if (iterParam) s += `let ${iterParam} = _z_x; `;
        if (indexParam) s += `let ${indexParam} = ++_z_i; `;
        else if (isMap) s += `++_z_i; `;
        if (varString) s += `${varString}; `;
        if (isMap) s += '_z_m[_z_i] = ';
        startJS.push(tokenPosn(block.token, s));
        endJS.push(
          tokenPosn(tkn,
            `${block.stopUsed ? '; if (_z_s) break' : ''}} return _z_${
              isMap ? 'm' : 'x'}})(`
          ),
          block.token[kind],
          ')'  
        );
      }

      // do
      else if (kind === 'do') {
        const doLimit = block.token.doLimit;
        let s = `(${asyncString}`;
        const sig = doLimit ? '(_z_l)' : '()';
        s += block.yieldUsed ? `function*${sig} {` : `${sig} => {`;
        if (block.stopUsed) s += 'let _z_s; ';
        s += doLimit
          ? `for (let _z_i = 0; _z_i < _z_l; _z_i++) {`
          : 'while (1) {';
        if (paramsArray[0]) s += `let ${paramsArray[0]} = _z_i; `;
        if (varString) s += `${varString}; `;
        startJS.push(tokenPosn(block.token, s));
        endJS.push(tokenPosn(tkn,
          `${block.stopUsed ? '; if (_z_s) break' : ''}}})(`));
        if (doLimit) endJS.push(doLimit);
        endJS.push(')');
      }

      // try
      else if (kind === 'try') {
        startJS.push(tokenPosn(block.token, `(${asyncString}() => {try {`));
        endJS.push(tokenPosn(tkn, `} catch (e) {return e} ${varString}})()`));
      }

      // catch
      else if (kind === 'catch') {
        startJS.push(tokenPosn(block.token,
          `(${asyncString}${paramsString} => {if (${paramsString}) {`));
        endJS.push(tokenPosn(tkn, `} ${varString}})(`), block.token.catch, ')');
      }

      // all other function kinds: fun, proc, scope, as
      else {
        let s = `(${asyncString}`;
        if (block.yieldUsed)      s += `function*(${paramsString})`;
        else if (kind === 'fun')  s += `function(${paramsString})`;
        else                      s += `(${paramsString}) =>`;
        s += ' {return '; 
        startJS.push(tokenPosn(block.token, s));
        if (kind === 'as') {
          endJS.push(tokenPosn(tkn, `; ${varString}})(`), block.token.as, ')');
        }
        else {
          endJS.push(tokenPosn(tkn,
            `; ${varString}})${kind === 'scope' ? '()' : ''}`));
        }
      }

    }

    // parentheses
    else {
      if (blockJS.length === 0) syntaxError(tkn, 'invalid empty block');
      startJS.push(tokenPosn(block.token, '('));
      endJS.push(tokenPosn(tkn, ')'));
      const parentBlock = stack[stack.length - 1];
      if (block.variables.size) {
        block.variables.forEach(v => parentBlock.variables.add(v));
      }
      if (block.awaitUsed) parentBlock.awaitUsed = true;
      if (block.stopUsed)  parentBlock.stopUsed = true;
      if (block.yieldUsed) parentBlock.yieldUsed = true;
    }

    // push to start and end of block
    if (!isBase) blockJS.unshift(startJS);    
    blockJS.push(endJS);

    // return/push blockJS of closed block
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

      // create-function operator should have been applied 'manually'
      if (functionCreators.has(block.operator.value)) {
        syntaxError(block.operator, 'missing body');
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

    // property
    else if (type === 'property') {
      const propsString = tkn.props.map(p => {
        return p[0] === ',' ? `["${p.slice(1)}"]` : `[${p.slice(1)}]`;
      }).join('');
      tkn.js = `(${tkn.name}${propsString})`; 
      block.operands.push(tkn);
    }

    // one-liner function
    else if (type === 'function') {
      tkn.kind = (tkn.value === '{' ? 'proc' : 'fun');
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

          block.token.type = 'function';

          // add async and kind properties to block token
          if (parentOp.value.slice(0, 5) === 'async') {
            block.token.async = true;
          }
          const kind = parentOp.value.replace('async', '').toLowerCase();
          block.token.kind = kind;
          
          // params
          block.token.params = new Set();

          // scope, try - no params
          if (kind === 'scope' || kind === 'try') {
            if (parentBlock.operands.length) arityError(parentOp);
          }
          
          // as, catch - 1 arg, 1 param
          else if (kind === 'as' || kind === 'catch') {
            if (parentBlock.operands.length !== 2) arityError(parentOp);
            block.token[kind] = parentBlock.operands[0];
            const paramToken = parentBlock.operands[1];
            checkValidName(paramToken, parentOp, 'invalid parameter name');
            if (paramToken.name === 'rest') {
              syntaxError(paramToken, 'invalid rest parameter');
            }
            else if (paramToken.name === 'ops' && kind === 'catch') {
              syntaxError(paramToken, 'invalid ops parameter');
            }
            block.token.params.add(
              paramToken.name === 'ops' ? 'ops={}' : paramToken.name
            );
          }

          // do
          else if (kind === 'do') {
            if (parentBlock.operands.length > 2) arityError(parentOp);
            block.token.doLimit = parentBlock.operands[0];
            if (parentBlock.operands.length === 2) {
              const paramToken = parentBlock.operands[1];
              checkValidName(paramToken, parentOp, 'invalid parameter name');
              if (paramToken.name === 'rest' || paramToken.name === 'ops') {
                syntaxError(
                  paramToken, `invalid ${paramToken.name} parameter`);
              }
              block.token.params.add(paramToken.name);
            }
          }
          
          // params for all other function-create kinds
          else {

            // each, map - first operand is the iterable
            if (kind === 'each' || kind === 'map') {
              if (parentBlock.operands.length === 0 ||
                  parentBlock.operands.length > 4) {
                    arityError(parentOp);
              }
              block.token[kind] = parentBlock.operands[0];
            }
            
            // extends - first operand is the parent class
            else if (kind === 'extends') {
              if (parentBlock.operands.length === 0) arityError(parentOp);
              block.token.extends = parentBlock.operands[0];
            }
        
            // check param names
            let paramTokens = parentBlock.operands;
            if (kind === 'each' || kind === 'map' || kind === 'extends') {
              paramTokens = paramTokens.slice(1);
            }
            for (let j = 0; j < paramTokens.length; j++) {
              let tj = paramTokens[j];
              checkValidName(tj, parentOp, 'invalid parameter name');
              if ((kind === 'each' || kind === 'map') &&
                  (tj.name === 'ops' || tj.name === 'rest')) {
                syntaxError(tj, `invalid ${tj.name} parameter`);
              }
              else if (tj.name === 'ops') {
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
          block.assign.push(tokenPosn(tkn, tkn.value === '#=' ? '({' : '['));
          const lhsNames = new Set();
          block.operands.forEach(o => {
            checkValidName(o, tkn,
              'invalid variable name on left-hand side of assignment');
            lhsNames.add(o.name);
            block.variables.add(o.name);
            block.assign.push(o.name, ',');
          });
          if (lhsNames.size < block.operands.length) {
            syntaxError(tkn,
              'duplicate variable name on left-hand side of assignment');
          }
          block.assign.push(tokenPosn(tkn,
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
            checkValidName(lhs, tkn,
              'invalid variable name on left-hand side of assignment');
            block.assign.push(lhs, tokenPosn(tkn, ' = '));
          }
           
          // conditional assign or use ops
          else if (tkn.value === '?=' || tkn.value === '<-') {
            checkValidName(lhs, tkn,
              'invalid variable name on left-hand side of assignment');
            if (tkn.value === '<-') block.variables.add(lhs.name);
            block.assign.push(
              lhs.name,
              tokenPosn(tkn, (tkn.value === '<-' ? ' = ops.' : ' = ')),
              lhs.name,
              tokenPosn(tkn, ' ?? (')
            );
          }
          
          // standard assign or update-assign - to a variable or a property
          else {
            let settingVariable = false;
            if (currentOp) {
              if (!lhsSetterOps.has(currentOp.value)) {
                syntaxError(tkn, 'invalid left-hand side of assignment');
              }
            }
            else if (!(!Array.isArray(lhs) && lhs.type === 'property')) {  // not a property
              checkValidName(lhs, tkn, 'invalid left-hand side of assignment');
              settingVariable = true;
            }
            if (tkn.value === '=' && settingVariable) {
              block.variables.add(lhs.name);
            }
            block.assign.push(lhs, tokenPosn(tkn,
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

      // export statement
      if (baseBlock.export.size) {
        addToStart.push(
          pointToStart(`export var ${[...baseBlock.export].join(', ')};\n`));
      }
        
      // import statements
      if (baseBlock.import.length) {
        addToStart.push(baseBlock.import);
      }

      // wrapper iife
      if (options.iife !== 'none') {
        addToStart.push(`(${options.iife === 'async' ? 'async ' : ''
          }() => {\n'use strict'; return `);
        baseTree.push('\n})();');
      }

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