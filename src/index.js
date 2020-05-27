import lexer from './lexer.js';
import blocks from './blocks.js';
import parse from './parse.js';

// compile zap code; returns object with some/all properties:
// tokens, procTokens, jsTree, sourceMap, js
export default (code, {
    tokens     = false,  // return tokens 
    procTokens = false,  // return tokens after processing blocks 
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
    
    const pTkns = blocks(tkns);
    if (procTokens) result.procTokens = pTkns;
    
    if (sourceMap || jsTree || js) {
      Object.assign(result,
        parse(pTkns, {sourceMap, sourceFile, jsTree, js, asyncIIFE}));
    }
  
  }

  return result;

};