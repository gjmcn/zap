// Commands that map directly to _z_ methods.

const m = new Map();

m.set('at',         [2, 3]);
m.set('chg',        [3, 3]);
m.set('getter',     [3, 3]);
m.set('setter',     [3, 3]);
m.set('to',         [2, 3]);
m.set('linSpace',   [3, 3]);
m.set('reduce',     [3, 3]);
m.set('pick',       [2, 2]);
m.set('mapAt',      [2, 3]);
m.set('group',      [1, 3]);
m.set('groupCount', [1, 3]);
m.set('bin',        [2, 4]);
m.set('binCount',   [2, 4]);
m.set('sumCumu',    [1, 2]);
m.set('sum',        [1, 2]);
m.set('mean',       [1, 2]);
m.set('minIndex',   [1, 2]);
m.set('maxIndex',   [1, 2]);
m.set('min',        [1, 2]);
m.set('max',        [1, 2]);
m.set('variance',   [1, 2]);
m.set('variancePop',[1, 2]);
m.set('deviation',  [1, 2]);
m.set('deviationPop',[1, 2]);
m.set('median',     [1, 3]);
m.set('quantile',   [2, 4]);
m.set('interpolate',[3, 3]);
m.set('orderIndex', [1, 3]);
m.set('order',      [1, 3]);
m.set('rank',       [1, 3]);
m.set('some',       [1, 2]);
m.set('every',      [1, 2]);
m.set('filter',     [1, 2]);
m.set('filterIndex',[1, 2]);
m.set('innerJoin',      [3, 4]);
m.set('outerJoin',      [3, 4]);
m.set('leftJoin',       [3, 4]);
m.set('rightJoin',      [3, 4]);
m.set('semiJoin',       [3, 4]);
m.set('antiJoin',       [3, 4]);
m.set('crossJoin',      [2, 3]);
m.set('flatten',        [1, Infinity]);
m.set('covariance',     [3, 3]);
m.set('covariancePop',  [3, 3]);
m.set('correlation',    [3, 3]);
m.set('count',      [1, 2]);
m.set('findIndex',  [1, 2]);
m.set('find',       [1, 2]);
m.set('print',      [1, 1]);
m.set('arrObj',     [1, 2]);
m.set('objArr',     [1, 2]);
m.set('transpose',  [1, 1]);
m.set('random',     [0, 3]);
m.set('randomInt',  [0, 3]);
m.set('categorical',[1, 2]);
m.set('normal',     [0, 3]);
m.set('logNormal',  [0, 3]);
m.set('binomial',   [1, 3]);
m.set('exponential',[1, 2]);
m.set('geometric',  [0, 2]);
m.set('shuffle',    [1, 1]);
m.set('period',     [1, 2]);
m.set('ones',       [1, Infinity]);
m.set('zeros',      [1, Infinity]);
m.set('empties',    [1, Infinity]);
m.set('difference', [0, Infinity]);
m.set('intersection', [0, Infinity]);
m.set('union',      [0, Infinity]);
m.set('select',     [1, 2]);
m.set('selectAll',  [1, 2]);
m.set('insert',     [2, 3]);
m.set('insertEach', [2, 3]);
m.set('into',       [2, 3]);
m.set('encode',     [2, 3]);
m.set('encodeSVG',  [2, 3]);
m.set('create',     [1, 2]);
m.set('createSVG',  [1, 2]);
m.set('attr',       [2, 3]);
m.set('prop',       [2, 3]);
m.set('style',      [2, 3]);
m.set('text',       [1, 2]);
m.set('html',       [1, 2]);
m.set('remove',     [1, 1]);
m.set('lower',      [1, 1]);
m.set('raise',      [1, 1]);
m.set('addClass',   [2, 2]);
m.set('removeClass',[2, 2]);
m.set('toggleClass',[2, 2]);
m.set('hasClass',   [2, 2]);
m.set('hasAttr',    [2, 2]);
m.set('removeAttr', [2, 2]);
m.set('removeStyle',[2, 2]);
m.set('on',         [3, 4]);
m.set('off',        [3, 4]);
m.set('sketch',     [0, 1]);

// entrywise operators
m.set('abs',    [1, 1]);
m.set('acos',   [1, 1]);
m.set('acosh',  [1, 1]);
m.set('asin',   [1, 1]);
m.set('asinh',  [1, 1]);
m.set('atan',   [1, 1]);
m.set('atanh',  [1, 1]);
m.set('cbrt',   [1, 1]);
m.set('ceil',   [1, 1]);
m.set('clz32',  [1, 1]);
m.set('cos',    [1, 1]);
m.set('cosh',   [1, 1]);
m.set('exp',    [1, 1]);
m.set('expm1',  [1, 1]);
m.set('floor',  [1, 1]);
m.set('fround', [1, 1]);
m.set('log',    [1, 1]);
m.set('log10',  [1, 1]);
m.set('log1p',  [1, 1]);
m.set('log2',   [1, 1]);
m.set('round',  [1, 1]);
m.set('sign',   [1, 1]);
m.set('sin',    [1, 1]);
m.set('sinh',   [1, 1]);
m.set('sqrt',   [1, 1]);
m.set('tan',    [1, 1]);
m.set('tanh',   [1, 1]);
m.set('trunc',  [1, 1]);
m.set('toUpperCase', [1, 1]);
m.set('toLowerCase', [1, 1]);
m.set('trim',        [1, 1]);
m.set('trimEnd',     [1, 1]);
m.set('trimStart',   [1, 1]);
m.set('neg', 	   [1, 1]);
m.set('boolean',   [1, 1]);
m.set('number',    [1, 1]);
m.set('string',    [1, 1]);
m.set('date',      [1, 1]);
m.set('isInteger', [1, 1]);
m.set('isFinite',  [1, 1]);
m.set('isNaN',     [1, 1]);
m.set('not',       [1, 1]);
m.set('isBigInt',    [1, 1]);
m.set('isBoolean',   [1, 1]);
m.set('isFunction',  [1, 1]);
m.set('isNull',      [1, 1]);
m.set('isNullish',   [1, 1]);
m.set('isNumber',    [1, 1]);
m.set('isString',    [1, 1]);
m.set('isSymbol',    [1, 1]);
m.set('isUndefined', [1, 1]);

// HTML convenience
[ '$a', '$abbr', '$address', '$area', '$article', '$aside', '$audio', '$b',
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
  '$u', '$ul', '$var', '$video', '$wbr'
].forEach(opName => m.set(opName, [0, 1]));

// SVG convenience
[ '$animate', '$animateMotion', '$animateTransform', '$circle', '$clipPath',
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
  '$switch', '$symbol', '$text','$textPath', '$tspan', '$use', '$view'
].forEach(opName => m.set(opName, [0, 1]));

export default m;