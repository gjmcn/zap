## Operators: Symbols

---

| Operator | Arity | Description |
| ---------|----------|----------|
| `+` `-` | 1+ | unary plus/minus, add, subtract |
| `*` `/` `%` `^` | 2+ | multiply, divide, remainder, exponentiate |
| `<>` `><`  | 2+ | least, greatest |
| `&&` `||` `??` | 2+ | and, or, nullish coalescing |
| `?` | 2-3 | conditional |
| `!` | 1 | not |
| `<` `<=` `>` `>=` | 2 | compare |
| `==` `!=` | 2 | strict equality, strict inequality |
| `=`  | 2  | assign |
| `\=` | 2  | assign, do not trigger creation of local variable |
| `<-` | 2  | assign, use option of same name or default |
| `?=` | 2  | conditional assign |
| `+=` `-=` `*=` `/=` `%=` `^=` | 2 | update-assign |
| `#=` | 2+ | destructure object |
| `@=` | 2+ | destructure array |
| `:`  | 2 | get property |
| `::` | 2 | get property of prototype |
| `?:` | 2 | conditional get property |
| `\`  | 1+ | call function |
| `<\` | 2+ | call function, return first argument |
| `~`  | 2+ | call method |
| `<~` | 2+ | call method, return calling object |
| `#`  | 0+ | object literal |
| `##` | 0+ | map literal |
| `@`  | 0+ | array literal |
| `@@` | 0+ | set literal {.table .table-sm .w600} |

The operators `+`, `-`, `*`, `/`, `%`, `^`, `&&`, `||`, `??`, `<>` and `><` can take more than two operands:

```
+ 1 2 3            // 6
+ 'a' 'bc' 'def'   // 'abcdef'
```

The operators `&&`, `||`, `??`, `?`, `<-`, `?=` and `?:` use short-circuit evaluation.