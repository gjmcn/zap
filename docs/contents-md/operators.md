## Operators {#operators}

---

#### Symbols

| Operator | Arity | Description |
| ---------|----------|----------|
| `+` `-` | 1+ | unary plus/minus, add, subtract |
| `*` `/` `%` `^` | 2+ | multiply, divide, remainder, exponentiate |
| `<>` `><`  | 2+ | least, greatest |
| `&&` `||` `??` | 2+ | logical and, or, nullish coalescing |
| [`?`](#ternary) | 2-3 | conditional |
| `!` | 1 | logical not |
| `<` `<=` `>` `>=` | 2 | compare |
| `==` `!=` | 2 | strict equality, strict inequality |
| [`=`](#standard-assignment)  | 2  | assign |
| [`\=`](#non-local) | 2  | assign, do not trigger creation of local variable |
| [`<-`](#options) | 2  | assign, use option of same name or default |
| [`?=`](#conditional-assignment) | 2  | conditional assign |
| [`+=`](#update-assignment) [`-=`](#update-assignment) [`*=`](#update-assignment) [`/=`](#update-assignment) [`%=`](#update-assignment) [`^=`](#update-assignment) | 2 | update-assign |
| [`#=`](#destructure-object) | 2+ | destructure object |
| [`@=`](#destructure-iterable) | 2+ | destructure array |
| [`,`](#comma-getter) | 2 | get property (high precedence, autoquote) |
| [`;`](#comma-getter) | 2 | get property (high precedence) |
| [`:`](#colon-getter)  | 2 | get property |
| [`::`](#colon-proto-getter) | 2 | get property of prototype |
| [`?:`](#conditional-get) | 2 | conditional get property |
| [`\`](#calling-functions) | 1+ | call function |
| [`<\`](#return-first) | 2+ | call function, return first argument |
| [`~`](#calling-methods) | 2+ | call method |
| [`<~`](#return-first) | 2+ | call method, return calling object |
| [`#`](#objects-and-maps) | 0+ | object literal |
| [`##`](#objects-and-maps) | 0+ | map literal |
| [`@`](#arrays)  | 0+ | array literal |
| [`@@`](#sets) | 0+ | set literal {.table .table-sm .w600} |

The operators `&&`, `||`, `??`, `?`, `<-`, `?=` and `?:` use short-circuit evaluation.

---

#### JavaScript Operators 

[`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) [`delete`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/delete) [`in`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/in) [`instanceof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof) [`new`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new) [`typeof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof) [`yield`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/yield) [`yieldFrom`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/yield*) [`void`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/void)   

These operators behave the same as their JavaScript counterparts except that:

* `delete` takes two operands: an object and a property name:

```{.indent}
o = # u 5 v 6
o delete 'u'    // true
o               // {v: 6}
```
  
* The operands of `new` are a constructor and arguments to pass to the constructor (the constructor is not called explicitly):

```{.indent}
new Date           // current local date and time
new Date '2050'    // 01 January 2050, 00:00:00
new Date 2050 11   // 01 December, 2050, 00:00:00
```

* JavaScript's `yield*` is called `yieldFrom` in Zap.

---

#### Body

[`as`](#as) [`catch`](#catch) [`class`](#class) [`do`](#do) [`each`](#each) [`extends`](#extends) [`fun`](#fun) [`map`](#map) [`proc`](#proc) [`scope`](#scope-op) [`try`](#try) 

[`asyncAs`](#as) [`asyncCatch`](#catch) [`asyncDo`](#async-loops) [`asyncEach`](#async-loops) [`asyncFun`](#fun) [`asyncMap`](#async-loops) [`asyncProc`](#proc) [`asyncScope`](#scope-op) [`asyncTry`](#try) 

---

#### Elementwise Is

[`isBigInt`](#elementwise) [`isBoolean`](#elementwise) [`isFinite`](lementwise) [`isFunction`](#elementwise) [`isInteger`](#elementwise) [`isNaN`](#elementwise) [`isNull`](#elementwise) [`isNullish`](#elementwise) [`isNumber`](#elementwise) [`isString`](#elementwise) [`isSymbol`](#elementwise) [`isUndefined `](#elementwise)

---

#### Elementwise Math

[`abs`](#elementwise) [`acos`](#elementwise) [`acosh`](#elementwise) [`asin`](#elementwise) [`asinh`](#elementwise) [`atan`](#elementwise) [`atanh`](#elementwise) [`cbrt`](#elementwise) [`ceil`](#elementwise) [`clz32`](#elementwise) [`cos`](#elementwise) [`cosh`](#elementwise) [`exp`](#elementwise) [`expm1`](#elementwise) [`floor`](#elementwise) [`fround`](#elementwise) [`log`](#elementwise) [`log10`](#elementwise) [`log1p`](#elementwise)  [`log2`](#elementwise) [`round`](#elementwise) [`sign`](#elementwise) [`sin`](#elementwise) [`sinh`](#elementwise) [`sqrt`](#elementwise) [`tan`](#elementwise) [`tanh`](#elementwise) [`trunc`](#elementwise)

---

#### Elementwise Other

[`boolean`](#elementwise) [`date`](#elementwise) [`neg`](#elementwise) [`not`](#elementwise) [`number`](#elementwise) [`string`](#elementwise) [`toLowerCase`](#elementwise) [`toUpperCase`](#elementwise) [`trim`](#elementwise) [`trimEnd`](#elementwise) [`trimStart`](#elementwise)

---

#### Filter, Group, Reduce, Sort

[`bin`](#bin)  [`binCount`](#bin) [`count`](#count) [`correlation`](#correlation) [`covariance`](#correlation) [`covariancePop`](#correlation) [`deviation`](#sum) [`deviationPop`](#sum) [`every`](#every) [`filter`](#filter) [`filterIndex`](#filter) [`find`](#find) [`findIndex`](#find) [`group`](#group) [`groupCount`](#group) [`max`](#min) [`maxIndex`](#min) [`mean`](#sum) [`median`](#median) [`min`](#min) [`minIndex`](#min) [`order`](#order) [`orderIndex`](#order) [`quantile`](#median) [`reduce`](#reduce-op) [`some`](#every) [`sum`](#sum) [`sumCumu`](#sum-cumu) [`rank`](#order) [`variance`](#sum) [`variancePop`](#sum)

---

#### Get/Set Property

[`assign`](#copy-properties) [`at`](#at) [`attach`](#attach) [`chg`](#chg) [`getter`](#getter) [`setter`](#setter)

---

#### Import and Export
[`export`](#export) [`import`](#import) [`importAll`](#import-all) [`importAs`](#import-as) [`importDefault`](#import-default) [`load`](#load)

---

#### Joins

[`antiJoin`](#semi-join) [`crossJoin`](#cross-join) [`flatten`](#flatten) [`innerJoin`](#inner-join) [`leftJoin`](#inner-join) [`outerJoin`](#inner-join) [`rightJoin`](#inner-join) [`semiJoin`](#semi-join)

---

#### Nested Data

[`arrObj`](#array-of-objects) [`mapAt`](#map-at) [`objArr`](#object-of-arrays) [`pick`](#pick) [`transpose`](#transpose)

---

#### Other

[`array`](#arrays) [`apply`](#call-and-apply) [`call`](#call-and-apply) [`debugger`](#debugger) [`empties`](#arrays) [`if`](#if) [`linSpace`](#lin-space) [`ones`](#arrays) [`period`](#period) [`print`](#print) [`throw`](#throw) [`to`](#to) [`zeros`](#arrays) [`interpolate`](#interpolate)

---

#### Random and Shuffle

[`binomial`](#binomial) [`categorical`](#categorical) [`exponential`](#exponential) [`geometric`](#geometric) [`logNormal`](#log-normal) [`normal`](#normal) [`random`](#random-op) [`randomInt`](#random-int) [`shuffle`](#shuffle)

---

#### Set Theory

[`difference`](#set-theory) [`intersection`](#set-theory) [`union`](#set-theory)

---

#### DOM

[`addClass`](#add-class) [`attr`](#attr) [`create`](#create) [`createSVG`](#create) [`encode`](#encode) [`encodeSVG`](#encode) [`fragment`](#fragment) [`hasAttr`](#has-attr) [`hasClass`](#has-attr) [`html`](#html) [`insert`](#insert) [`insertEach`](#insert-each) [`into`](#into) [`lower`](#lower) [`off`](#on) [`on`](#on) [`prop`](#attr) [`raise`](#lower) [`remove`](#remove) [`removeAttr`](#remove-attr) [`removeClass`](#add-class) [`removeStyle`](#remove-attr) [`select`](#select) [`selectAll`](#select-all) [`sketch`](#sketch) [`style`](#attr) [`text`](#html) [`toggleClass`](#toggle-class)

##### HTML Elements

[`$a`](#create-convenience) [`$abbr`](#create-convenience) [`$address`](#create-convenience) [`$area`](#create-convenience) [`$article`](#create-convenience) [`$aside`](#create-convenience) [`$audio`](#create-convenience) [`$b`](#create-convenience) [`$base`](#create-convenience) [`$bdi`](#create-convenience) [`$bdo`](#create-convenience) [`$blockquote`](#create-convenience) [`$body`](#create-convenience) [`$br`](#create-convenience) [`$button`](#create-convenience) [`$canvas`](#create-convenience) [`$caption`](#create-convenience) [`$cite`](#create-convenience) [`$code`](#create-convenience) [`$col`](#create-convenience) [`$colgroup`](#create-convenience) [`$data`](#create-convenience) [`$datalist`](#create-convenience) [`$dd`](#create-convenience) [`$del`](#create-convenience) [`$details`](#create-convenience) [`$dfn`](#create-convenience) [`$dialog`](#create-convenience) [`$div`](#create-convenience) [`$dl`](#create-convenience) [`$dt`](#create-convenience) [`$em`](#create-convenience) [`$embed`](#create-convenience) [`$fieldset`](#create-convenience) [`$figcaption`](#create-convenience) [`$figure`](#create-convenience) [`$footer`](#create-convenience) [`$form`](#create-convenience) [`$h1`](#create-convenience) [`$h2`](#create-convenience) [`$h3`](#create-convenience) [`$h4`](#create-convenience) [`$h5`](#create-convenience) [`$h6`](#create-convenience) [`$head`](#create-convenience) [`$header`](#create-convenience) [`$hgroup`](#create-convenience) [`$hr`](#create-convenience) [`$i`](#create-convenience) [`$iframe`](#create-convenience) [`$img`](#create-convenience) [`$input`](#create-convenience) [`$ins`](#create-convenience) [`$kbd`](#create-convenience) [`$label`](#create-convenience) [`$legend`](#create-convenience) [`$li`](#create-convenience) [`$link`](#create-convenience) [`$main`](#create-convenience) [`$map`](#create-convenience) [`$mark`](#create-convenience) [`$menu`](#create-convenience) [`$meta`](#create-convenience) [`$meter`](#create-convenience) [`$nav`](#create-convenience) [`$noscript`](#create-convenience) [`$object`](#create-convenience) [`$ol`](#create-convenience) [`$optgroup`](#create-convenience) [`$option`](#create-convenience) [`$output`](#create-convenience) [`$p`](#create-convenience) [`$param`](#create-convenience) [`$picture`](#create-convenience) [`$pre`](#create-convenience) [`$progress`](#create-convenience) [`$q`](#create-convenience) [`$rb`](#create-convenience) [`$rp`](#create-convenience) [`$rt`](#create-convenience) [`$rtc`](#create-convenience) [`$ruby`](#create-convenience) [`$s`](#create-convenience) [`$samp`](#create-convenience) [`$script`](#create-convenience) [`$section`](#create-convenience) [`$select`](#create-convenience) [`$slot`](#create-convenience) [`$small`](#create-convenience) [`$source`](#create-convenience) [`$span`](#create-convenience) [`$strong`](#create-convenience) [`$style`](#create-convenience) [`$sub`](#create-convenience) [`$summary`](#create-convenience) [`$sup`](#create-convenience) [`$table`](#create-convenience) [`$tbody`](#create-convenience) [`$td`](#create-convenience) [`$template`](#create-convenience) [`$textarea`](#create-convenience) [`$tfoot`](#create-convenience) [`$th`](#create-convenience) [`$thead`](#create-convenience) [`$time`](#create-convenience) [`$title`](#create-convenience) [`$tr`](#create-convenience) [`$track`](#create-convenience) [`$u`](#create-convenience) [`$ul`](#create-convenience) [`$var`](#create-convenience) [`$video`](#create-convenience) [`$wbr`](#create-convenience)

##### SVG Elements

[`$animate`](#create-convenience) [`$animateMotion`](#create-convenience) [`$animateTransform`](#create-convenience) [`$circle`](#create-convenience) [`$clipPath`](#create-convenience) [`$defs`](#create-convenience) [`$desc`](#create-convenience) [`$discard`](#create-convenience) [`$ellipse`](#create-convenience) [`$feBlend`](#create-convenience) [`$feColorMatrix`](#create-convenience) [`$feComponentTransfer`](#create-convenience) [`$feComposite`](#create-convenience) [`$feConvolveMatrix`](#create-convenience) [`$feDiffuseLighting`](#create-convenience) [`$feDisplacementMap`](#create-convenience) [`$feDistantLight`](#create-convenience) [`$feDropShadow`](#create-convenience) [`$feFlood`](#create-convenience) [`$feFuncA`](#create-convenience) [`$feFuncB`](#create-convenience) [`$feFuncG`](#create-convenience) [`$feFuncR`](#create-convenience) [`$feGaussianBlur`](#create-convenience) [`$feImage`](#create-convenience) [`$feMerge`](#create-convenience) [`$feMergeNode`](#create-convenience) [`$feMorphology`](#create-convenience) [`$feOffset`](#create-convenience) [`$fePointLight`](#create-convenience) [`$feSpecularLighting`](#create-convenience) [`$feSpotLight`](#create-convenience) [`$feTile`](#create-convenience) [`$feTurbulence`](#create-convenience) [`$filter`](#create-convenience) [`$foreignObject`](#create-convenience) [`$g`](#create-convenience) [`$hatch`](#create-convenience) [`$hatchpath`](#create-convenience) [`$image`](#create-convenience) [`$line`](#create-convenience) [`$linearGradient`](#create-convenience) [`$marker`](#create-convenience) [`$mask`](#create-convenience) [`$metadata`](#create-convenience) [`$mpath`](#create-convenience) [`$path`](#create-convenience) [`$pattern`](#create-convenience) [`$polygon`](#create-convenience) [`$polyline`](#create-convenience) [`$radialGradient`](#create-convenience) [`$rect `](#create-convenience) [`$set`](#create-convenience) [`$solidcolor`](#create-convenience) [`$stop`](#create-convenience) [`$svg`](#create-convenience) [`$switch`](#create-convenience) [`$symbol`](#create-convenience) [`$text`](#create-convenience) [`$textPath`](#create-convenience) [`$tspan`](#create-convenience) [`$use`](#create-convenience) [`$view`](#create-convenience)
