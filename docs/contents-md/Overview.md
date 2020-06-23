## Overview

---

Zap is a simple, high-level language which is easy to read and write. Code is consise and compact, but for the right reasons: simple yet flexible syntax rules, minimal clutter and powerful operators &mdash; rather than implicit magic and special syntax.

Zap compiles to JavaScript and can use JavaScript's built-in objects. JavaScript libraries can be used in Zap and vice-versa.

#### Literals

```
# u 5 v 6    // Object {u: 5, v: 6}
## u 5 v 6   // Map {'u' => 5, 'v' => 6}
@ 5 6        // Array [5, 6]
@@ 5 6       // Set {5, 6}
```

#### Expressions

Everything in Zap is an expression &mdash; no blocks, statements or keywords. Except for a few special cases, code reads left to right and the 'current' operator is applied when the next operator or end of the expression is reached:

```
@ 3 4 5     // [3, 4, 5]
3 @ 4 5     // [3, 4, 5]
3 4 5 @     // [3, 4, 5]

3 + 4 @ 5   // [7, 5]
+ 3 4 @ 5   // [7, 5]
3 4 + @ 5   // [7, 5]
```

Basic operators such as `+` can take more the two operands: 

```
3 4 5 +   // 12
+ 3 4 5   // 12
```


Many operators have names rather than symbols:

```
typeof 5 == 'number' print   // prints (and returns) true
```

#### Indentation

Indented blocks and parentheses are equivalent:

```
3 * (4 + 5)   // 27
3 * 
    4 + 5     // 27

x = @ 3 4 5
x each v (print v)   // prints 3 4 5
x each v             
    print v          // prints 3 4 5
```

Except that indented blocks can contain multiple expressions:

```
// prints 12 30 56
@ 3 4 5 each value index
    z = value + index
    print z ^ 2 + z
```

#### Line Continuation

An expression ends at the end of a line unless the following line opens an indentation block or continues the line with `|`. 

```
'abcd' ~slice 1 3 ~repeat 2   // 'bcbc'

'abcd'
| ~slice 1 3
| ~repeat 2  // 'bcbc'
```

These rules make nested structures easy to read:

```
dogs = 
    @
        #
        | name 'Bill'
        | species 'boxer'
        | food (@ 'bread' 'butter')
    | 
        #
        | name 'Debra'
        | species 'doberman'
        | food (@ 'donuts' 'dates')
```

#### Functions

The `fun` operator creates a function. Operators for calling functions (such as `\` for functions and `~` for methods) are special: the first right operand is always the function.

```
double = fun x (2 * x)   // body in parentheses

add = fun x y
    x + y                // body in indented block

\double 5 \add 20        // 30
5 \double \add 20        // 30
\add (\double 5) 20      // 30
```

Bracket functions have parameters `a`, `b` and `c` and are ideal for simple 'one-liners':

```
add = [a + b]   // function
```

`scope` and `as` are Zap's equivalent to  IIFEs (immediately-invoked function expressions) or blocks. `scope` takes no arguments, `as` takes one:

```
@ 3 4 5 ~pop as x (x ^ 2 + x)   // 30
```

#### Generators

`yield` and `yieldFrom` can be used in a function body (to get generator function) or in the body of `scope`, `as` or loops (to get a generator):

```
g = 5 do i (yield i)

g ~next   // {value: 0, done: false}
g ~next   // {value: 1, done: false}
```

There are also range operators that create generators:

```
1 to 3           // generator (1 2 3)
1 to 7 2         // generator (1 3 5 7)
1 7 linSpace 4   // generator (1 3 5 7)
```

#### Iterables

There are lots of operators for working with iterables (arrays, sets, generators etc.). For example:

```
s = @@ 5 6 7              // Set {5, 6, 7}
s array                   // [5, 6, 7]
s each x (x + 10 print)   // prints 15 16 17,
s map x (x + 10)          // [15, 16, 17]
s max                     // 7
s sum                     // 18
s filter [a > 5]          // [6, 7] 
s group [a > 5]           // Map {false => [5], true => [6, 7]}
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

#### Elementwise

Elementwise operators can be used with iterables or non-iterables:

```
@ 4 9 16 sqrt   // [2, 3, 4]
4 sqrt          // 2
```

#### Classes

Use `class` to write a constructor and `extends` for a subclass. `::` gets a property from the prototype of an object so can be used to add methods:
```
// class with empty body: params become properties
Cat = class name ()

// subclass with empty body: calls constructor of parent class
Lion = extends Cat ()
Lion ::speak = fun mood
    + 'I am '(this :name)' the 'mood' lion'

leo = new Lion 'Leo'   // Lion {name: "Leo"}
leo ~speak 'hungry'    // 'I am Leo the hungry lion'
```

#### Asynchronous Operators

Except for `class` and `extends`, all operators that take a body operand have an asynchronous version:

```
// prints the string on the final line (and returns a promise
// that resolves to the string)
asyncScope
    data = 'data.json' \fetch await ~json await
    'The data has '(data :length)' rows' print
```

#### DOM

DOM operators can work with individual HTML/SVG elements, iterables of elements and CSS selector strings:

```
// set color of each span with class danger to red
'span.danger' style 'color' 'red'      

// create 5 divs, apply various operators, add divs to body
5 $div 
| style 'cursor' 'pointer'
| addClass 'btn'
| text 'vanish'
| on 'click' [remove this]
| into 'body'
```

Data can be encoded as (and is automatically attached to) elements: 

```
@ 5 6 7 encode 'p' text [a]   // [<p>5</p>, <p>6</p>, <p>7</p>] 
```