ace.define("ace/mode/zap",["require", "exports", "module", "ace/mode/text", "ace/lib/oop"], function(require, exports, module) {
  
  "use strict";
  
  var oop = require("../lib/oop");
  var TextMode = require("./text").Mode;

  // hacky: add highlight rules directly - prevents Firefox require error 
  var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
  var ZapHighlightRules = function() {
    this.$rules = {
      "start" : [
        { token: 'comment', regex: /\/\/.*/ },
        { token: 'constant.numeric', regex: /0[bB][01]+n?|0[oO][0-7]+n?|0[xX][\da-fA-F]+n?|0n|[1-9]\d*n|(?:\.\d+|\d+(?:\.\d*)?)(?:e[+\-]?\d+)?/ },
        { token: 'string', regex: /'[^'\\]*(?:\\.[^'\\]*)*'/ },
        { token: 'string', regex: /"/, next: "multistring" },
        { token: 'string.regexp', regex: /&\/(?!\/)[^\/\\]*(?:\\.[^\/\\]*)*\/[\w$]*/ },
        { token: 'constant.language', regex: /(?:true|false|null|undefined|Infinity|NaN)(?![\w$])/ },
        { token: 'variable.language', regex: /(?:super|this)(?![\w$])/ },
        { token: 'keyword', regex: /\$(?:new|await(?:Each|Map|Try)?|ms|void|delete|typeof|instanceof|in|yieldFrom|yield|if|each|map|async(?:Do|While|Fun|Proc|Gen|Scope)|do|while|fun|proc|gen|scope|loop|nest(?:Each|Map)?|seq|to|linSpace|call|apply|throw|try|debugger|print|reduce|some|every|filter|minIndex|min|maxIndex|max|sumCumu|sum|count|findIndex|find|orderIndex|order|mean|groupCount|group|binCount|bin|variance|deviation|arrObj|objArr|transpose|class|extends|assign|attach|pick|into|insertEach|insert|encodeSVG|encode|createSVG|create|fragment|attr|prop|style|text|html|remove|lower|raise|addClass|removeClass|hasClass|hasAttr|removeAttr|removeStyle|on|off|sketch|abs|acos|acosh|asin|asinh|atan|atanh|cbrt|ceil|clz32|cos|cosh|exp|expm1|floor|fround|log|log10|log1p|log2|round|sign|sin|sinh|sqrt|tan|tanh|trunc|toUpperCase|toLowerCase|trim|trimEnd|trimStart|neg|boolean|number|string|date|isInteger|isFinite|isNaN|not|array|at|get|set|random|randomInt|categorical|normal|logNormal|binomial|exponential|geometric|shuffle|export|import|importAs|importDefault|importAll|a|abbr|address|area|article|aside|audio|b|bdi|bdo|blockquote|br|button|canvas|caption|cite|code|col|colgroup|datalist|dd|del|details|dfn|dialog|div|dl|dt|em|embed|fieldset|figcaption|figure|footer|form|h1|h2|h3|h4|h5|h6|header|hgroup|hr|i|iframe|img|input|ins|kbd|label|legend|li|link|main|mark|menu|meta|meter|nav|noscript|ol|optgroup|option|output|p|picture|pre|progress|q|rb|rp|rt|rtc|ruby|s|samp|script|section|select|slot|small|source|span|strong|sub|summary|sup|table|tbody|td|template|textarea|tfoot|th|thead|time|title|tr|track|u|ul|var|video|wbr|animate|animateMotion|animateTransform|circle|clipPath|defs|desc|discard|ellipse|feBlend|feColorMatrix|feComponentTransfer|feComposite|feConvolveMatrix|feDiffuseLighting|feDisplacementMap|feDistantLight|feDropShadow|feFlood|feFuncA|feFuncB|feFuncG|feFuncR|feGaussianBlur|feImage|feMerge|feMergeNode|feMorphology|feOffset|fePointLight|feSpecularLighting|feSpotLight|feTile|feTurbulence|foreignObject|g|hatch|hatchpath|image|line|linearGradient|marker|mask|metadata|mpath|path|pattern|polygon|polyline|radialGradient|rect|solidcolor|stop|svg|symbol|textPath|tspan|use|view)(?![\w$])/ },
        { token: 'identifier', regex: /[a-zA-Z_$][\w$]*/ },
        { token: 'punctuation', regex: /[(){}\[\];,]/ },
        { token: 'keyword', regex: /`?(?:[+\-*/%\^?\\=@#<>!]?=|->|[+\-*/%\^\\!~]|<\\|\|\||&&|<[>\-]?|><|>|@{1,2}|#{1,2}|\?{1,2}|[=?]?:)`?(?![+\-*%<>=!?\\#@:\|\^`~]|\/(?:$|[^/])|&&)/ },
      ],
      "multistring": [
        { token: 'string', regex: /[^"\\]*(?:\\.[^"\\]*)*"/, next: "start" }, { defaultToken : "string" }
      ]
    }
  };
  oop.inherits(ZapHighlightRules, TextHighlightRules);

  var CstyleBehaviour = require("./behaviour/cstyle").CstyleBehaviour;
  
  var Mode = function() {
    this.HighlightRules = ZapHighlightRules;
    this.$behaviour = new CstyleBehaviour();
  };
  oop.inherits(Mode, TextMode);  
  (function() { this.lineCommentStart = "//" }).call(Mode.prototype);
  exports.Mode = Mode;
  
});