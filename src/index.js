import lexer from './lexer.js';
import processTokens from './process-tokens.js';
import parse from './parse.js';

// compile zap code; returns object with some/all properties:
// tokens, procTokens, jsTree, sourceMap, js
export default (code, {
    tokens     = false,  // return tokens 
    procTokens = false,  // return processed tokens 
    sourceMap  = false,  // return source map
    sourceFile = null,   // used for source map 
    jsTree     = false,  // return JS tree 
    js         = true,   // return generated JS
    asyncIIFE  = false   // wrapper IIFE is async
  } = {}) => {

  const result = {};

  const tkns = lexer(code);
  if (tokens) result.tokens = tkns;

  if (procTokens || sourceMap || jsTree || js) {
    
    const procTkns = processTokens(tkns);
    if (procTokens) result.procTokens = procTkns;
    
    if (sourceMap || jsTree || js) {
      Object.assign(result,
        parse(procTkns, {sourceMap, sourceFile, jsTree, js, asyncIIFE}));
    }
  
  }

  return result;

};