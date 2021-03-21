## Is {#is}

---

These operators return a boolean:

| Operator      | Description |
|---------------|-------------|
| `isArray`     | is array? |
| `isBigInt`    | is bigint? |
| `isBoolean`   | is boolean?|
| `isFinite`    | is finite? (always `false` for non-number) |
| `isFunction`  | is function?|
| `isInteger`   | is integer? (always `false` for non-number) |
| `isNaN`       | is `NaN`? (always `false` for non-number) |
| `isNull`      | is `null`? |
| `isNullish`   | is `null` or `undefined`? |
| `isNumber`    | is number? |
| `isString`    | is string? |
| `isSymbol`    | is symbol? |
| `isUndefined` | is `undefined`? {.table .table-sm .w500} |

```
5 isNumber        // true
5 isInteger       // true

'5' isNumber      // false
'5' isInteger     // false

null isNullish    // true
false isNullish   // false
```