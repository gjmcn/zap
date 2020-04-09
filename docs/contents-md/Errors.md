## Errors

---

Use the `$throw` operator to throw an error:

```
\Error 'something went wrong' $throw;
```

Use the `$try` operator to catch and handle errors. `$try` is passed three callback functions (only the first is required):

* _attempt_: function that may throw an error.

* _catch_: function to call if _attempt_ throws an error; _catch_ is passed the error.

* _finally_: a function that is called after _attempt_ and _catch_ regardless of whether an error was thrown.
 
```
// ignores error
$try [null :x];

// prints error message
$try [null :x] [a :message $print];

// prints 'finally'
$try [null :x] [] ['finally' $print];

// prints error message then 'finally'
$try [null :x] [a :message $print] ['finally' $print];
```

> To use _finally_ without _catch_, _catch_ must be an empty function (`[]`) or `undefined`.

`$try` returns the result of _attempt_ unless it throws an error, in which case `$try` returns the result of _catch_ (or `undefined` if _catch_ is omitted).

`$awaitTry` is like `$try`, but waits for each callback. `$awaitTry` can only be used inside an asynchronous function:

```
// web service that returns a random number between 0 and 1
url = 'https://www.random.org/decimal-fractions/?num=1&dec=10&col=1&format=plain&rnd=new';

\{
  // prints 'Problem: small number', then prints 'done'
  $awaitTry 
    {
      x = url \fetch $await |text $await $number;
      x <= 1 ? (\Error 'small number' $throw)}
    [err ->
      + 'Problem: '(err :message) $print];
  $print 'done'};
```

As demonstrated in the above example, `$awaitTry` is itself awaited &mdash; `'done'` is printed _after_ the error message.