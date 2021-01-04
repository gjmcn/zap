import reserved from './reserved.js';
const {wordLiterals, commands, invalid, nonCommands} = reserved;

import _z_arities from './_z_arities.js';

// groups of operators
const repeatOps = new Set([
  '+', '-', '*', '/', '%', '^', '&&', '||', '??', '<>', '><'
]);
const binaryOps = new Set(['<', '<=', '>', '>=', '==', '!=']);
const unquotedOps = new Set([  // not including method call ops
  '#', '##'
]);

// errors
function errorStem(operator) {
  return `Zap syntax at ${operator.line}:${operator.column + 1}, operator: ${
    operator.value}, `;
}
function arityError(operator) {
  return Error(`${errorStem(operator)}invalid number of operands`);
}
function operandError(operator, i, n) {
  return Error(`${errorStem(operator)}operand ${i + 1} of ${n} is invalid`);
}
function rightOperandError(operator) {
  return Error(`${errorStem(operator)}no right operand`);
}
function topLevelError(operator) {
  return Error(`${errorStem(operator)}can only be used at top-level scope`);
}
function multipleExportError(operator) {
  return Error(`${errorStem(operator)}can only be used once`);
}
function duplicateNameError(operator) {
  return Error(`${errorStem(operator)}duplicate name`);
}

