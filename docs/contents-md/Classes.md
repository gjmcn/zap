## Classes

---

The `class` and `extends` operators described in this section allow specifying a constructor function while creating the class. The body of the constructor opens a new [scope](?Scope); the return value of the constructor is ignored.

---

#### `class` {#class}

`class` is used like [`fun`](?Writing-Functions#fun) to simultaneously create a class and its contructor function. After creating a class, we can use [`::`](?Get-Property#colon-proto-getter) to add functions to the class prototype &mdash; i.e. to add methods:

```
Animal = class name
    this :name = name

Animal ::speak = fun
    + (this :name)' makes a noise'

alex = new Animal 'Alex'
alex ~speak   // 'Alex makes a noise'
```

> The distinction between a class and a standard function is rarely important &mdash; we could use `fun` in the above example.

> A constructor can have a [`rest`](?Writing-Functions#rest) parameter and/or an [`ops`](?Writing-Functions#ops) parameter.

Use `class` with no operands to create a class without specifying a constructor:

```
Animal = class
Alex = new Animal
```

---

#### `extends` {#extends}

Create a subclass. `extends` is used like `class` except that the first operand is the parent class:

```
Animal = class name
    this :name = name

Dog = extends Animal name breed
    \super name
    this :breed = breed

Dog ::speak = fun
    + (this :name)' the '(this :breed)' barks'

alex = new Dog 'Alex' 'pug'
alex ~speak   // 'Alex the pug barks'
```

In the example above, we call `super` inside the `Dog` constructor to call the constructor of the parent class (`Animal`). `super` must be called in the child constructor, before `this` is used &mdash; and must be called somewhere in the constructor even if `this` is not used.

Use `class` with no operands to create a subclass without specifying a constructor. In this case, the subclass has a default constructor that passes its arguments to the parent constructor:

```
Animal = class name
    this :name = name

Dog = extends Animal

Dog ::speak = fun
    + (this :name)' barks'

alex = new Dog 'Alex'
alex ~speak   // 'Alex barks'
```

`extends` can be used to subclass built-in objects:

```
Vector = extends Array
v = new Vector 3
```