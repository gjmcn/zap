## Operators: Symbols

---

| Operator | Arity | Description |
| ---------|----------|----------|
| `~` | 1 | unary minus (high precedence) |
| `+` `-` `*` `/` `%` `^` | 2+ | add, subtract, multiply, divide, remainder, exponentiate |
| `<>` `><`  | 2+ | least, greatest |
| `&&` `||` `??` | 2+ | and, or, nullish coalescing (only `null`, `undefined` 'falsy') |
| `?` | 2-3 | conditional |
| `!` | 1 | not |
| `<` `<=` `>` `>=` | 2 | compare |
| `==` `!=` | 2 | strict equality, strict inequality |
| `=`  | 2  | assign |
| `=:` | 2  | assign, use option of same name or default |
| `\=` | 2  | assign to 'most local' variable |
| `?=` | 2  | conditional assign |
| `+=` `-=` `*=` `/=` `%=` `^=` | 2 | update-assign |
| `#=` | 2+ | destructure object |
| `@=` | 2+ | destructure array |
| `:`  | 2-3 | get/set property |
| `\:` | 2-3 | get/set property of prototype |
| `?:` | 2-3 | conditional get/set property |
| `+:` `-:` `*:` `/:` `%:` `^:` | 3 | update-set property |
| `::` | 2 | set property using variable of same name |
| `\`  | 1+ | call function |
| `<\` | 1+ | call function, return first argument |
| `|`  | 2+ | call method |
| `<|` | 2+ | call method, return calling object |
| `?|` | 2+ | conditional call method |
| `#`  | 0+ | object literal |
| `##` | 0+ | map literal |
| `@`  | 0+ | array literal |
| `@@` | 0+ | set literal |
| `>>` | 2-3| range, given step size |
| `>>>`| 3  | range, given number of steps {.table .table-sm .w600} |

> `+`, `-`, `*`, `/`, `%`, `^`, `&&`, `||`, `??`, `<>`, `><` can take more than two operands, e.g. `+ 1 2 3` returns `6`. 

> `&&`, `||`, `??`, `?`, `=:`, `?=`, `?:` (getter only) and `?|` use short-circuit evaluation.

> There is no unary plus. Use [`$number`](?Elementwise) to convert values to numbers.