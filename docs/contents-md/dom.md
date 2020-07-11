## DOM {#dom}

---

The following terms are used in this section to describe the elements associated with an operand:

<b><i>first element</i></b>: {#first-element}

  * CSS selector string &#8594; first matching element in the document.

  * non-string iterable &#8594; first element.

  * element &#8594; element.

<b><i>all elements</i></b>: {#all-elements}

  * CSS selector string &#8594; all matching elements in the document; where relevant, the operator returns the elements as an array.

  * non-string iterable &#8594; all elements of the iterable; where relevant, the operator returns the iterable.

  * element &#8594; element; where relevant, the operator returns the element.

> The DOM operators are loosely based on [d3-selection](https://github.com/d3/d3-selection). In particular, data can be encoded as (and is automatically attached to) elements. Zap uses the [`encode`](#encode) operator to map data to elements rather than D3's _enter-update-exit_ approach. Currently, `encode` cannot map data to existing elements; this functionality will be added in a future version. 

---

#### `select` {#select}

`select` takes a CSS selector string and returns the first matching element &mdash; or `null` if there are no matching elements.
When used with one operand, `select` searches the document. If two operands are used, `select` searches the descendants of the [first element](#first-element) of the first operand:

```
select 'p'               // first <p> in the document
select '.news p'         // first <p> in an element with class 'news' 
elmA select 'p'          // first <p> in element elmA
@ elmA elmB select 'p'   // first <p> in element elmA 
'.news' select 'p'       // first <p> in first element with class 'news'
```

Since many DOM operators can take a CSS selector string, `select` and [`selectAll`](#select-all) are not used as frequently as might be expected.

---

#### `selectAll` {#select-all}

As [`select`](#select), but `selectAll` returns all of the matching elements as an array &mdash; an empty array if there are no matching elements.

---

#### `create`, `createSVG` {#create}

Create HTML/SVG elements. The first operand is a tag name:

```
create 'p'         // <p>
createSVG 'rect'   // <rect>
```

The second operand specifies the number of elements to create. When a second operand is used, an array is returned:

```
create 'p' 2         // [<p>, <p>]
createSVG 'rect' 2   // [<rect>, <rect>]
```

Typically, we use [convenience operators](#create-convenience) instead of `create`/`createSVG`. For example:

```
$p        // <p>
$rect 2   // [<rect>, <rect>]
```

---

#### `fragment` {#fragment}

`fragment` takes no operands and returns a new document fragment.

---

#### `encode`, `encodeSVG` {#encode}

`encode` takes an iterable (the 'data') and an HTML tag name. For each datum, an HTML element of the given tag name is created and the element's `__data__` property is set to the datum. The new elements are returned as an array:

```
p = @ 5 6 7 encode 'p'   // [<p>, <p>, <p>]
p :1 :__data__           // 6
```

Various DOM operators such as [`insert`](#insert), [`into`](#into), [`insertEach`](#insert-each), [`attr`](#attr), [`prop`](#attr), [`style`](#attr), [`html`](#html), [`text`](#html), [`on`](#on) and [`off`](#on) use the `__data__` property of elements &mdash; it is rare to use the `__data__` property explicitly.

The optional third operand of `encode` specifies whether to set the `__data__` property of the new elements. This operand defaults to `true`.

Use `encodeSVG` to encode data as SVG elements rather than HTML:

```
o = @ (# u 5 v 6) (# u 7 v 8)
r = encodeSVG o 'rect'   // [<rect>, <rect>]
r :1 :__data__           // {u: 7, v: 8}
```

---

#### `insert` {#insert}

Insert [all elements](#all-elements) of the second operand into the 'target': the [first element](#first-element) of the first operand. Alternatively, the second operand can be a callback function that returns an element or an iterable of elements. The callback is passed the target's data (see [`encode`](#encode)) and the callback's `this` is set to the target.

`insert` returns the inserted element(s):

```
// insert 3 <p> into elm, returns [<p>, <p>, <p>]
elm insert (3 $p)

// insert 1 <p> into elm, returns [<p>]
elm insert (1 $p)

// insert 1 <p> into elm, returns <p>
elm insert ($p)

// insert all <p> in document into elm, returns all <p> as an array
elm insert 'p'
```

As shown in the final example, `insert` can be used to move elements that are already in the document.

The optional third operand of `insert` specifies where to insert elements into the target. The third operand must be a callback function; it is passed the target's data and the callback's `this` is set to the target. Elements are inserted before the [first element](#first-element) returned by the callback. If the callback returns `null` or is omitted, elements are inserted at the end of the target.

---

#### `into` {#into}

`into` is the same as [`insert`](#insert), but with the first two operands swapped. The only other difference is that `into` returns the target element rather than the inserted elements:

```
2 $p into ($div)   // <div><p></p><p></p></div>
```

---

#### `insertEach` {#insert-each}

`insertEach` is similar to using [`insert`](#insert) on each element of the first operand (which can be a CSS selector string, an iterable of elements or an element). However, the second operand of `insertEach` _must_ be a callback function. The callback is passed the 'current index' as its second argument and the results of the callback are collected in an array and returned (each entry of the array is an element or an iterable of elements):

```
divs = @ 5 6 7 encode 'div'   // [<div>, <div>, <div>]

// insert a <p> into each <div>
ps = divs insertEach
    fun data index
        $p text 
            + (this :tagName)' 'data' 'index
            
ps        // [<p>, <p>, <p>]
ps text   // ['DIV 5 0', 'DIV 6 1' 'DIV 7 2']
```

The following example uses `insert` and `insertEach` to represent an array-of-arrays as an HTML table:

```
x = @ (@ 4 5 6) (@ 7 8 9)   // [[4, 5, 6], [7, 8, 9]]

'body' insert ($table)
| insert [encode x 'tr']
| insertEach [a encode 'td' text [a]]
```

---

#### `attr`, `prop`, `style` {#attr}

Get or set an attribute/property/style of [all elements](#all-elements) of the first operand.

The second operand is the attribute/property/style name.

When used with two operands, these operators are getters. If the first operand is an iterable, the values are returned as an array.

When used with three operands, these operators are setters. If the third operand is a function, it is called for each element. The function is passed the element's `__data__` property (see [`encode`](#encode)) and the current index; the function's `this` is set to the element. The value returned by the function is used as the new attribute/property/style value. If the third operand is not a function, it is used as the new attribute/property/style value for each element. Setters return the modified element(s).

```
divs = @ 'red' 'blue' encode 'div'
| style 'background-color' [a]
| style 'height' '20px'   // [<div>, <div>]

// style gets computed style - elements must be in the document
divs into 'body'

divs style 'background-color'   // ["rgb(255, 0, 0)", "rgb(0, 0, 255)"]
divs style 'height'             // ['20px', '20px']
divs :0 style 'height'          // '20px'

'div' style 'width' '40px'   // set width of all divs in document
'div' style 'width'          // ['40px', '40px'] (if no preexisting divs)
```

A callback function can be used with any elements; they need not have their own data:

```
colors = @ 'red' 'green' 'blue'

// create 3 <p>, give each a different color
3 $p style 'color' [colors , b]
```

`style` can be used to get/set [CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties):

```
// use 'html' or document :documentElement to set globals
// (i.e. variables that would be set under :root in CSS)
'html' style '--size' '24px'

// scope --color variable to element with id 'apple'
'#apple' style '--color' 'green'
```

---

#### `html`, `text` {#html}

`html` and `text` are shorthand getters/setters for the `innerHTML` and `textContent` properties respectively. Specifically, they are equivalent to using [`prop`](#attr):

* `e html` is equivalent to `e prop 'innerHTML'`

* `e html h` is equivalent to `e prop 'innerHTML' h`

* `e text` is equivalent to `e prop 'textContent'`

* `e text t` is equivalent to `e prop 'textContent' t`

---

#### `remove` {#remove}

Remove [all elements](#all-elements) of the operand from the document.

Returns the element(s).

---

#### `lower`, `raise` {#lower}

Move [all elements](#all-elements) of the operand (in order) to be the first child (`lower`) or the last child (`raise`) of their parents.

Returns the element(s).

---

#### `addClass`, `removeClass` {#add-class}

Add/remove classes from [all elements](#all-elements) of the first operand. The second operand is a string of space-separated class names. 

Returns the element(s).

---

#### `toggleClass` {#toggle-class}

Add or remove a class from [all elements](#all-elements) of the first operand: if an element has the class, it is removed; otherwise it is added. The second operand is the class name.

Returns the element(s).

---

#### `removeAttr`, `removeStyle` {#remove-attr}

Remove an attribute/style from [all elements](#all-elements) of the first operand. The second operand is the name of the attribute/style to remove. 

Returns the element(s).

---


#### `hasAttr`, `hasClass` {#has-attr}

For [all elements](#all-elements) of the first operand, indicate if each element has the attribute/class specified by the second operand. 

If the first operand is an iterable, these operators return an array of booleans. Otherwise, they return a boolean.

---

#### `on`, `off` {#on}

Add/remove event listeners from [all elements](#all-elements) of the first operand. The second operand is a string of space-separated event types. The third operand is the event handler &mdash; a function. The handler is passed the 'firing' element's `__data__` property (see [`encode`](#encode)) and the event. The handler's `this` is set to the firing element.

```
@ 5 6 7 encode 'p'
| text 'show data'
| on 'click' [this text a]    // [<p>, <p>, <p>] 
```

The optional fourth operand is an options object or a boolean indicating whether to use capture &mdash; see [EventTarget :addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) for details. The fourth operand defaults to `false`.

The behavior of `on` and `off` differs slightly from that of the native methods [EventTarget :addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) and [EventTarget :removeEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener):

* The event handler _must_ be a function when using `on` and `off`.

* The event is the _second_ argument passed to the event handler when using `on` and `off` &mdash; the event is the only argument when using the native methods.

* `on` skips elements where the event handler is already registered for the given event type &mdash; even if the fourth operand of `on` is different to when the handler was originally registered.

`on` and `off` return the element(s).

---

#### `sketch` {#sketch}

`sketch` creates a `<canvas>` element and a drawing context. `sketch` can be used with no operands or with an options object. The options are:

* `width`: canvas width in pixels (default: `300`).

* `height`: canvas height in pixels (default: `300`).

* `context`: context type (default: `'2d'`).

* `scale`: scale canvas and context to account for the device pixel ratio (default: `true`).

The `scale` option is ignored if `context` is not `'2d'`.

Any additional options passed to `sketch` are passed on to [`getContext`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext) when creating the context.

The canvas and context are returned as an array:

```
canvas ctx @= sketch

ctx :fillStyle = 'green'
ctx ~fillRect 50 20 200 100
```

---

#### Convenience Operators for Creating Elements {#create-convenience}

The following are convenience operators for creating elements:

__HTML:__

`$a` `$abbr` `$address` `$area` `$article` `$aside` `$audio` `$b` `$base` `$bdi` `$bdo` `$blockquote` `$body` `$br` `$button` `$canvas` `$caption` `$cite` `$code` `$col` `$colgroup` `$data` `$datalist` `$dd` `$del` `$details` `$dfn` `$dialog` `$div` `$dl` `$dt` `$em` `$embed` `$fieldset` `$figcaption` `$figure` `$footer` `$form` `$h1` `$h2` `$h3` `$h4` `$h5` `$h6` `$head` `$header` `$hgroup` `$hr` `$i` `$iframe` `$img` `$input` `$ins` `$kbd` `$label` `$legend` `$li` `$link` `$main` `$map` `$mark` `$menu` `$meta` `$meter` `$nav` `$noscript` `$object` `$ol` `$optgroup` `$option` `$output` `$p` `$param` `$picture` `$pre` `$progress` `$q` `$rb` `$rp` `$rt` `$rtc` `$ruby` `$s` `$samp` `$script` `$section` `$select` `$slot` `$small` `$source` `$span` `$strong` `$style` `$sub` `$summary` `$sup` `$table` `$tbody` `$td` `$template` `$textarea` `$tfoot` `$th` `$thead` `$time` `$title` `$tr` `$track` `$u` `$ul` `$var` `$video` `$wbr`

__SVG:__

`$animate` `$animateMotion` `$animateTransform` `$circle` `$clipPath` `$defs` `$desc` `$discard` `$ellipse` `$feBlend` `$feColorMatrix` `$feComponentTransfer` `$feComposite` `$feConvolveMatrix` `$feDiffuseLighting` `$feDisplacementMap` `$feDistantLight` `$feDropShadow` `$feFlood` `$feFuncA` `$feFuncB` `$feFuncG` `$feFuncR` `$feGaussianBlur` `$feImage` `$feMerge` `$feMergeNode` `$feMorphology` `$feOffset` `$fePointLight` `$feSpecularLighting` `$feSpotLight` `$feTile` `$feTurbulence` `$filter` `$foreignObject` `$g` `$hatch` `$hatchpath` `$image` `$line` `$linearGradient` `$marker` `$mask` `$metadata` `$mpath` `$path` `$pattern` `$polygon` `$polyline` `$radialGradient` `$rect` `$set` `$solidcolor` `$stop` `$svg` `$switch` `$symbol` `$text` `$textPath` `$tspan` `$use` `$view`

Using these operators is equivalent to using [`create`](#create)/[`createSVG`](#create). For example:

* `$div` is equivalent to `create 'div'`

* `$div 5` is equivalent to `create 'div' 5`

* `$circle` is equivalent to `createSVG 'circle'`

* `$circle 5` is equivalent to `createSVG 'circle' 5`

> Where HTML and SVG elements have the same name (e.g. `a`, `script`, `style` and `title`), there are convenience operators for the HTML elements, but not for the SVG elements.