// apply current operator of block
export default (block, _z_used) => {

  const {operator, position} = block;
  const x = block.operands;
  const op = operator.value;
  const xTypes = x.map(xi => Array.isArray(xi) ? null : xi.type);
  const nx = x.length;
  
  // what type of op?
  let callingMethod, callingFunction, isCommand, otherOp;
  if (op === '~' || op === '<~') callingMethod = true;
  else if (op === '\\' || op === '<\\') callingFunction = true;
  else if (commands.has(op)) isCommand = true;
  else otherOp = true;
  
  // check operands for invalid identifiers
  for (let i = 0; i < nx; i++) {
    if (xTypes[i] === 'identifier' && invalid.has(x[i].name) && (
        !(callingMethod && i === position) &&
        !(otherOp && unquotedOps.has(op)))) {
      throw operandError(operator, i, nx);
    }
  }

  function isVariableName(i) {
    return xTypes[i] === 'identifier' && !nonCommands.has(x[i].name);
  }

  function validateImportPath(i) {
    if (xTypes[i] !== 'string') throw operandError(operator, i, nx);
    return x[i].js;
  }

  // ----- return an array representing application of the operator -----

  // token object with given js, and line and column of operator
  function opPosn(js) {
    return {
      js,
      line: operator.line,
      column: operator.column,
    };
  }

  // add entries of y to r; separate the entries by comma tokens
  //  - if close truthy, add closing parenthesis token at end
  function addToResult(y, r, close) {
    if (y.length) {
      for (let yi of y) r.push(yi, ',');
      close ? (r[r.length - 1] = ')') : r.pop();
    }
    else if (close) {
      r.push(')');
    }
    return r;
  }

  // call _z_ method m with all operands (i.e. x), log that method used
  function call_z_method(m) {
    _z_used.add(m);
    return addToResult(x, [ opPosn(`_z_.${m}(`) ], 'close');
  }

  // other operators
  if (otherOp) {

    // backtick operators
    if (operator.preTick || operator.postTick) {
      if (nx !== 2) throw arityError(operator);
      let opSymbol, minMax;
      if (op === '^') opSymbol = '**';
      else if (op === '==' || op === '!=') opSymbol = op + '=';
      else if (op === '<>') minMax = '<';
      else if (op === '><') minMax = '>';
      else opSymbol= op;
      let s;
      if (operator.preTick && operator.postTick) {
        s = '((u, v) => {v = v[Symbol.iterator](); let r = [], t; for (let s of u) {if ((t = v.next()).done) break; r.push('
        s += minMax
          ? `t.value ${minMax} s ? t.value : s`
          : `s ${opSymbol} t.value`
        s += ')}; return r})(';
      }
      else {
        s = `((u, v) => {let r = []; for (let s of ${operator.preTick
            ? `u) r.push(${minMax ? `v ${minMax} s ? v : s` : `s ${opSymbol} v`})`
            : `v) r.push(${minMax ? `s ${minMax} u ? s : u` : `u ${opSymbol} s`})`
          }; return r})(`;
      }
      return addToResult(x, [ opPosn(s) ], 'close');
    }

    // repeat operators
    else if (repeatOps.has(op)) {

      // unary plus and minus
      if (nx === 1 && (op === '+' || op === '-')) {
        operator.js = op;
        return [ '(', operator, x[0], ')' ];
      }

      // 2 or more operands
      else {
        if (nx < 2) throw arityError(operator);
        let minMax, opSymbol, res;
        if (op === '<>') minMax = '<';
        else if (op === '><') minMax = '>';
        else opSymbol = operator.js = (op === '^' ? '**' : op);
        if (minMax) {
          res = [ opPosn( nx === 2
            ? `((x, y) => y ${minMax} x ? y : x)(`
            : `((...x) => {let r = x[0], j; for (j = 1; j < ${
                nx}; j++) if (x[j] ${minMax} r) r = x[j]; return r})(`
          ) ];
          addToResult(x, res, 'close');
        } 
        else {
          res =  [ '(', x[0], operator, x[1], ')' ];
          for (let i = 2; i < nx; i++) {
            res.unshift('(')
            res.push(opPosn(opSymbol), x[i], ')'); 
          }
        }
        return res;
      }

    }

    // binary operators
    else if (binaryOps.has(op)) {
      if (nx !== 2) throw arityError(operator);
      operator.js = (op === '==' || op === '!=' ? op + '=' : op);
      return [ '(', x[0], operator, x[1], ')' ];
    }

    // logical not
    else if (op === '!') {
      if (nx !== 1) throw arityError(operator);
      operator.js = '!';
      return [ '(', operator, x[0], ')' ];
    }

    // conditional
    else if (op === '?') {
      if (nx < 2 || nx > 3) throw arityError(operator);
      return [ '(', x[0], opPosn('?'), x[1], opPosn(':'),
        (nx === 3 ? x[2] : 'void 0'), ')' ];
    }

    // array or set literal
    else if (op === '@' || op === '@@') {
      const res = [ opPosn('[') ];
      addToResult(x, res).push(opPosn(']'));
      if (op === '@@') {
        res.unshift(opPosn('(new Set('));
        res.push('))');
      }
      return res;
    }

    // get property
    else if (op.slice(-1) === ':') {
      if (nx !== 2) throw arityError(operator);
      let extra = '';
      if (op === '?:') {
        extra = '?.'
      }
      else if (op === '::') {
        extra = '["prototype"]';
      }  
      return [ x[0], opPosn(`${extra}[`), x[1], ']' ];
    }
 
    // ops that accept identifiers as property names
    else if (unquotedOps.has(op)) {
      
      function checkNotReserved(i) {
        if (xTypes[i] === 'identifier' && invalid.has(x[i].name)) {
          throw operandError(operator, i, nx);
        }
      }

      // object literal
      if (op === '#') {
        if (nx % 2) throw arityError(operator);
        const res = [ opPosn('({') ];
        for (let i = 0; i < nx; i += 2) {
          checkNotReserved(i + 1);
          if (xTypes[i] === 'identifier') {
            res.push('"', x[i], '"');
          }
          else if (xTypes[i] === 'string' || xTypes[i] === 'number') {
            res.push(x[i]);
          }
          else {
            res.push('[', x[i], ']');
          }
          res.push(':', x[i + 1], ',');
        }
        res.push(opPosn('})'));
        return res;
      }

      // map literal
      else {
        if (nx % 2) throw arityError(operator);
        const res = [ opPosn('(new Map([') ];
        for (let i = 0; i < nx; i += 2) {
          checkNotReserved(i + 1);
          res.push('[');
          (xTypes[i] === 'identifier' && !wordLiterals.has(x[i].name))
            ? res.push('"', x[i], '"')
            : res.push(x[i]);
          res.push(',', x[i + 1], '],');
        }
        res.push(opPosn(']))'));
        return res;
      }

    }

  }

  // calling function or method
  else if (callingFunction || callingMethod) {

    if (position >= nx) throw rightOperandError(operator);
    const args = x.slice(0, position).concat(x.slice(position + 1));
    
    // standard function
    if (callingFunction) {
      let res;
      if (op === '\\') {
        res = [ x[position], '(' ];
      }
      else {  // <\
        if (nx === 1) throw arityError(operator);
        res = [ 
          opPosn('((f, ...a) => {f(...a); return a[0]})('), x[position], ','
        ];
      }
      return addToResult(args, res, 'close');
    }

    // method
    else {
      if (nx < 2) throw arityError(operator);
      let methodName, res;
      if (xTypes[position] === 'identifier') {
        methodName = [ '"', x[position], '"' ];
      }
      else {
        methodName = [ x[position] ];
      }
      if (op === '~') {
        res = [ args[0], opPosn('['), ...methodName, opPosn('](') ];
      }
      else {  // <~
        const methodArg = args.length > 1 ? '...a' : '';
        res = [
          opPosn(`((o, m${methodArg ? `, ${methodArg}`: ''}) => {o[m](${
            methodArg}); return o})(`),
          args[0], ',', ...methodName
        ];
        if (methodArg) res.push(',');
      }
      return addToResult(args.slice(1), res, 'close');
    }

  }

  // command
  else {

    if (_z_arities.has(op)) {
      const [mn, mx] = _z_arities.get(op);
      if (nx < mn || nx > mx ) throw arityError(operator);
      return call_z_method(op);
    }

    else if (op === 'attach') {
      if (nx < 2) throw arityError(operator);
      const names = new Set();
      let s = '((o';
      for (let i = 1; i < nx; i++) {
        if (!isVariableName(i)) throw operandError(operator, i, nx);
        names.add(x[i].name);
        s += `,v${i}`;
      }
      if (names.size < nx - 1) throw duplicateNameError(operator);
      s += ') => {';
      for (let i = 1; i < nx; i++) s += `o.${x[i].name}=v${i};`;
      s += 'return o})(';
      return addToResult(x, [ opPosn(s) ], 'close');
    }

    else if (op === 'new') {
      if (nx === 0) throw arityError(operator);
      const res = [ opPosn('(new ('), x[0], opPosn(')(') ];
      addToResult(x.slice(1), res);
      res.push('))');
      return res;
    }

    else if (op === 'in' || op === 'instanceof') {
      if (nx !== 2) throw arityError(operator);
      operator.js = op;
      return [ '(', x[0], ' ', operator, ' ', x[1], ')' ];
    }

    else if (op === 'delete') {
      if (nx !== 2) throw arityError(operator);
      operator.js = 'delete';
      return [ '(', operator, ' ', x[0], '[', x[1], '])' ];
    }

    else if (op === 'await' || op === 'void' || op === 'typeof' || 
        op === 'yield' || op === 'yieldFrom') {
      if (nx !== 1) throw arityError(operator);
      operator.js = (op === 'yieldFrom') ? 'yield*' : op;
      if (op === 'await') block.awaitUsed = true;
      else if (op === 'yield' || op === 'yieldFrom') block.yieldUsed = true;
      return [ '(', operator, ' ', x[0], ')' ];
    }

    else if (op === 'if') {
      if (nx % 2 || nx < 2) throw arityError(operator);
      const res = [ '(' ];
      for (let i = 0; i < nx; i += 2) {
        res.push(x[i], opPosn('?'), x[i + 1], opPosn(':'));
      }
      res.push('void 0)');
      return res;
    }

    else if (op === 'stop') {
      if (nx) throw arityError(operator);
      block.stopUsed = true;
      return [ opPosn('(_z_s = 1, void 0)') ];
    }

    else if (op === 'call') {
      if (!nx) throw arityError(operator);
      const res = [ x[0], opPosn('(') ];
      return addToResult(x.slice(1), res, 'close');
    }
    
    else if (op === 'apply') {
      let res;
      if (nx === 1) res = [ x[0], opPosn('()') ];
      else if (nx === 2) res = [ x[0], opPosn('(...'), x[1], ')' ];
      else throw arityError(operator);
      return res;
    }

    else if (op === 'throw') {
      if (nx !== 1) throw arityError(operator);
      return [ opPosn('(e => {throw e})('), x[0], ')' ];
    }

    else if (op === 'debugger') {
      if (nx) throw arityError(operator);
      return [ opPosn('(() => {debugger})()') ];
    }
    
    else if (op === 'assign') {
      if (nx < 2) throw arityError(operator);
      const res = [ opPosn('Object.assign(') ];
      return addToResult(x, res, 'close');
    }

    else if (op === 'fragment') {
      if (nx) throw arityError(operator);
      return [ opPosn('document.createDocumentFragment()') ];
    }

    else if (op === 'load') {
      if (nx !== 1) throw arityError(operator);
      return [ opPosn('import('), x[0], ')' ];
    }

    else if (op === 'import') {
      if (block.token) throw topLevelError(operator);
      if (!nx) throw arityError(operator);
      const src = validateImportPath(0);
      if (nx === 1) {
        block.import.push([ opPosn(`import ${src};\n`) ]);
      }
      else {
        for (let i = 1; i < nx; i++) {
          if (!isVariableName(i)) throw operandError(operator, i, nx);
        }
        block.import.push([ opPosn(`import {${
          x.slice(1).map(tkn => tkn.js).join(', ')}} from ${src};\n`) ]);
      }
      return [ opPosn('(void 0)') ];
    }

    else if (op === 'importAs') {
      if (block.token) throw topLevelError(operator);
      if (nx < 3 || nx % 2 === 0) throw arityError(operator);
      const src = validateImportPath(0);
      const variableList = [];
      for (let i = 1; i < nx; i += 2) {
        if (!isVariableName(i)) throw operandError(operator, i, nx);
        if (!isVariableName(i + 1)) throw operandError(operator, i + 1, nx);
        variableList.push(`${x[i].js} as ${x[i + 1].js}`);
      }
      block.import.push([
        opPosn(`import {${variableList.join(', ')}} from ${src};\n`)
      ]);
      return [ opPosn('(void 0)') ];
    }

    else if (op === 'importDefault' || op === 'importAll') {
      if (block.token) throw topLevelError(operator);
      if (nx !== 2) throw arityError(operator);
      const src = validateImportPath(0);
      if (!isVariableName(1)) throw operandError(operator, 1, nx);
      let s = 'import ';
      if (op === 'importAll') s += '* as ';
      block.import.push([ opPosn(s + `${x[1].js} from ${src};\n`) ]);
      return [ opPosn('(void 0)') ];
    }

    else if (op === 'export') {
      if (block.token) throw topLevelError(operator);
      if (block.export.size) throw multipleExportError(operator);
      if (!nx) throw arityError(operator);
      x.forEach((xi, i) => {
        if (!isVariableName(i)) throw operandError(operator, i, nx);
        if (block.export.has(xi.js)) throw duplicateNameError(operator);
        block.export.add(xi.js);
      });
      return [ opPosn('(void 0)') ];
    }

  }

};