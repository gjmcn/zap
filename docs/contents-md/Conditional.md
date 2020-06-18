## Conditional

---

The `?` operator evaluates a _test_; if the test is truthy, the second operand is evaluated and returned, otherwise the third operand is evaluated and returned. If the third operand is omitted and the test is falsy, no code is evaluated (except for the test) and `?` returns `undefined`.

```
true ? 5 10    // 5
false ? 5 10   // 10
4 > 5 ? 6      // undefined
4 < 5 ? 6      // 6

// returns 8
3 == 4 ?
    5
    6
|
    7
    8
```

The `if` operator has operands *test*, *action*, *test*, *action*, ... The tests are evaluated in sequence; when a test returns truthy, the corresponding action is evaluated and `if` returns the result. If no test is truthy, no action is evaluated and `if` returns `undefined`.

Often, we want the final test of an `if` to be truthy to ensure that some action is taken. In this case, we use the special constant `else` as the final test. This is equivalent to using `true`, but the code is easier to read:

```
exam = 60

if (exam >= 50) 'Pass'          // 'Pass'
if (exam >= 80) 'Distinction'   // undefined

grade = if
| (exam >= 80) 'Distinction'
| (exam >= 50) 'Pass'
| else         'Fail'
grade   // 'Pass'

// prints 'Good', returns 'Pass'
if (exam >= 80)
    'Great' print
    'Distinction'
| (exam >= 50)
    'Good' print
    'Pass'
| else
    'Try again' print
    'Fail'
```

> `else` is equivalent to a literal `true`. For example, `else == true` is `true`, and `else string` is `'true'`.