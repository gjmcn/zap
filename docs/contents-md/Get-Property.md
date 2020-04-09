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

`\:` is like `:`, but gets a property from the object's prototype:

```
Array :prototype :slice;   // function
Array \:slice;             // same function
```

---

##### `?:` {#conditional-get}

`?:` is like `:`, but `?:` short-circuits and returns `undefined` if the object is `null` or `undefined`:

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