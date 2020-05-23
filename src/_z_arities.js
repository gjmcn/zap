// Commands that map directly to _z_ methods.

const m = new Map();

m.set('get',        [3, 3]);
m.set('set',        [3, 3]);
m.set('zip',        [1, Infinity]);
m.set('seq',        [3, 3]);
m.set('reduce',     [3, 3]);
m.set('group',      [2, 3]);
m.set('groupCount', [2, 3]);
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
m.set('deviation',  [1, 2]);
m.set('orderIndex', [1, 2]);
m.set('order',      [1, 2]);
m.set('some',       [2, 2]);
m.set('every',      [2, 2]);
m.set('filter',     [2, 2]);
m.set('count',      [2, 2]);
m.set('findIndex',  [2, 2]);
m.set('find',       [2, 2]);
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
m.set('ms',         [1, 1]);
m.set('ats',        [2, Infinity]);
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
m.set('neg', 	      [1, 1]);
m.set('boolean',   [1, 1]);
m.set('number',    [1, 1]);
m.set('string',    [1, 1]);
m.set('date',      [1, 1]);
m.set('isInteger', [1, 1]);
m.set('isFinite',  [1, 1]);
m.set('isNaN',     [1, 1]);
m.set('not',       [1, 1]);

// HTML convenience
[
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
  '$u', '$ul', '$var', '$video', '$wbr'
].forEach(opName => m.set(opName, [0, 1]));

// SVG convenience
[
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
  '$use', '$view'
].forEach(opName => m.set(opName, [0, 1]));

export default m;