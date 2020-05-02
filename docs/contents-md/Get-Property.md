## Get Property

---

##### `$at` {#at}

`$at` gets an object/array property or a character from a string. Use additional operands to get a nested property:

```
circle = #
  radius 50
  center (@ 100 200)
  color 'red';

r = 'radius';

circle $at 'radius';     // 50
circle $at r;            // 50
circle $at 'center' 1;   // 200   
circle $at 'color' 2;    // 'd'
circle 'color' $at 2;    // 'd'
```

---

##### `$ats` {#ats}

`$ats` is like [`$at`](#at), but `$ats` can get multiple properties or characters &mdash; the final operand of `$ats` must be an iterable.

`$ats` returns the same kind of object that it gets properties from. For example, when getting elements from an array, `$ats` returns an array.

```
// array of objects
data = @
  (# Name 'vw pickup'     Horsepower 52 Origin 'Europe')
  (# Name 'dodge rampage' Horsepower 84 Origin 'USA')
  (# Name 'ford ranger'   Horsepower 79 Origin 'USA');

data $ats (@ 2 0);
  // [
  //   {Name: 'ford ranger', Horsepower: 79, Origin: 'USA'}
  //   {Name: 'vw pickup', Horsepower: 52, Origin: 'Europe'}
  // ]

data 2 $ats (@ 'Name' 'Origin');
  // {Name: 'ford ranger', Origin: 'USA'}

data 0 'Origin' $ats (@ 1 3);   // 'uo'
```

Since the final operand of `$ats` can be any iterable, we can use e.g. a string or a [range](?Generators#range):

```
# u 5 v 6 w 7 $ats 'uw';                    // {u: 5, w 7}
@ 0 10 20 30 40 50 60 70 $ats (1 >> 7 2);   // [10, 30, 50, 70]
```

---

##### `:` {#colon-getter}

`:` with two operands gets an object/array property or a character from a string. `:` uses the [right operand rule](?Evaluation#right-operand-rule) and the [identifier-name rule](?Evaluation#identifier-name-rule):

```
circle = #
  radius 50
  center (@ 100 200)
  color 'red';

r = 'radius';

circle :radius;            // 50
:radius circle;            // 50
circle :(r);               // 50
circle :('rad' + 'ius');   // 50
circle :center :1;         // 200   
circle :color :2;          // 'd'
```

Use `:` with three operands to [set a property](?Set-Property#colon-setter).

---

##### `\:` {#colon-proto-getter}

`\:` is like [`:`](#colon-getter), but gets a property from the object's prototype:

```
Array :prototype :slice;   // function
Array \:slice;             // same function
```

---

##### `?:` {#conditional-get}

`?:` is like [`:`](#colon-getter), but `?:` short-circuits and returns `undefined` if the object is `null` or `undefined`:

```
o = # u 5 v (# x 10 y 20);   // {u: 5, v: {x: 10, y: 20}}

o :v :y;    // 20

o :q;       // undefined
o :q :y;    // TypeError: Cannot read property 'y' of undefined
o :q ?:y;   // undefined
```

---

##### `$get` {#get}

Use a custom getter function for a property:

```
o = # celsius 10;

o $get 'fahrenheit' [this :celsius * 1.8 + 32];
o :fahrenheit;   // 50

o :celsius 20;   // set celsius property to 20 
o :fahrenheit;   // 68
```

In general:

```
o $get 'x' f;
```

is equivalent to:

```
Object |defineProperty o 'x' (#
  get f
  configurable true
  enumerable true);
```

See [`Object :defineProperty`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) for details.

`$get` returns the modified object.