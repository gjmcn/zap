## Elementwise {#elementwise}

---

Elementwise operators take a single operand. If the operand is a non-string iterable, the operator acts on each element independently and returns the results as an array. Otherwise, the operator acts on the operand directly and returns the result:

```
4 isNumber         // true
@ 4 '5' isNumber   // [true, false]

4 sqrt        // 2
@ 9 16 sqrt   // [3, 4]

'ab' toUpperCase          // 'AB'
@ 'cd' 'ef' toUpperCase   // ['CD', 'EF']
```

---

#### Elementwise Is {#ew-is}

| Operator      | Description |
|---------------|-------------|
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

---

#### Elementwise Math {#ew-math}

Elementwise math operators use the corresponding methods of the [`Math`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math) object. The elementwise math operators are: 

`abs` `acos` `acosh` `asin` `asinh` `atan` `atanh` `cbrt` `ceil` `clz32` `cos` `cosh` `exp` `expm1` `floor` `fround` `log` `log10` `log1p` `log2` `round` `sign` `sin` `sinh` `sqrt` `tan` `tanh` `trunc`

---

#### Elementwise Other {#ew-other}

| Operator        | Description |
|-----------------|-------------|
| `boolean`      | convert to boolean |
| `date`         | convert to date |
| `neg`          | unary minus |
| `not`          | logical not |
| `number`       | convert to number |
| `string`       | convert to string |
| `toLowerCase`  | convert to lowercase string |
| `toUpperCase`  | convert to uppercase string |
| `trim`         | remove whitespace from both ends of string |
| `trimEnd`      | remove whitespace from end of string |
| `trimStart`    | remove whitespace from start of string {.table .table-sm .w500} |

> `toLowerCase`, `toUpperCase`, `trim`, `trimEnd` and `trimStart` convert values to strings.