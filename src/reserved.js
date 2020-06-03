const reserved = {

  wordLiterals: new Set([
    'true', 'false', 'null', 'undefined', 'Infinity', 'NaN'
  ]),

  commands: new Set([

    // JavaScript operators with word-names
    'new', 'await', 'void', 'delete', 'typeof', 'in', 'instanceof', 'yield',
    'yieldFrom',
    
    // HTML/SVG
    'pick', 'insert', 'insertEach', 'into', 'encode', 'encodeSVG', 'create',
    'createSVG', 'fragment', 'attr', 'prop', 'style', 'text', 'html', 'remove',
    'lower', 'raise', 'addClass', 'removeClass', 'hasClass', 'hasAttr',
    'removeAttr', 'removeStyle', 'on', 'off', 'sketch',
     
    // HTML convenience
    '$a', '$abbr', '$address', '$area', '$article', '$aside', '$audio', '$b',
    '$bdi', '$bdo', '$blockquote', '$br', '$button', '$canvas', '$caption',
    '$cite', '$code', '$col', '$colgroup', '$datalist', '$dd', '$del',
    '$details', '$dfn', '$dialog', '$div', '$dl', '$dt', '$em', '$embed',
    '$fieldset', '$figcaption', '$figure', '$footer', '$form', '$h1', '$h2',
    '$h3', '$h4', '$h5', '$h6', '$header', '$hgroup', '$hr', '$i', '$iframe',
    '$img', '$input', '$ins', '$kbd', '$label', '$legend', '$li', '$link',
    '$main', '$mark', '$menu', '$meta', '$meter', '$nav', '$noscript', '$ol',
    '$optgroup', '$option', '$output', '$p', '$picture', '$pre', '$progress',
    '$q', '$rb', '$rp', '$rt', '$rtc', '$ruby', '$s', '$samp', '$script',
    '$section', '$select', '$slot', '$small', '$source', '$span', '$strong',
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
    '$feTile', '$feTurbulence', '$foreignObject', '$g', '$hatch', '$hatchpath',
    '$image', '$line', '$linearGradient', '$marker', '$mask', '$metadata',
    '$mpath', '$path', '$pattern', '$polygon', '$polyline', '$radialGradient',
    '$rect', '$solidcolor', '$stop', '$svg', '$symbol', '$textPath', '$tspan',
    '$use', '$view',
    
    // entrywise math
    'abs', 'acos', 'acosh', 'asin', 'asinh', 'atan', 'atanh', 'cbrt', 'ceil',
    'clz32', 'cos', 'cosh', 'exp', 'expm1', 'floor', 'fround', 'log', 'log10',
    'log1p', 'log2', 'round', 'sign', 'sin', 'sinh', 'sqrt', 'tan', 'tanh',
    'trunc',
    
    // entrywise other
    'toUpperCase', 'toLowerCase', 'trim', 'trimEnd', 'trimStart', 'neg',
    'boolean', 'number', 'string', 'date', 'isInteger', 'isFinite', 'isNaN',
    'not',
    
    // random
    'random', 'randomInt', 'categorical', 'normal', 'logNormal', 'binomial',
    'exponential', 'geometric',
    
    // function
    'fun', 'proc', 'gen', 'scope', 'as', 'each', 'map', 'try', 'catch',
    'asyncFun', 'asyncProc', 'asyncGen', 'asyncScope', 'asyncAs', 'asyncEach',
    'asyncMap', 'asyncTry', 'asyncCatch', 'class', 'extends',

    // other
    'array', 'getter', 'setter', 'set', 'if', 'seq', 'throw', 'debugger',
    'reduce', 'some', 'every', 'filter', 'min', 'minIndex', 'max', 'maxIndex',
    'sum', 'sumCumu', 'count', 'find', 'findIndex', 'order', 'orderIndex',
    'mean', 'group', 'groupCount', 'bin', 'binCount', 'variance', 'deviation',
    'arrObj', 'objArr', 'transpose', 'assign', 'attach', 'shuffle', 'export',
    'import', 'importAs', 'importDefault', 'importAll', 'period', 'at', 'to',
    'linSpace', 'apply', 'call', 'print', 'while', 'do'

  ]),

  invalid: new Set([
    'break', 'const', 'continue', 'default', 'else', 'finally', 'for',
    'function', 'let', 'return', 'switch', 'var', 'with', 'enum', 'implements',
    'interface', 'package', 'private', 'protected', 'public', 'static', '_z_',
    '_z_v', '_z_i', '_z_x', '_z_m'
  ])

};

reserved.nonCommands =
  new Set([...reserved.wordLiterals, ...reserved.invalid]);

export default reserved;