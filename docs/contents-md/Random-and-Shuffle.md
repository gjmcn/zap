## Random and Shuffle

---

#### Random

Each operator generates a number from a given distribution. An optional extra operand can be used to specify how many numbers to generate &mdash; in this case, the operator returns an array rather than a number.

---

##### `$random` {#random}

Generate values from a uniform distribution with the given minimum (inclusive, default `0`) and maximum (exclusive, default `1`):

```
$random;           // value in [0, 1)
$random 5 10;      // value in [5, 10)
$random 5 10 20;   // array of 20 values in [5, 10)
```

---

##### `$randomInt` {#random-int}

Generate values from a discrete uniform distribution with the given minimum (inclusive, default `0`) and maximum (exclusive, default `2`):

```
$randomInt;           // value in {0, 1}
$randomInt 5 10;      // value in {5, 6, 7, 8, 9}
$randomInt 5 10 20;   // array of 20 values in {5, 6, 7, 8, 9}
```

---

##### `$normal` {#normal}

Generate values from a normal distribution with the given mean (default `0`) and standard deviation (default `1`):

```
$normal;           // value from normal distbn: mean 0, sd 1
$normal 5 10;      // value from normal distbn: mean 5, sd 10
$normal 5 10 20;   // array of 20 values from normal distbn: mean 5, sd 10
```

---

##### `$logNormal` {#log-normal}

Generate values from a log-normal distribution. Equivalent to applying [`$exp`](?Elementwise) to result of [`$normal`](#normal):

```
$logNormal;   // is equivalent to:
$normal $exp;

$logNormal 5 3 20;   // is equivalent to:
$normal 5 3 20 $exp;
```

---

##### `$exponential` {#exponential}

Generate values from an exponential distribution with the given rate:

```
$exponential 5;      // value from exponential distbn: rate 5
$exponential 5 20;   // array of 20 values from exponential distbn: rate 5
```

---

##### `$binomial` {#binomial}

Generate values from a binomial distribution with the given number of trials and success probability (default `0.5`):

```
$binomial 5;       // value from binomial distbn: trials 5, prob 0.5
$binomial 5 0.3;   // value from binomial distbn: trials 5, prob 0.3

// array of 20 values from binomial distbn: trials 5, prob 0.3
$binomial 5 0.3 20;
```

---

##### `$geometric` {#geometric}

Generate values (positive integers) from a geometric distribution with the given success probability (default `0.5`):

```
$geometric;          // value from geometric distbn: prob 0.5
$geometric 0.3;      // value from geometric distbn: prob 0.3
$geometric 0.3 20;   // array of 20 values from geometric distbn: prob 0.3
```

---

##### `$categorical` {#categorical}

Generate values from a categorical distribution with the given ratio &mdash; values should be non-negative, but need not sum to 1. The ratio must be an iterable:

```
// value in {0, 1}, probabilities: 3/4, 1/4
$categorical (@ 3 1);      

// array of 20 values in {0, 1, 2}, probabilities: 1/6, 2/6, 3/6
1 >> 3 $categorical 20;
```

---

#### Shuffle {#shuffle}

The `$shuffle` operator shuffles the elements of an iterable and returns them in a new array:

```
x = @ 5 7 9;   // [5, 7, 9]
x $shuffle;    // possible result: [9, 5, 7]
x;             // [5, 7, 9]

1 >> 4 $shuffle;   // possible result: [2, 4, 1, 3]
```