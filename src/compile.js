////////////////////////////////////////////////////////////////////////////////
// Compile Zap to JavaScript.
////////////////////////////////////////////////////////////////////////////////

import sourceMapObject from 'source-map';
const { SourceNode } = sourceMapObject;
import { lexer } from './lexer.js'
import { parseStatement } from './parse-statement.js';

export function compile(zapCode, {sourceFile}) {

  const sourceMap = new SourceNode(1, 0, sourceFile, '');
  const components = lexer(zapCode).reverse();
  
  function addJS(js, line, column) {
    sourceMap.add(
      js.$$$isSourceNode$$$ || line === undefined  // already a source node or no line and column info
        ? js
        : new SourceNode(line, column, sourceFile, js)
    );
  }

  // loop over components
  while (components.length) {
    parseStatement(components, addJS);
  }

  // return 
  return sourceFile
    ? sourceMap.toStringWithSourceMap()  // {code, map}
    : {code: sourceMap.toString()};

}