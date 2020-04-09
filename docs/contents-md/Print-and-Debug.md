## Print and Debug

---

##### `$print` {#print}

Print operand and return it:

```
$print 5;            // prints and returns 5
# u 5 v 6 $print;    // prints and returns {u: 5, v: 6}
x = 5 $print + 10;   // prints 5, returns 15
x;                   // 15
```

> `$print` uses [`console :log`](https://developer.mozilla.org/en-US/docs/Web/API/Console/log).

---

##### `$debugger` {#debugger}

Invoke debugger (if it exists):

```
$debugger;
```

---

##### `$ms` {#ms}

Create a promise that resolves to `undefined` after the given number of milliseconds:

```
500 $ms;   // promise that resolves after 500ms
```

> `$ms` uses [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout).