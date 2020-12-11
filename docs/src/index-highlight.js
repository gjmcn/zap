'use strict';

const regexps = new Map([
  ['space', /\s+/y],
  ['comment', /\/\/.*/y ],
  ['number', /0[bB][01]+n?|0[oO][0-7]+n?|0[xX][\da-fA-F]+n?|0n|[1-9]\d*n|(?:\.\d+|\d+(?:\.\d*)?)(?:e[+\-]?\d+)?/y],
  ['string', /'[^'\\]*(?:\\.[^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"/y],
  ['regexp', /&\/(?!\/)[^\/\\]*(?:\\.[^\/\\]*)*\/[\w$]*/y],
  ['literal', /(?:true|false|null|undefined|Infinity|NaN|else)(?![\w$])/y],
  ['variable', /(?:super|this)(?![\w$])/y],
  ['keyword', /(?:new|await|period|void|delete|typeof|instanceof|in|yieldFrom|yield|if|async(?:Fun|Proc|Scope|As|Each|Map|Do|Try|Catch)|fun|proc|scope|as|each|map|do|try|catch|stop|to|linSpace|call|apply|print|throw|debugger|reduce|some|every|filter|minIndex|min|maxIndex|max|sumCumu|sum|count|findIndex|find|orderIndex|order|mean|groupCount|group|binCount|bin|variance|deviation|arrObj|objArr|transpose|class|extends|assign|attach|ones|zeros|empties|difference|intersection|union|select|selectAll|into|insertEach|insert|encodeSVG|encode|createSVG|create|fragment|attr|prop|style|text|html|remove|lower|raise|addClass|removeClass|toggleClass|hasClass|hasAttr|removeAttr|removeStyle|on|off|sketch|abs|acos|acosh|asin|asinh|atan|atanh|cbrt|ceil|clz32|cos|cosh|exp|expm1|floor|fround|log|log10|log1p|log2|round|sign|sin|sinh|sqrt|tan|tanh|trunc|toUpperCase|toLowerCase|trim|trimEnd|trimStart|neg|boolean|number|string|date|isInteger|isFinite|isNaN|not|isBigInt|isBoolean|isFunction|isNull|isNullish|isNumber|isString|isSymbol|isUndefined|pick|mapAt|interpolate|rank|filterIndex|quantile|median|array|at|chg|getter|setter|random|randomInt|categorical|normal|logNormal|binomial|exponential|geometric|shuffle|export|import|importAs|importDefault|importAll|load|\$(?:a|abbr|address|area|article|aside|audio|b|base|bdi|bdo|blockquote|body|br|button|canvas|caption|cite|code|col|colgroup|data|datalist|dd|del|details|dfn|dialog|div|dl|dt|em|embed|fieldset|figcaption|figure|footer|form|h1|h2|h3|h4|h5|h6|head|header|hgroup|hr|i|iframe|img|input|ins|kbd|label|legend|li|link|main|map|mark|menu|meta|meter|nav|noscript|object|ol|optgroup|option|output|p|param|picture|pre|progress|q|rb|rp|rt|rtc|ruby|s|samp|script|section|select|slot|small|source|span|strong|style|sub|summary|sup|table|tbody|td|template|textarea|tfoot|th|thead|time|title|tr|track|u|ul|var|video|wbr|animate|animateMotion|animateTransform|circle|clipPath|defs|desc|discard|ellipse|feBlend|feColorMatrix|feComponentTransfer|feComposite|feConvolveMatrix|feDiffuseLighting|feDisplacementMap|feDistantLight|feDropShadow|feFlood|feFuncA|feFuncB|feFuncG|feFuncR|feGaussianBlur|feImage|feMerge|feMergeNode|feMorphology|feOffset|fePointLight|feSpecularLighting|feSpotLight|feTile|feTurbulence|filter|foreignObject|g|hatch|hatchpath|image|line|linearGradient|marker|mask|metadata|mpath|path|pattern|polygon|polyline|radialGradient|rect|set|solidcolor|stop|svg|switch|symbol|text|textPath|tspan|use|view))(?![\w$])/y],
  ['identifier', /[a-zA-Z_$][\w$]*/y],
  ['operator', /`?(?:[+\-*/%\^?\\=@#<>!]?=|[+\-*/%\^\\!,;~]|\|\||&&|<[>\-\\~]?|><|>|@{1,2}|#{1,2}|\?{1,2}|[?:]?:)`?(?![+\-*%<>=!?\\#@:|\^`~,;]|\/(?:$|[^/])|&&)/y],
  ['punctuation', /[(){}\[\]|]/y],
]);

function spanWrap(value, cls) {
  return `<span class="zap-${cls}">${value}</span>`;
};

function untag(s) {
  return s.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const nextSpace = /\S+\s*/y;
      
// add spans to code
module.exports = code => {
  
  let index = 0;
  let match;
  let spanCode = '';

  // iterate over code
  codeLoop: while (index < code.length) {

    // iterate over token regexps
    for (let [type, reg] of regexps.entries()) {
      reg.lastIndex = index;
      match = reg.exec(code);
      if (match) {
        spanCode += (type === 'space')
          ? match[0]
          : spanWrap(untag(match[0]), type);
        index = reg.lastIndex;
        continue codeLoop;
      }
    }

    // jump past next whitespace if unrecognized token
    nextSpace.lastIndex = index;
    match = nextSpace.exec(code);
    spanCode += untag(match[0]);
    index = nextSpace.lastIndex;  

  }
  
  return spanCode;
};