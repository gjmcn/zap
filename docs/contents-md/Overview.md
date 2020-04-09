## Overview

---

Zap is a high-level language with a simple, flexible syntax. Zap compiles to JavaScript and can use JavaScript's built-in objects. JavaScript libraries can be used in Zap and vice-versa.

##### Literals

```
# u 5 v 6;    // Object {u: 5, v: 6}
## u 5 v 6;   // Map {'u' => 5, 'v' => 6}
@ 5 6;        // Array [5, 6]
@@ 5 6;       // Set {5, 6}

// whitespace for readability
# main 'pizza'
  side 'fries'
  drink (@ 'water' 'coffee');
```

##### Expressions

Everything in Zap is an expression &mdash; no blocks, statements or keywords. Except for a few special cases, code reads left to right and the 'current' operator is applied when the next operator or end of the subexpression (`;`) is reached:

```
@ 5 6 7;     // [5, 6, 7]
5 @ 6 7;     // [5, 6, 7]
5 6 7 @;     // [5, 6, 7]

5 + 6 @ 7;   // [11, 7]
+ 5 6 @ 7;   // [11, 7]
5 6 + @ 7;   // [11, 7]
5 6 7 + @;   // [18]
+ 5 6 7 @;   // [18]
```

Operators with names start with `$`:

```
$typeof 5 == 'number' $print;   // prints (and returns) true
```

##### Functions

Functions are created with square brackets. Operators for calling functions (such as `\` in the following examples) are special: the first right operand is always the function.

```
double = [2 * a];       // function, default parameter names are a, b, c, d
add = [x y -> x + y];   // function, custom parameter names

\double 5 \add 20;      // 30
5 \double \add 20;      // 30
\add (\double 5) 20;    // 30
5 20 \add \double;      // 50 
5 \add 20 \double;      // 50 
```

Use curly brackets to create an asynchronous function. The following example fetches data using an asynchronous IIFE (immediately-invoked function expression):

```
\{
  data = 'https://jsonplaceholder.typicode.com/users' 
    \fetch $await |json $await;
  + 'The data has '(data :length)' rows' $print};
```

##### Methods

The `|` operator calls a method:

```
'The quick brown fox jumps over the lazy dog.'
  |slice ~9
  |replace '.' '!'
  |toUpperCase;   // 'LAZY DOG!'
```

Or use `<|` to ensure that the calling object is returned:

```
@ 5 6 <|push 7 <|shift;   // [6, 7]
```

##### Iterables

Working with iterables (arrays, sets, generators etc.) is easy:

```
s = @@ 5 6 7;              // Set {5, 6, 7}
s $each [a + 10 $print];   // prints 15 16 17,
s $map [a + 10];           // [15, 16, 17]
s $max;                    // 7
s $sum;                    // 18
s $filter [a > 5];         // [6, 7] 
s $group [a > 5];          // Map {false => [5], true => [6, 7]}
```

Backticks tell an arithmetic, logical or comparison operator to iterate over an operand:

```
x = @ 5 6 7;   // [5, 6, 7]
x  `+  10;     // [15, 16, 17]       
10  +` x;      // [15, 16, 17]
x  `+` x;      // [10, 12, 14]

'ab'  +  'cd';   // 'abcd'
'ab' `+  'cd';   // ['acd', bcd']
'ab' `+` 'cd';   // ['ac', 'bd']
```

There are convenience operators for creating generators:

```
1 >> 4;                    // generator (1 2 3 4)
1 >> 4 1.5;                // generator (1 2.5 4)
1 >>> 4 7;                 // generator (1 1.5 2 2.5 3 3.5 4)
$seq 1 [a <= 4] [a * 2];   // generator (1 2 4)

1 >> 4 $sum;   // 10
```

#### Elementwise

Elementwise operators can be used with iterables or non-iterables:

```
@ 4 9 16 $sqrt;   // [2, 3, 4]
4 $sqrt;          // 2
```

#### Object-Oriented Programming

Use a standard function as a constructor, `\:` to set properties on its prototype (`:` is used to set object properties) and `$extends` to create a subclass:

```
Cat = [this :name a]
  \:sleeping [$random < 0.8];

Lion = $extends Cat
  \:speak [+ 'Roar, I am '(this :name)];

leo = $new Lion 'Leo';
leo |sleeping;   // (0.8 probability that true)
leo |speak;      // 'Roar, I am Leo'
```

#### DOM

DOM operators can work with individual HTML/SVG elements, iterables of elements and CSS selector strings:

```
// set color of each span with class danger to red
'span.danger' $style 'color' 'red';      

// create 5 divs, apply various operators, add divs to body
5 $div 
  $style 'cursor' 'pointer'
  $addClass 'btn'
  $text 'vanish'
  $on 'click' [$remove this]
  $into 'body';
```

Data can be encoded as (and is automatically attached to) elements: 

```
@ 5 6 7 $encode 'p'
  $text [a];   // [<p>5</p>, <p>6</p>, <p>7</p>] 
```