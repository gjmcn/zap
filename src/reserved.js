////////////////////////////////////////////////////////////////////////////////
// Reserved words.
////////////////////////////////////////////////////////////////////////////////

export const reserved = {};

reserved.wordLiterals = new Set([
  'true', 'false', 'null', 'undefined', 'Infinity', 'NaN'
]);

reserved.keywords = new Set([
  'end', '@end', 'break', 'continue', 'do', 'out', 'throw', 'print', 'let',
  'let_', 'let__', 'be', 'set', 'set_', 'set__', 'to', 'use', 'or', 'inc',
  'dec', 'by', 'block', 'if', 'elif', 'else', 'while', 'each', 'each_',
  'each__', 'awaitEach', 'awaitEach_', 'awaitEach__', 'of', 'loop', 'index',
  'try', 'catch', 'finally', 'fun', 'gen', 'asyncFun', 'asyncGen', '@fun',
  '@proc', '@gen', '@asyncFun', '@asyncProc', '@asyncGen', 'par', 'class',
  'extends', 'export', 'import', 'from', 'as', 'all', 'default', 'debugger'
]);

reserved.coreFunctions = new Set([

  // JavaScript operators with word-names
  'new', 'await', 'void', 'delete', 'typeof', 'in', 'instanceof', 'yield',
  'yieldFrom',
  
  // HTML/SVG
  'select', 'selectAll', 'insert', 'insertEach', 'into', 'encode',
  'encodeSVG', 'create', 'createSVG', 'fragment', 'attr', 'prop', 'style',
  'text', 'html', 'remove', 'lower', 'raise', 'addClass', 'removeClass',
  'toggleClass', 'hasClass', 'hasAttr', 'removeAttr', 'removeStyle', 'on',
  'off', 'sketch',
    
  // HTML convenience
  '$a', '$abbr', '$address', '$area', '$article', '$aside', '$audio', '$b',
  '$base', '$bdi', '$bdo', '$blockquote', '$body', '$br', '$button',
  '$canvas', '$caption', '$cite', '$code', '$col', '$colgroup', '$data',
  '$datalist', '$dd', '$del', '$details', '$dfn', '$dialog', '$div', '$dl',
  '$dt', '$em', '$embed', '$fieldset', '$figcaption', '$figure', '$footer',
  '$form', '$h1', '$h2', '$h3', '$h4', '$h5', '$h6', '$head', '$header',
  '$hgroup', '$hr', '$i', '$iframe', '$img', '$input', '$ins', '$kbd',
  '$label', '$legend', '$li', '$link', '$main', '$map', '$mark', '$menu',
  '$meta', '$meter', '$nav', '$noscript', '$object', '$ol', '$optgroup',
  '$option', '$output', '$p', '$param', '$picture', '$pre', '$progress', '$q',
  '$rb', '$rp', '$rt', '$rtc', '$ruby', '$s', '$samp', '$script', '$section',
  '$select', '$slot', '$small', '$source', '$span', '$strong', '$style',
  '$sub', '$summary', '$sup', '$table', '$tbody', '$td', '$template',
  '$textarea', '$tfoot', '$th', '$thead', '$time', '$title', '$tr', '$track',
  '$u', '$ul', '$var', '$video', '$wbr',
  
  // SVG convenience
  '$animate', '$animateMotion', '$animateTransform', '$circle', '$clipPath',
  '$defs', '$desc', '$discard', '$ellipse', '$feBlend', '$feColorMatrix',
  '$feComponentTransfer', '$feComposite', '$feConvolveMatrix',
  '$feDiffuseLighting', '$feDisplacementMap', '$feDistantLight',
  '$feDropShadow', '$feFlood', '$feFuncA', '$feFuncB', '$feFuncG', '$feFuncR',
  '$feGaussianBlur', '$feImage', '$feMerge', '$feMergeNode', '$feMorphology',
  '$feOffset', '$fePointLight', '$feSpecularLighting', '$feSpotLight',
  '$feTile', '$feTurbulence', '$filter', '$foreignObject', '$g', '$hatch',
  '$hatchpath', '$image', '$line', '$linearGradient', '$marker', '$mask',
  '$metadata', '$mpath', '$path', '$pattern', '$polygon', '$polyline',
  '$radialGradient', '$rect', '$set', '$solidcolor', '$stop', '$svg',
  '$switch', '$symbol', '$text','$textPath', '$tspan', '$use', '$view',
  
  // math
  'abs', 'acos', 'acosh', 'asin', 'asinh', 'atan', 'atanh', 'cbrt', 'ceil',
  'clz32', 'cos', 'cosh', 'exp', 'expm1', 'floor', 'fround', 'log', 'log10',
  'log1p', 'log2', 'round', 'sign', 'sin', 'sinh', 'sqrt', 'tan', 'tanh',
  'trunc',
  
  // is
  'isArray', 'isBigInt', 'isBoolean', 'isFinite', 'isFunction', 'isInteger',
  'isNaN', 'isNull', 'isNullish', 'isNumber', 'isString', 'isSymbol',
  'isUndefined',
  
  // random
  'random', 'randomInt', 'categorical', 'normal', 'logNormal', 'binomial',
  'exponential', 'geometric',

  // sets
  'difference', 'intersection', 'union',

  // other
  'array', 'call', 'getter', 'setter', 'reduce', 'load', 'some', 'every',
  'filter', 'map', 'filterIndex', 'min', 'minIndex', 'max', 'maxIndex', 'sum',
  'sumCumu', 'count', 'find', 'findIndex', 'order', 'orderIndex', 'mean',
  'group', 'groupCount', 'bin', 'binCount', 'variance', 'variancePop',
  'deviation', 'deviationPop', 'arrObj', 'objArr', 'transpose', 'shuffle',
  'period', 'at', 'range', 'linSpace', 'prt', 'ones', 'zeros', 'empties',
  'pick', 'mapAt', 'rank', 'quantile', 'median', 'interpolate', 'innerJoin',
  'outerJoin', 'leftJoin', 'rightJoin', 'crossJoin', 'semiJoin', 'antiJoin',
  'crush', 'covariance', 'covariancePop', 'correlation'
]);

reserved.invalid = new Set([
  'case', 'const', 'for', 'function', 'return', 'switch', 'with',
  'enum', 'implements', 'interface', 'package', 'private', 'protected',
  'public', 'static', 'var'
]);

reserved.nonKeywords = new Set([
  ...reserved.wordLiterals,
  ...reserved.coreFunctions,
  ...reserved.invalid
]);