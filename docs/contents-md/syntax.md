## Syntax {#syntax}

---

Operators are represented by symbols or reserved words. Each line is an expression that returns a value:

```
2 + 3    // 5
9 sqrt   // 3
```

Use `|` to continue an expression on a new line:

```
4 + 5
| sqrt   // 3
```

In general, Zap does not use operator associativity, position or precedence rules. Code reads left to right and the 'current' operator is applied when the next operator or end of the expression is reached. The result returned by an operator is used as the first operand of the next operator:

```
+ 2 3   // 5
2 + 3   // 5
2 3 +   // 5

+ 2 3 * 4   // 20
2 + 3 * 4   // 20
2 3 + * 4   // 20
```

> If adjacent operators are represented by symbols, they must be separated by whitespace.

---

#### Parentheses and Indentation {#parenth-and-indent}

Parentheses can be used for precedence:

```
2 + 3 * 4     // 20
2 + (3 * 4)   // 14
```

Parentheses *cannot* span multiple expressions:

```
2 + (3 *
| 4)      // 14 (this is a single expression)

(2 + 3
9 sqrt)   // syntax error   
```

Indentation can also be used for precedence. Indented blocks *can* contain multiple expressions:

```
2 + 
    3 * 4   // 14

2 + 
    x = 3
    x * 4   // 14    
```

Opening an indented block automatically continues an expression &mdash; do not use a `|`.

We can close an indented block (or more than one) and continue the expression with `|`. The following example uses the [array literal](#arrays) operator `@`and the [object literal](#objects-and-maps) operator `#` to create an array-of-objects:

```
// an array-of-objects
@
    #
    | name 'Alex'
    | best (# score 143 level 2)
| 
    #
    | name 'Cody'
    | best (# score 201 level 3)
```

Four spaces must be used for indentation. Use 'soft tabs' in code editors so that tabs are converted to spaces.

---

#### Identifiers {#identifiers}

The term _identifier_ is used frequently in these docs. An identifier is any combination of letters (currently only `a`-`z`, `A`-`Z`), digits (`0`-`9`), `_` and `$`, but cannot start with a digit. 

---

#### Special Cases

Additional rules apply to some operators:

###### The Right Operand Rule {#right-operand-rule}

The [`\`](#calling-functions), [`<\`](#return-first) operators (call function), and [`~`](#calling-methods), [`<~`](#return-first) operators (call method) use the _right operand rule_: the first right operand is the function/method. We typically omit space to the right of these operators:

```
f = [a + b]   // function (adds its arguments)
\f 5 10       // 15
5 \f 10       // 15
5 10 \f       // 15
5 10 f \      // syntax error
```

##### Autoquoting {#autoquoting}

The operators [`~`](#calling-methods) and [`<~`](#return-first) (call method), [`#`](#objects-and-maps) (object literal) and [`##`](#objects-and-maps) (map literal) _autoquote_ property names that are [identifiers](#identifiers):

```
# 'u' 5 'v' 6   // {u: 5, v: 6}
# u 5 v 6       // {u: 5, v: 6}
```
Use the identifier as part of a larger expression (wrapping in parentheses suffices) to avoid autoquoting:

```
u = 'v'

# 
| u 5
| (u) 6
| (u + 'w') 7   // {u: 5, v: 6, vw: 7}
```

The property getter [`,`](#comma-getter) autoquotes the property name:

```
o = # u 5 v 6   // {u: 5, v: 6}
o,u             // 5         
```

Operator names are not autoquoted:

```
o = # 'if' 5   // {if: 5} (quotes required)
o,if           // syntax error
o : 'if'       // 5 (the : property getter has no special behavior)
```

##### Property Getters{#getter-precedence}

The `,` and `;` property getters have high precedence and can only be used in subexpressions of the form:

&emsp; <code><i>variableName</i>[`,` or `;`]<i>propertyName</i>[`,` or `;`]<i>propertyName</i> ...</code>

where <code><i>variableName</i></code> is an [identifier](#identifiers) and each <code><i>propertyName</i></code> is an identifier or an index.

`,` [autoquotes](#autoquoting) the property name whereas `;` does not:

```
o = # u 5 v (@ 6 7 8)   // {u: 5, v: [6, 7, 8]}
p = 'u'

10 + o,u     // 15
10 + o;p     // 15
10 + o,v;2   // 18
```

Spaces and line breaks are not permitted on either side of `,` or `;`.

> Since `,` autoquotes the property name, `,` and `;` behave differently when the name is a number containing a non-digit. For example, `x,1e2` will get property `'1e2'` whereas `x;1e2` will get property `100`.

##### Assignment {#assignment-precedence}

[Assignment](#assignment) operators have low precedence and must be placed between their two operands:

```
x = 1 + 2     // 3
x += 3 + 4    // 10
5 + (x = 6)   // 11 (x is 6)
y = x = 8     // syntax error, multiple assignments are not allowed 
```

[Destructuring assignment operators](#destructure-object) must be placed after the last variable being assigned to:

```
x = @ 5 6
u v @= x   // [5, 6] (u is 5, v is 6)
```

##### Body Operands {#body-operands}

The following operators take a __body__ operand:

[`fun`](#fun) [`proc`](#proc) [`scope`](#scope-op) [`as`](#as) [`class`](#class) [`extends`](#extends) [`each`](#each) [`map`](#map) [`do`](#do) [`try`](#try) [`catch`](#catch) 

[`asyncFun`](#fun) [`asyncProc`](#proc) [`asyncScope`](#scope-op) [`asyncAs`](#as) [`asyncEach`](#async-loops) [`asyncMap`](#async-loops) [`asyncDo`](#async-loops) [`asyncTry`](#try) [`asyncCatch`](#catch) 

The body is always the final operand and must be in parentheses or be an indented block. Also, the body cannot be before the operator:

```
fun x y
    x + y         // function

fun x y (x + y)   // function

x y fun (x + y)   // function

x y (x + y) fun   // syntax error, missing body
```

Body operands are important for the following reasons:

* They dictate the visibility of variables &mdash; see [Local Variables](#local-variables).

* `await` can only be used in the body of one of the asynchronous operators listed above.

* `yield` and `yieldFrom` can only be used in the body of `fun`, `scope`, `as`, `each` and `do` (and their asynchronous counterparts).

* `stop` (exit a loop) can only be used in the body of `each`, `map` and `do` loops (and their asynchronous counterparts).