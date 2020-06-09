## Expressions

---

Everything in Zap is an expression that returns a value. Operators are represented by symbols or reserved words:

```
5 + 10   // 15
4 sqrt   // 2 
```

Each line contains a single expression, unless the line is continued with `|`:

```
4 + 5
| sqrt   // 3
```

#### Evaluation

In general, Zap does not use operator associativity, position or precedence rules. Code reads left to right and the 'current' operator is applied when the next operator or end of the subexpression is reached. When an operator is applied, the result is used as the first operand of the next operator:

```
5 + 10   // 15
+ 5 10   // 15
5 10 +   // 15

@ 5 6 7     // [5, 6, 7]
5 @ 6 7     // [5, 6, 7]
5 6 7 @     // [5, 6, 7]
5 + 6 @ 7   // [11, 7]
+ 5 6 @ 7   // [11, 7]
```

> If adjacent operators are represented by symbols, they must be separated by whitespace.

#### Parentheses and Indentation {#parenth-and-indent}

Parentheses or indentation can be used for precedence. The only difference is that parentheses cannot span multiple lines:

```
2 + 3 * 4     // 24

// parentheses on a single line
2 + (3 * 4)   // 14 

// parentheses can be used across continued lines
2 + (3 *
| 4)          // 14

// indentation
2 + 
    3 * 4     // 14
```

As demonstrated in the final example, opening an indent level continues an expression &mdash; starting a new indent level with `|` is not allowed.

An additional four spaces must be used for each new indent level. Tabs *cannot* be used for indentation &mdash; use 'soft tabs' in code editors so that tabs are converted to spaces.

We often close an indent level (or more than one) and continue the expression. The following example uses the [object literal](?Literals#objects-and-maps) operator `#` and the [array literal](?Literals#arrays-and-sets) operator `@` to create an array of objects:

```
// an array of objects
@
    #
    | name 'Alex'
    | numbers (@ 5 19 12)
| 
    #
    | name 'Cody'
    | numbers (@ 15 6)
```



#### Identifiers {#identifiers}

The term _identifier_ is used frequently in these docs. An identifier is any combination of letters (currently only `a`-`z`, `A`-`Z`), digits (`0`-`9`), `_` and `$`, but cannot start with a digit. 

> Identifiers _can_ start with `$`, but identifiers representing operators are reserved.