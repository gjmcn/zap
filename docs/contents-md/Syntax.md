## Syntax

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

We can close an indented block (or more than one) and continue the expression with `|`. The following example uses the [array literal](?Literals#arrays-and-sets) operator `@`and the [object literal](?Literals#objects-and-maps) operator `#` to create an array of objects:

```
// an array of objects
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

#### Special Behavior

Some operators do not follow the normal syntax rules:

###### The Right Operand Rule {#right-operand-rule}

The main [get property](?Get-Property) and [call function/method](?Calling-Functions) operators use the _right operand rule_: the first right operand is the property or function. We typically omit space to the right of operators that use this rule.

```
f = [a + b]   // function (adds its arguments)
\f 5 10       // 15 (\ calls a function)
5 \f 10       // 15
5 10 \f       // 15
5 10 f \      // syntax error
```

##### The Identifier-Name Rule {#identifier-name-rule}

The main [get property](?Get-Property) and [call method](?Calling-Functions#calling-methods) operators, as well as [object and map literals](?Literals#objects-and-maps) use the _identifier-name rule_: property names that are [identifiers](#identifiers) are treated as strings:

```
# 'u' 5 'v' 6   // {u: 5, v: 6}
# u 5 v 6       // {u: 5, v: 6}
```

Use an identifier as part of a larger expression (wrapping in parentheses suffices) to avoid this special behavior:

```
u = 'v'
# 
| u 5
| (u) 6
| (u + 'w') 7   // {u: 5, v: 6, vw: 7}
```

Reserved words must be quoted when the identifier-name rule applies:

```
# 'if' 5   // {if: 5}
```

##### Assignment {#assignment-precedence}

[Assignment](?Assignment) operators have low precedence and must be placed between their two operands:

```
x = 1 + 2     // 3
x += 3 + 4    // 10
5 + (x = 6)   // 11 (x is 6)
y = x = 8     // syntax error, multiple assignments are not allowed 
```

[Destructuring assignment operators](?Assignment#destructuring) must be placed after the last variable being assigned to:

```
x = @ 5 6
u v @= x   // [5, 6] (u is 5, v is 6)
```