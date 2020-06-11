(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,(function(r){var n=e[i][1][r];return o(n||r)}),p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){"use strict";const regexps=new Map([["space",/\s+/y],["comment",/\/\/.*/y],["number",/0[bB][01]+n?|0[oO][0-7]+n?|0[xX][\da-fA-F]+n?|0n|[1-9]\d*n|(?:\.\d+|\d+(?:\.\d*)?)(?:e[+\-]?\d+)?/y],["string",/'[^'\\]*(?:\\.[^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"/y],["regexp",/&\/(?!\/)[^\/\\]*(?:\\.[^\/\\]*)*\/[\w$]*/y],["literal",/(?:true|false|null|undefined|Infinity|NaN|else)(?![\w$])/y],["variable",/(?:super|this)(?![\w$])/y],["keyword",/(?:new|await|period|void|delete|typeof|instanceof|in|yieldFrom|yield|if|async(?:Fun|Proc|Scope|As|Each|Map|Do|Try|Catch)|fun|proc|scope|as|each|map|do|try|catch|stop|to|linSpace|call|apply|print|throw|debugger|reduce|some|every|filter|minIndex|min|maxIndex|max|sumCumu|sum|count|findIndex|find|orderIndex|order|mean|groupCount|group|binCount|bin|variance|deviation|arrObj|objArr|transpose|class|extends|assign|attach|pick|into|insertEach|insert|encodeSVG|encode|createSVG|create|fragment|attr|prop|style|text|html|remove|lower|raise|addClass|removeClass|hasClass|hasAttr|removeAttr|removeStyle|on|off|sketch|abs|acos|acosh|asin|asinh|atan|atanh|cbrt|ceil|clz32|cos|cosh|exp|expm1|floor|fround|log|log10|log1p|log2|round|sign|sin|sinh|sqrt|tan|tanh|trunc|toUpperCase|toLowerCase|trim|trimEnd|trimStart|neg|boolean|number|string|date|isInteger|isFinite|isNaN|not|array|at|chg|getter|setter|random|randomInt|categorical|normal|logNormal|binomial|exponential|geometric|shuffle|export|import|importAs|importDefault|importAll|load|\$(?:a|abbr|address|area|article|aside|audio|b|bdi|bdo|blockquote|br|button|canvas|caption|cite|code|col|colgroup|datalist|dd|del|details|dfn|dialog|div|dl|dt|em|embed|fieldset|figcaption|figure|footer|form|h1|h2|h3|h4|h5|h6|header|hgroup|hr|i|iframe|img|input|ins|kbd|label|legend|li|link|main|mark|menu|meta|meter|nav|noscript|ol|optgroup|option|output|p|picture|pre|progress|q|rb|rp|rt|rtc|ruby|s|samp|script|section|select|slot|small|source|span|strong|sub|summary|sup|table|tbody|td|template|textarea|tfoot|th|thead|time|title|tr|track|u|ul|var|video|wbr|animate|animateMotion|animateTransform|circle|clipPath|defs|desc|discard|ellipse|feBlend|feColorMatrix|feComponentTransfer|feComposite|feConvolveMatrix|feDiffuseLighting|feDisplacementMap|feDistantLight|feDropShadow|feFlood|feFuncA|feFuncB|feFuncG|feFuncR|feGaussianBlur|feImage|feMerge|feMergeNode|feMorphology|feOffset|fePointLight|feSpecularLighting|feSpotLight|feTile|feTurbulence|foreignObject|g|hatch|hatchpath|image|line|linearGradient|marker|mask|metadata|mpath|path|pattern|polygon|polyline|radialGradient|rect|solidcolor|stop|svg|symbol|textPath|tspan|use|view))(?![\w$])/y],["identifier",/[a-zA-Z_$][\w$]*/y],["operator",/`?(?:[+\-*/%\^?\\=@#<>!]?=|[+\-*/%\^\\!,~]|\|\||&&|<[>\-\\~]?|><|>|@{1,2}|#{1,2}|\?{1,2}|[?:]?:)`?(?![+\-*%<>=!?\\#@:|\^`~,]|\/(?:$|[^/])|&&)/y],["punctuation",/[(){}\[\]|]/y]]);function spanWrap(value,cls){return`<span class="zap-${cls}">${value}</span>`}function untag(s){return s.replace(/</g,"&lt;").replace(/>/g,"&gt;")}const nextSpace=/\S+\s*/y;module.exports=code=>{let index=0;let match;let spanCode="";codeLoop:while(index<code.length){for(let[type,reg]of regexps.entries()){reg.lastIndex=index;match=reg.exec(code);if(match){spanCode+=type==="space"?match[0]:spanWrap(untag(match[0]),type);index=reg.lastIndex;continue codeLoop}}nextSpace.lastIndex=index;match=nextSpace.exec(code);spanCode+=untag(match[0]);index=nextSpace.lastIndex}return spanCode}},{}],2:[function(require,module,exports){(()=>{"use strict";const indexHighlight=require("./index-highlight.js");const panel=document.getElementById("panel");let filename,anchor;let saveScrollPosn,loadScrollPosn;{if(require("./storageAvailable.js")("localStorage")){saveScrollPosn=()=>localStorage[`page_${filename}`]=panel.scrollTop;loadScrollPosn=()=>localStorage[`page_${filename}`]}else{saveScrollPosn=()=>{};loadScrollPosn=()=>{}}}function isElementInView(el,holder){const{top:top,bottom:bottom,height:height}=el.getBoundingClientRect();const holderRect=holder.getBoundingClientRect();return top<=holderRect.top?holderRect.top-top<=height-20:bottom-holderRect.bottom<=height-20}async function loadPanel(span,returning){if(filename)saveScrollPosn();const oldFilename=filename;filename=location.search.slice(1)||"Overview";anchor=location.hash;if(filename!==oldFilename){panel.innerHTML="";for(let elm of document.querySelectorAll("#sidebar span")){elm.classList.remove("selected")}const sidebarLink=span||document.querySelector(`#sidebar span[data-file="${filename}"]`);sidebarLink.classList.add("selected");if(!isElementInView(sidebarLink,sidebarLink.parentNode)){sidebarLink.scrollIntoView()}const content=await fetch(`contents-html/${filename}.html`).then(response=>response.text());panel.innerHTML=content;const preCodes=document.querySelectorAll("pre > code");for(let elm of preCodes){if(!elm.classList.contains("no-highlight")){elm.innerHTML=indexHighlight(elm.innerText)}}for(let elm of panel.querySelectorAll("a")){elm.addEventListener("click",evt=>{if(elm.getAttribute("href")[0]==="?"){history.pushState(null,"",evt.target.getAttribute("href"));loadPanel();evt.preventDefault();return false}})}}if(returning){panel.scrollTop=loadScrollPosn()}else if(anchor){document.querySelector(anchor).scrollIntoView()}}{window.onpopstate=()=>loadPanel(null,true);for(let elm of document.querySelectorAll("#sidebar span")){elm.addEventListener("click",evt=>{history.pushState(null,"",`?${evt.target.getAttribute("data-file")}`);loadPanel(evt.target)})}document.querySelector("#zap-link").addEventListener("click",()=>{document.querySelector("#sidebar span").click()});window.addEventListener("pageshow",evt=>loadPanel(null,evt.persisted));window.addEventListener("pagehide",()=>saveScrollPosn())}})()},{"./index-highlight.js":1,"./storageAvailable.js":3}],3:[function(require,module,exports){module.exports=type=>{var storage;try{storage=window[type];var x="__storage_test__";storage.setItem(x,x);storage.removeItem(x);return true}catch(e){return e instanceof DOMException&&(e.code===22||e.code===1014||e.name==="QuotaExceededError"||e.name==="NS_ERROR_DOM_QUOTA_REACHED")&&(storage&&storage.length!==0)}}},{}]},{},[2]);