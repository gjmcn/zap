## Special Syntax {#special-syntax}

---

Additional syntax rules apply to some operators:

#### The Right Operand Rule {#right-operand-rule}

The [`\`](#calling-functions), [`<\`](#return-first) operators (call function), and [`~`](#calling-methods), [`<~`](#return-first) operators (call method) use the _right operand rule_: the first right operand is the function/method. We typically omit space to the right of these operators:

```
f = [a + b]   // function (adds its arguments)
\f 5 10       // 15
5 \f 10       // 15
5 10 \f       // 15
5 10 f \      // syntax error
```

#### Autoquoting {#autoquoting}

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

#### Property Getters{#getter-precedence}

The `,` and `;` property getters have high precedence and can only be used in subexpressions of the form:

&emsp; <code><i>variableName</i>[`,` or `;`]<i>propertyName1</i>[`,` or `;`]<i>propertyName2</i> ...</code>

The variable name must be an [identifier](#identifiers). The property name(s) must also follow the identifier rules except that property names _can_ start with a digit.


`,` [autoquotes](#autoquoting) the property name whereas `;` does not. Space and line breaks are not permitted on either side of `,` or `;`:

```
o = # u 5 v (@ 6 7 8)   // {u: 5, v: [6, 7, 8]}
p = 'u'

10 + o,u     // 15
10 + o;p     // 15
10 + o,v;2   // 18
```

`,` or `;` can be used when the property name is an index (e.g. `x,100` or `x;100`), but be careful with scientific notation:

* Since `,` autoquotes the property name, `x,1e2` will get property `'1e2'` whereas `x;1e2` will get property `100`.

* Do not include `+` or `-` in the index. These will not be recognized as part of the property name, so `x,1e+2` is effectively `x,1e + 2`, and `x;1e+2` will throw an error since `1e` is neither a number nor an [identifier](#identifier).

#### Assignment {#assignment-precedence}

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

#### Body Operands {#body-operands}

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