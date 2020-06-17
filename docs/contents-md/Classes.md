## Classes

---

#### `class` {#class}

Create a class.

We can use a regular function as a constructor:

```
Animal = fun name age
    this :name = name
    this :age = age

alex = new Animal 'Alex' 8   // Animal {name: "Alex", age: 8}
```

The `class` operator is used just like [`fun`](?Writing-Functions#fun), but returns a class rather than a function. Furthermore, when `class` is used:

* If the constructor's [body](?Syntax#open-scope) is empty, the parameters are automatically added to `this`:

    ```
    Animal = class name age ()

    // is equivalent to:

    Animal = class name age
        this :name = name
        this :age = age
    ```

* The constructor always returns the new instance:

    ```
    Animal = fun (# u 5)     // function
    new Animal               // {u: 5}

    Animal = class (# u 5)   // class
    new Animal               // Animal {}
    ```

*  Calling the constructor throws an error:

    ```
    Animal = class name ()
    
    new Animal 'Alex'   // Animal {name: "Alex"}
    
    \Animal 'Alex'      // TypeError: Class constructor Animal cannot
                        // be invoked without 'new'
    ```

Use [`::`](?Get-Property#colon-proto-getter) to add a function to an object's prototype — i.e. to add a method to a class:

```
Animal = class name ()

Animal ::speak = fun
    + (this :name)' makes a noise'

alex = new Animal 'Alex'
alex ~speak   // 'Alex makes a noise'
```

---

#### `extends` {#extends}

Create a subclass.

`extends` is like [`class`](#class) except that:

* The first operand of `extends` is the parent class.

* If the constructor [body](?Syntax#open-scope) is empty, the subclass is given a default constructor that passes its arguments to the parent constructor.

```
Animal = class name ()

Cat = extends Animal ()   // default constructor
Cat ::speak = fun
    + (this :name)' meows'

Dog = extends Animal name breed
    \super name   // see below
    this :breed = breed
Dog ::speak = fun
    + (this :name)' the '(this :breed)' barks'

colin = new Cat 'Colin'
colin ~speak   // 'Colin meows'

debra = new Dog 'Debra' 'doberman'
debra ~speak   // 'Debra the doberman barks'  
```

In the `Dog` constructor above, we call `super` to call the constructor of the parent class. In fact, a subclass constructor _must_ call `super` &mdash; and the call must be before `this` is used.

When using `extends`, the parent class need not have been created with `class`; it can be a regular function or a built-in object:

```
Animal = fun ()             // function
Dog = extends Animal ()     // class
new Dog                     // Dog {}

Vector = extends Array ()   // class
new Vector 3                // Vector [empty × 3]
```