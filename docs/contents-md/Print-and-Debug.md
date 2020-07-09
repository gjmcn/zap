## Print and Debug {#print-and-debug}

---

#### `print` {#print}

Print operand and return it:

```
print 5            // prints and returns 5
# u 5 v 6 print    // prints and returns {u: 5, v: 6}
x = 5 print + 10   // prints 5, returns 15
x                  // 15
```

> `print` uses [`console :log`](https://developer.mozilla.org/en-US/docs/Web/API/Console/log).

---

#### `debugger` {#debugger}

Invoke debugger (if it exists):

```
debugger
```

---

#### `period` {#period}

Create a promise that resolves after the given number of milliseconds:

```
500 period   // promise that resolves (to undefined) after 500 ms
```

If used with two operands, `period` resolves to the value of the second operand:

```
// waits 1000 ms, prints 'abc'
asyncScope
    1000 period 'abc' await print
```

> `period` uses [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout).