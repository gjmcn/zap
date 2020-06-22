## Overview

---

Zap is a simple, high-level language which is easy to read and write. Code is consise and compact, but for the right reasons: simple yet flexible syntax rules, minimal clutter and powerful operators &mdash; rather than implicit magic and special syntax.

Zap compiles to JavaScript and can use JavaScript's built-in objects. JavaScript libraries can be used in Zap and vice-versa.

##### Literals

```
# u 5 v 6    // Object {u: 5, v: 6}
## u 5 v 6   // Map {'u' => 5, 'v' => 6}
@ 5 6        // Array [5, 6]
@@ 5 6       // Set {5, 6}
```

##### Expressions

Everything in Zap is an expression &mdash; no blocks, statements or keywords. Except for a few special cases, code reads left to right and the 'current' operator is applied when the next operator or end of the expression is reached:

```
@ 5 6 7     // [5, 6, 7]
5 @ 6 7     // [5, 6, 7]
5 6 7 @     // [5, 6, 7]

5 + 6 @ 7   // [11, 7]
+ 5 6 @ 7   // [11, 7]
5 6 + @ 7   // [11, 7]
5 6 7 + @   // [18]
+ 5 6 7 @   // [18]
```

Many operators have names rather than symbols:

```
typeof 5 == 'number' print   // prints (and returns) true
```

##### Indentation

Indented blocks and parentheses are equivalent:

```
EXAMPLE!!!!
```

##### Line Contuation

An expression ends at the end of a line unless an indentation block is opened or the expression is continued with `|`. These rules make nested structures easy to read:

```
JSON-LIKE EXAMPLE
```

##### Functions

The `fun` operator creates a function. Operators for calling functions (such as `\` in the following examples) are special: the first right operand is always the function.

```
double = fun x (2 * x)   // body in parentheses

add = fun x y
    x + y                // body in indented block

\double 5 \add 20        // 30
5 \double \add 20        // 30
\add (\double 5) 20      // 30
5 20 \add \double        // 50 
5 \add 20 \double        // 50 
```

Bracket functions have parameters `a`, `b`, `c` and are ideal for simple 'one-liners':

```
double = [2 * a]    // function
add = [a + b]       // function
\double 5 \add 20   // 30
```

##### Methods

The `~` operator calls a method:

```
'The quick brown fox jumps over the lazy dog.'
| ~slice ~9
| ~replace '.' '!'
| ~toUpperCase   // 'LAZY DOG!'
```

Or use `<~` to ensure that the calling object is returned:

```
@ 5 6 <~push 7 <~shift   // [6, 7]
```

##### Blocks

Zap does not have blocks as such, but has the `scope` and `asyncScope` operators for readbale alternativ to IIFEs (immediately-invoked function expressions):

```
asyncScope
    data = 'https://jsonplaceholder.typicode.com/users' 
    | \fetch await
    | ~json await
    + 'The data has '(data :length)' rows' print
```

`as` is like `scope` but takes an argument:

```

```

##### Iterables

Working with iterables (arrays, sets, generators etc.) is easy:

```
s = @@ 5 6 7              // Set {5, 6, 7}
s each [a + 10 print]   // prints 15 16 17,
s map [a + 10]           // [15, 16, 17]
s max                    // 7
s sum                    // 18
s filter [a > 5]         // [6, 7] 
s group [a > 5]          // Map {false => [5], true => [6, 7]}
```

Backticks tell an arithmetic, logical or comparison operator to iterate over an operand:

```
x = @ 5 6 7   // [5, 6, 7]
x  `+  10     // [15, 16, 17]       
10  +` x      // [15, 16, 17]
x  `+` x      // [10, 12, 14]

'ab'  +  'cd'   // 'abcd'
'ab' `+  'cd'   // ['acd', bcd']
'ab' `+` 'cd'   // ['ac', 'bd']
```

There are convenience operators for creating generators:

```
1 >> 4                    // generator (1 2 3 4)
1 >> 4 1.5                // generator (1 2.5 4)
1 >>> 4 7                 // generator (1 1.5 2 2.5 3 3.5 4)
seq 1 [a <= 4] [a * 2]   // generator (1 2 4)

1 >> 4 sum   // 10
```

#### Elementwise

Elementwise operators can be used with iterables or non-iterables:

```
@ 4 9 16 sqrt   // [2, 3, 4]
4 sqrt          // 2
```

#### Object-Oriented Programming

Use a standard function as a constructor, `\:` to set properties on its prototype (`:` is used to set object properties) and `extends` to create a subclass:

```
Cat = [this :name a]
  \:sleeping [random < 0.8]

Lion = extends Cat
  \:speak [+ 'Roar, I am '(this :name)]

leo = new Lion 'Leo'
leo |sleeping   // (0.8 probability that true)
leo |speak      // 'Roar, I am Leo'
```

#### DOM

DOM operators can work with individual HTML/SVG elements, iterables of elements and CSS selector strings:

```
// set color of each span with class danger to red
'span.danger' style 'color' 'red'      

// create 5 divs, apply various operators, add divs to body
5 $div 
  style 'cursor' 'pointer'
  addClass 'btn'
  text 'vanish'
  on 'click' [remove this]
  into 'body'
```

Data can be encoded as (and is automatically attached to) elements: 

```
@ 5 6 7 encode 'p'
  text [a]   // [<p>5</p>, <p>6</p>, <p>7</p>] 
```