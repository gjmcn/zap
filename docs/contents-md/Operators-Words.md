## Operators: Words

---

#### JavaScript Operators

[`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) [`delete`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/delete) [`in`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/in) [`instanceof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof) [`new`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new) [`typeof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof) [`yield`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/yield) [`yieldFrom`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/yield*) [`void`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/void)   

These operators behave the same as their JavaScript counterparts except that:

  * `delete` takes two operands: an object and a property name:

    ```
    o = # u 5 v 6
    o delete 'u'    // true
    o               // {v: 6}
    ```
  
  * The operands of `new` are a constructor and arguments to pass to the constructor (the constructor is not called explicitly):

    ```
    new Date           // current local date and time
    new Date '2050'    // 01 January 2050, 00:00:00
    new Date 2050 11   // 01 December, 2050, 00:00:00
    ```

  * JavaScript's `yield*` is called `yieldFrom` in Zap.

---

#### Elementwise Math

[`abs`](?Elementwise) [`acos`](?Elementwise) [`acosh`](?Elementwise) [`asin`](?Elementwise) [`asinh`](?Elementwise) [`atan`](?Elementwise) [`atanh`](?Elementwise) [`cbrt`](?Elementwise) [`ceil`](?Elementwise) [`clz32`](?Elementwise) [`cos`](?Elementwise) [`cosh`](?Elementwise) [`exp`](?Elementwise) [`expm1`](?Elementwise) [`floor`](?Elementwise) [`fround`](?Elementwise) [`log`](?Elementwise) [`log10`](?Elementwise) [`log1p`](?Elementwise)  [`log2`](?Elementwise) [`round`](?Elementwise) [`sign`](?Elementwise) [`sin`](?Elementwise) [`sinh`](?Elementwise) [`sqrt`](?Elementwise) [`tan`](?Elementwise) [`tanh`](?Elementwise) [`trunc`](?Elementwise)

#### Elementwise Other

[`boolean`](?Elementwise) [`date`](?Elementwise) [`isFinite`](?Elementwise) [`isInteger`](?Elementwise) [`isNaN`](?Elementwise) [`neg`](?Elementwise) [`not`](?Elementwise) [`number`](?Elementwise) [`string`](?Elementwise) [`toLowerCase`](?Elementwise) [`toUpperCase`](?Elementwise) [`trim`](?Elementwise) [`trimEnd`](?Elementwise) [`trimStart`](?Elementwise)

#### Filter, Group, Reduce, Sort

[`bin`](?Order-and-Bin#bin)  [`binCount`](?Order-and-Bin#bin) [`count`](?Reduce#count) [`deviation`](?Reduce#sum) [`every`](?Reduce#every) [`filter`](?Filter-and-Group#filter)  [`find`](?Reduce#find) [`findIndex`](?Reduce#find) [`group`](?Filter-and-Group#group) [`groupCount`](?Filter-and-Group#group) [`max`](?Reduce#min) [`maxIndex`](?Reduce#min) [`mean`](?Reduce#sum) [`min`](?Reduce#min) [`minIndex`](?Reduce#min) [`order`](?Order-and-Bin#order) [`orderIndex`](?Order-and-Bin#order) [`reduce`](?Reduce) [`some`](?Reduce#every) [`sum`](?Reduce#sum) [`sumCumu`](?Reduce#sum-cumu) [`variance`](?Reduce#sum)

#### Get/Set Property

[`assign`](?Set-Property#copy-properties) [`at`](?Get-Property#at) [`attach`](?Set-Property#attach) [`getter`](?Get-Property#getter) [`set`](?Set-Property#set) [`setter`](?Set-Property#setter)

#### Import and Export
[`export`](?Import-and-Export#export) [`import`](?Import-and-Export#import) [`importAll`](?Import-and-Export#import-all) [`importAs`](?Import-and-Export#import-as) [`importDefault`](?Import-and-Export#import-default) [`load`](?Import-and-Export#load)

#### Other

[`array`](?Loops#array) [`arrObj`](?Tabular-Data#array-of-objects) [`apply`](?Calling-Functions#call-and-apply) [`call`](?Calling-Functions#call-and-apply) [`debugger`](?Print-and-Debug#debugger) [`if`](?Conditional) [`linSpace`](?Ranges#lin-space) [`objArr`](?Tabular-Data#object-of-arrays) [`period`](?Print-and-Debug#period) [`print`](?Print-and-Debug#print) [`throw`](?Errors) [`to`](?Ranges#to) [`transpose`](?Tabular-Data#transpose) 

#### Random and Shuffle
[`binomial`](?Random-and-Shuffle#binomial) [`categorical`](?Random-and-Shuffle#categorical) [`exponential`](?Random-and-Shuffle#exponential) [`geometric`](?Random-and-Shuffle#geometric) [`logNormal`](?Random-and-Shuffle#log-normal) [`normal`](?Random-and-Shuffle#normal) [`random`](?Random-and-Shuffle#random) [`randomInt`](?Random-and-Shuffle#random-int) [`shuffle`](?Random-and-Shuffle#shuffle)

#### Scope

[`as`](Writing-Functions#as) [`asyncAs`](Writing-Functions#as) [`asyncCatch`](?Errors) [`asyncDo`](?Loops#do) [`asyncEach`](?Loops#each) [`asyncFun`](Writing-Functions#fun) [`asyncMap`](?Loops#map) [`asyncProc`](Writing-Functions#proc) [`asyncScope`](Writing-Functions#scope) [`asyncTry`](?Errors) [`catch`](?Errors) [`class`](?Classes) [`do`](?Loops#do) [`each`](?Loops#each) [`extends`](?Classes) [`fun`](Writing-Functions#fun) [`map`](?Loops#map) [`proc`](Writing-Functions#proc) [`scope`](Writing-Functions#scope) [`try`](?Errors) 

---

#### DOM

[`addClass`](?DOM#add-class) [`attr`](?DOM#attr) [`create`](?DOM#create) [`createSVG`](?DOM#create) [`encode`](?DOM#encode) [`encodeSVG`](?DOM#encode) [`fragment`](?DOM#fragment) [`hasAttr`](?DOM#has-attr) [`hasClass`](?DOM#has-attr) [`html`](?DOM#html) [`insert`](?DOM#insert) [`insertEach`](?DOM#insert-each) [`into`](?DOM#into) [`lower`](?DOM#lower) [`off`](?DOM#on) [`on`](?DOM#on) [`prop`](?DOM#attr) [`raise`](?DOM#lower) [`remove`](?DOM#remove) [`removeAttr`](?DOM#remove-attr) [`removeClass`](?DOM#add-class) [`removeStyle`](?DOM#remove-attr) [`pick`](?DOM#pick) [`sketch`](?DOM#sketch) [`style`](?DOM#attr) [`text`](?DOM#html)

##### HTML Elements

[`$a`](?DOM#create-convenience) [`$abbr`](?DOM#create-convenience) [`$address`](?DOM#create-convenience) [`$area`](?DOM#create-convenience) [`$article`](?DOM#create-convenience) [`$aside`](?DOM#create-convenience) [`$audio`](?DOM#create-convenience) [`$b`](?DOM#create-convenience) [`$bdi`](?DOM#create-convenience) [`$bdo`](?DOM#create-convenience) [`$blockquote`](?DOM#create-convenience) [`$br`](?DOM#create-convenience) [`$button`](?DOM#create-convenience) [`$canvas`](?DOM#create-convenience) [`$caption`](?DOM#create-convenience) [`$cite`](?DOM#create-convenience) [`$code`](?DOM#create-convenience) [`$col`](?DOM#create-convenience) [`$colgroup`](?DOM#create-convenience) [`$datalist`](?DOM#create-convenience) [`$dd`](?DOM#create-convenience) [`$del`](?DOM#create-convenience) [`$details`](?DOM#create-convenience) [`$dfn`](?DOM#create-convenience) [`$dialog`](?DOM#create-convenience) [`$div`](?DOM#create-convenience) [`$dl`](?DOM#create-convenience) [`$dt`](?DOM#create-convenience) [`$em`](?DOM#create-convenience) [`$embed`](?DOM#create-convenience) [`$fieldset`](?DOM#create-convenience) [`$figcaption`](?DOM#create-convenience) [`$figure`](?DOM#create-convenience) [`$footer`](?DOM#create-convenience) [`$form`](?DOM#create-convenience) [`$h1`](?DOM#create-convenience) [`$h2`](?DOM#create-convenience) [`$h3`](?DOM#create-convenience) [`$h4`](?DOM#create-convenience) [`$h5`](?DOM#create-convenience) [`$h6`](?DOM#create-convenience) [`$header`](?DOM#create-convenience) [`$hgroup`](?DOM#create-convenience) [`$hr`](?DOM#create-convenience) [`$i`](?DOM#create-convenience) [`$iframe`](?DOM#create-convenience) [`$img`](?DOM#create-convenience) [`$input`](?DOM#create-convenience) [`$ins`](?DOM#create-convenience) [`$kbd`](?DOM#create-convenience) [`$label`](?DOM#create-convenience) [`$legend`](?DOM#create-convenience) [`$li`](?DOM#create-convenience) [`$link`](?DOM#create-convenience) [`$main`](?DOM#create-convenience) [`$mark`](?DOM#create-convenience) [`$menu`](?DOM#create-convenience) [`$meta`](?DOM#create-convenience) [`$meter`](?DOM#create-convenience) [`$nav`](?DOM#create-convenience) [`$noscript`](?DOM#create-convenience) [`$ol`](?DOM#create-convenience) [`$optgroup`](?DOM#create-convenience) [`$option`](?DOM#create-convenience) [`$output`](?DOM#create-convenience) [`$p`](?DOM#create-convenience) [`$picture`](?DOM#create-convenience) [`$pre`](?DOM#create-convenience) [`$progress`](?DOM#create-convenience) [`$q`](?DOM#create-convenience) [`$rb`](?DOM#create-convenience) [`$rp`](?DOM#create-convenience) [`$rt`](?DOM#create-convenience) [`$rtc`](?DOM#create-convenience) [`$ruby`](?DOM#create-convenience) [`$s`](?DOM#create-convenience) [`$samp`](?DOM#create-convenience) [`$script`](?DOM#create-convenience) [`$section`](?DOM#create-convenience) [`$select`](?DOM#create-convenience) [`$slot`](?DOM#create-convenience) [`$small`](?DOM#create-convenience) [`$source`](?DOM#create-convenience) [`$span`](?DOM#create-convenience) [`$strong`](?DOM#create-convenience) [`$sub`](?DOM#create-convenience) [`$summary`](?DOM#create-convenience) [`$sup`](?DOM#create-convenience) [`$table`](?DOM#create-convenience) [`$tbody`](?DOM#create-convenience) [`$td`](?DOM#create-convenience) [`$template`](?DOM#create-convenience) [`$textarea`](?DOM#create-convenience) [`$tfoot`](?DOM#create-convenience) [`$th`](?DOM#create-convenience) [`$thead`](?DOM#create-convenience) [`$time`](?DOM#create-convenience) [`$title`](?DOM#create-convenience) [`$tr`](?DOM#create-convenience) [`$track`](?DOM#create-convenience) [`$u`](?DOM#create-convenience) [`$ul`](?DOM#create-convenience) [`$var`](?DOM#create-convenience) [`$video`](?DOM#create-convenience) [`$wbr`](?DOM#create-convenience)

##### SVG Elements

[`$animate`](?DOM#create-convenience) [`$animateMotion`](?DOM#create-convenience) [`$animateTransform`](?DOM#create-convenience) [`$circle`](?DOM#create-convenience) [`$clipPath`](?DOM#create-convenience) [`$defs`](?DOM#create-convenience) [`$desc`](?DOM#create-convenience) [`$discard`](?DOM#create-convenience) [`$ellipse`](?DOM#create-convenience) [`$feBlend`](?DOM#create-convenience) [`$feColorMatrix`](?DOM#create-convenience) [`$feComponentTransfer`](?DOM#create-convenience) [`$feComposite`](?DOM#create-convenience) [`$feConvolveMatrix`](?DOM#create-convenience) [`$feDiffuseLighting`](?DOM#create-convenience) [`$feDisplacementMap`](?DOM#create-convenience) [`$feDistantLight`](?DOM#create-convenience) [`$feDropShadow`](?DOM#create-convenience) [`$feFlood`](?DOM#create-convenience) [`$feFuncA`](?DOM#create-convenience) [`$feFuncB`](?DOM#create-convenience) [`$feFuncG`](?DOM#create-convenience) [`$feFuncR`](?DOM#create-convenience) [`$feGaussianBlur`](?DOM#create-convenience) [`$feImage`](?DOM#create-convenience) [`$feMerge`](?DOM#create-convenience) [`$feMergeNode`](?DOM#create-convenience) [`$feMorphology`](?DOM#create-convenience) [`$feOffset`](?DOM#create-convenience) [`$fePointLight`](?DOM#create-convenience) [`$feSpecularLighting`](?DOM#create-convenience) [`$feSpotLight`](?DOM#create-convenience) [`$feTile`](?DOM#create-convenience) [`$feTurbulence`](?DOM#create-convenience) [`$foreignObject`](?DOM#create-convenience) [`$g`](?DOM#create-convenience) [`$hatch`](?DOM#create-convenience) [`$hatchpath`](?DOM#create-convenience) [`$image`](?DOM#create-convenience) [`$line`](?DOM#create-convenience) [`$linearGradient`](?DOM#create-convenience) [`$marker`](?DOM#create-convenience) [`$mask`](?DOM#create-convenience) [`$metadata`](?DOM#create-convenience) [`$mpath`](?DOM#create-convenience) [`$path`](?DOM#create-convenience) [`$pattern`](?DOM#create-convenience) [`$polygon`](?DOM#create-convenience) [`$polyline`](?DOM#create-convenience) [`$radialGradient`](?DOM#create-convenience) [`$rect `](?DOM#create-convenience) [`$solidcolor`](?DOM#create-convenience) [`$stop`](?DOM#create-convenience) [`$svg`](?DOM#create-convenience) [`$symbol`](?DOM#create-convenience) [`$textPath`](?DOM#create-convenience) [`$tspan`](?DOM#create-convenience) [`$use`](?DOM#create-convenience) [`$view`](?DOM#create-convenience)
