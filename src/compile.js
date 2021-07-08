////////////////////////////////////////////////////////////////////////////////
// Compile Zap to JavaScript.
////////////////////////////////////////////////////////////////////////////////

import sourceMapObject from '../node_modules/source-map/dist/source-map.js';
const { SourceNode } = sourceMapObject;
import { lexer } from './lexer.js'
import { parseStatement } from './parse-statement.js';

export function compile(zapCode, options) {

  const sourceMap = new SourceNode(1, 0, options.sourceFile, '');
  const tokenGroups = lexer(zapCode).reverse();
  
  function addJS(js, line, column) {
    sourceMap.add(
      line === undefined
        ? js
        : new SourceNode(line, column, options.sourceFile, js)
    );
  }

  // loop over token groups
  while (tokenGroups.length) {
    parseStatement(tokenGroups, addJS);
  }

  // return 
  return options.sourceFile
    ? sourceMap.toStringWithSourceMap()  // {code, map}
    : {code: sourceMap.toString()};

}