## Basic Syntax {#basic-syntax}

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