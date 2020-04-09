## Conditional

---

The `?` operator evaluates a _test_; if the test is truthy, the second operand is evaluated and returned, otherwise the third operand is evaluated and returned. If the third operand is omitted and the test is falsy, no code is evaluated (except for the test) and `?` returns `undefined`.

```
true ? 5 10;    // 5
false ? 5 10;   // 10
4 > 5 ? 6;      // undefined
4 < 5 ? 6;      // 6

3 == 4 ? (
  5;
  6)
(
  7;
  8);   // 8
```

The `$if` operator has operands *test*, *action*, *test*, *action*, ... The tests are evaluated in sequence; when a test returns truthy, the corresponding action is evaluated and `$if` returns the result. If no test is truthy, no action is evaluated and `$if` returns `undefined`.

```
exam = 60;

// returns 'Pass'
$if (exam > 50) 'Pass';

// returns 'Pass'
$if
  (exam >= 80) 'Distinction'
  (exam >= 50) 'Pass'
  true         'Fail';

// prints 'Good' and returns 'Pass'
$if
  (exam >= 80) (
    $print 'Great';
    'Distinction')
  (exam >= 50) (
    $print 'Good';
    'Pass')
  true (
    $print 'Try again';
    'Fail');
```