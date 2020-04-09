## Expressions

---

Everything in Zap is an expression that returns a value. Operators are represented by symbols or words prefixed with `$`:

```
5 + 10;    // 15
4 $sqrt;   // 2 
```

#### Subexpressions

Subexpressions are terminated with a semicolon. An expression returns the value of its last subexpression:

```
2; 3 + 4;
5 + 6;   // 11
```

The semicolon after the last subexpression is optional:

```
5;
6 + 7   // 13
```

A subexpression is _not_ automatically terminated at the end of a line:

```
5 +
  6;     // 11
```

```
x = 5    // forgot ;
y = 6;   // syntax error
```

```
x = 5   // forgot ;
x + 6;  // NaN (x = 5 + undefined + 6)
```

#### Identifiers {#identifiers}

The term _identifier_ is used frequently in these docs. An identifier is any combination of letters (currently only `a`-`z`, `A`-`Z`), digits (`0`-`9`), `_` and `$`, but cannot start with a digit. 

> Identifiers _can_ start with `$`, but identifiers representing commands are reserved.