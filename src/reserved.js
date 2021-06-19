export const reserved = {

  wordLiterals: new Set([
    'true', 'false', 'null', 'undefined', 'Infinity', 'NaN'
  ]),

  keywords: new Set([
    'end', 'break', 'continue', 'do', 'out', 'throw', 'let', 'be', 'set', 'opt',
    'to', 'def', 'incr', 'decr', 'by', 'if', 'elif', 'else', 'while', 'loop',
    'for', 'each', 'of', 'try', 'catch', 'finally', 'fun', 'proc', 'gen',
    'asyncFun', 'asyncProc', 'asyncGen', '@fun', '@proc', '@gen', '@asyncFun',
    '@asyncProc', '@asyncGen', 'par', 'class', 'extends', 'export', 'import',
    'from', 'as', 'debugger'
  ]),

  coreFunctions: new Set([

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
    'getter', 'setter', 'reduce', 'load', 'some', 'every', 'filter',
    'filterIndex', 'min', 'minIndex', 'max', 'maxIndex', 'sum', 'sumCumu',
    'count', 'find', 'findIndex', 'order', 'orderIndex', 'mean', 'group',
    'groupCount', 'bin', 'binCount', 'variance', 'variancePop', 'deviation',
    'deviationPop', 'arrObj', 'objArr', 'transpose', 'assign', 'shuffle',
    'period', 'at', 'range', 'linSpace', 'apply', 'call', 'print', 'ones',
    'zeros', 'empties', 'pick', 'mapAt', 'rank', 'quantile', 'median',
    'interpolate', 'innerJoin', 'outerJoin', 'leftJoin', 'rightJoin',
    'crossJoin', 'semiJoin', 'antiJoin', 'crush', 'covariance', 'covariancePop',
    'correlation'
  ]),

  invalid: new Set([
    'case', 'const', 'default', 'function', 'return', 'switch', 'var', 'with',
    'enum', 'implements', 'interface', 'package', 'private', 'protected',
    'public', 'static'
  ])

};