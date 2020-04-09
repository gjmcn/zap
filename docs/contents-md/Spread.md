## Spread

---

Spread syntax can be used in array literals, set literals, `$new`, function calls and method calls:

```
x = @ 5 6;         // [5, 6]
@ ...x;            // [5, 6] (shallow copy x)
@ 4 ...x 7;        // [4, 5, 6, 7]

s = @@ 7 8;        // Set {7, 8}
@@ 4 ...x ...s;    // Set {4, 5, 6, 7, 8}

$new Date ...(@ 2050 11);   // 01 December, 2050, 00:00:00

f = [a + b + c];   // function
\f 4 ...x;         // 15
4 \f ...x;         // 15
4 ...x \f;         // 15
...x 4 \f;         // 15

y = @ 2 4;             // [2, 4]
'hijkl' |slice ...y;   // 'jk'
```

Spread syntax can be used with any iterable operand/argument. For example, with a string:

```
@ 'h' ...'ijk' 'l';   // ['h', 'i', 'j', 'k', 'l']

f = [s0 s1 s2 -> s2];
\f ...'ijk';   // 'k'
```

#### Restrictions

There are some restrictions on the use of spread syntax:

* The constructor operand of `$new` cannot be spread;

  ```
  $new Date ...(@ 2050 11);   // 01 December, 2050, 00:00:00
  $new ...(@ Date 2050 11);   // syntax error
  ```

* A function being called cannot be spread:

  ```
  f = [a + b];
  \f ...(@ 5 10);   // 15
  \...(@ f 5 10);   // syntax error
  ```

* When calling a function with `<\`, the first argument cannot be spread:

  ```
  f = [+ a b c $print];
  5 <\f ...(@ 6 7);   // 5, prints 18
  <\f 5 ...(@ 6 7);   // 5, prints 18
  <\f ...(@ 5 6 7);   // syntax error
  ```

* When calling a method with `|`, `<|` or `?|`, neither the calling object nor the method name can be spread:

  ```
  s = 'hijkl';
  s |slice ...(@ 2 4);   // 'jk'
  |slice s ...(@ 2 4);   // 'jk'
  s |...(@ slice 2 4);   // syntax error
  |slice ...(@ s 2 4);   // syntax error
  ```

#### The `$array` Operator {#array}

`$array` is sometimes more convenient than spread syntax when creating an array. The operands of `$array` must be iterables. `$array` returns a new array containing the elements of all of the iterables:

```
x = @ 5 6 7;   // [5, 6, 7]
y = @@ 8 9;    // Set {8, 9}
z = 'abc';     // 'abc'

$array;        // []
x $array;      // [5, 6, 7] (shallow copy of x)  
y $array;      // [8, 9]  
z $array;      // ['a', 'b', 'c']

x y z $array;       // [5, 6, 7, 8, 9, 'a', 'b', 'c']
@ ...x ...y ...z;   // [5, 6, 7, 8, 9, 'a', 'b', 'c']
```