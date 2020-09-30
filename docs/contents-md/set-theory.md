## Set Theory {#set-theory}

---

Set theory operators take any number of iterables and return a new set. The order of elements is preserved, i.e. the order of elements in the result is determined by where the elements first appear in the operands.

---

#### `difference` {#difference}

Elements of the first operand that do not appear in any of the other operands:

```
x = @ 3 7 2 9    // [3, 7, 2, 9]
s = @@ 9 7 5     // Set {9, 7, 5}
x difference s   // Set {3, 2}
```

---

#### `intersection` {#intersection}

Elements that appear in all operands:

```
x = @ 3 7 2 9      // [3, 7, 2, 9]
s = @@ 9 7 5       // Set {9, 7, 5}
x intersection s   // Set {7, 9}
```

---

#### `union` {#union}

Elements that appear in any operand:

```
x = @ 3 7 2 9   // [3, 7, 2, 9]
s = @@ 9 7 5    // Set {9, 7, 5}
x union s       // Set {3, 7, 2, 9, 5}
```