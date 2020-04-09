## Set Property

---

##### `$to` {#to}

`$to` sets an object/array property. Use additional operands to set a nested property (the last operand is always the new value). `$to` returns the new value of the property:

```
circle = #
  radius 50
  center (@ 100 200);

r = 'radius';

circle 'radius' $to 60;      // 60  (circle is {radius: 60, center: [100, 200]})
circle r $to 70;             // 70  (circle is {radius: 70, center: [100, 200]})
circle 'center' 1 $to 300;   // 300 (circle is {radius: 70, center: [100, 300]})
```

---

##### `:` {#colon-setter}

`:` with three operands sets an object/array property. `:` uses the [right operand rule](?Evaluation#right-operand-rule) and the [identifier-name rule](?Evaluation#identifier-name-rule). When used as a setter, `:` returns the modified object:

```
circle = #
  radius 50
  center (@ 100 200);

r = 'radius';

circle :radius 60;       // {radius: 60, center: [100, 200]}
:radius circle 70;       // {radius: 70, center: [100, 200]}
circle :(r) 80;          // {radius: 80, center: [100, 200]}
circle :center :1 300;   // [100, 300]
circle
  :radius 90
  :color 'red';          // {radius: 90, center: [100, 300], color: 'red'}
```

Use `:` with two operands to [get a property](?Get-Property#colon-getter).

---

##### `\:` {#colon-proto-setter}

`\:` is like `:`, but sets a property on the object's prototype:

```
Person = [this :name a];

// without \: (returns the prototype of Person)
Person :prototype :whisper [this :name |toLowerCase];

// with \: (returns Person)
Person \:shout [this :name |toUpperCase];

alex = $new Person 'Alex';
alex |whisper;   // 'alex'
alex |shout;     // 'ALEX'
```

---

##### `+:` `-:` `*:` `/:` `%:` `^:`

The 'update-setters' are like `:`, but use the current value of the property to compute the new value:

```
o = # u 5 v 6;
o +:u 1 *:v 2;   // {u: 6, v: 12}
```

---

##### `?:` {#conditional-set}

`?:` is like `:`, but only sets a property if its current value is `null`, `undefined` or the property does not exist.

```
o = # u null v 6;
o ?:u 10 ?:v 20 ?:w 30;   // {u: 10, v: 6, w: 30}
```

> When used as a setter, `?:` will throw an error if the object is `null` or `undefined` &mdash; unlike when `?:` is used as a [getter](?Get-Property#conditional-get).

>  When used as a setter, `?:` does not currently use short-circuit evaluation.

---

##### `::`

`::` sets a property using a variable of the same name:

```
width = 100;
height = 200;
color = 'red';

rect = # ::width;        // {width: 100}
rect ::height ::color;   // {width: 100, height: 200, color: 'red'}
```

`::` uses the [right operand rule](?Evaluation#right-operand-rule):

```
o = # u 5;
v = 6;
::v o;   // {u: 5, v: 6}
```

---

##### `$assign` {#copy-properties}

The `$assign` operator copies properties from its second, third, fourth, ... operands to its first operand:

```
o = # u 5 v 6;
p = # v 7 w 8;

# $assign o;     // {u: 5, v: 6} (shallow copy o)
# $assign o p;   // {u: 5, v: 7, w: 8}
o $assign p;     // {u: 5, v: 7, w: 8}
```

`$assign` is shorthand for calling [`Object :assign`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign).

---

##### `$set` {#set}

Use a custom setter function for a property:

```
o = # celsius 10;

o $get 'fahrenheit' [this :celsius * 1.8 + 32];
o $set 'fahrenheit' [this :celsius (a - 32 / 1.8)];

o :fahrenheit;   // 50

o :celsius 20;
o :fahrenheit;   // 68

o :fahrenheit 86;
o :celsius;      // 30
```

In general:

```
o $set 'x' f;
```

is equivalent to:

```
Object |defineProperty o 'x' (#
  set f
  configurable true
  enumerable true);
```

See [`Object :defineProperty`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) for details.

`$set` returns the modified object.