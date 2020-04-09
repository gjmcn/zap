## Object-Oriented Programming

---

There are various options for object-oriented programming in Zap. For example:

1. Data in objects; functions to use and manipulate them:

    ```
    fighter = [name ->
      # stamina 100 ::name];

    paladin = [name -> 
      \fighter name :mana 100];

    fight = [player ->
      + (player :name)' slashes at the foe' $print;
      player -:stamina 1];

    cast = [player spell ->
      + (player :name)' casts 'spell $print;
      player -:mana 1];
      
    alex = \fighter 'Alex';
    alex \fight;             // prints 'Alex slashes at the foe'

    cody = \paladin 'Cody';
    cody \fight;             // prints 'Cody slashes at the foe'
    cody \cast 'fireball';   // prints 'Cody casts fireball
    ```

1. Methods instead of standalone functions:

    ```
    fighter = [name ->
      # stamina 100
        fight [
          + (this :name)' slashes at the foe' $print;
          this -:stamina 1]
        ::name];

    paladin = [name ->
      \fighter name
        :mana 100
        :cast [spell ->
          + (this :name)' casts 'spell $print;
          this -:mana 1]];

    alex = \fighter 'Alex';
    alex |fight;             // prints 'Alex slashes at the foe'

    cody = \paladin 'Cody';
    cody |fight;             // prints 'Cody slashes at the foe'
    cody |cast 'fireball';   // prints 'Cody casts fireball'
    ```

1. Closures:

    ```
    fighter = [name ->
      stamina = 100;
      # fight [
        + name' slashes at the foe' $print;
        stamina -= 1]];

    paladin = [name ->
      mana = 100;
      \fighter name
        :cast [spell ->
          + name' casts 'spell $print;
          mana -= 1]];

    alex = \fighter 'Alex';
    alex |fight;             // prints 'Alex slashes at the foe'

    cody = \paladin 'Cody';
    cody |fight;             // prints 'Cody slashes at the foe'
    cody |cast 'fireball';   // prints 'Cody casts fireball'
    ```

1. Create 'classes' independently; use functions to add methods:

    ```
    canFight = [player ->
      player :fight [
        + (this :name)' slashes at the foe' $print;
        this -:stamina 1]];

    canCast = [player ->
      player :cast [spell ->
        + (this :name)' casts 'spell $print;
        this -:mana 1]];

    fighter = [name ->
      # stamina 100 ::name \canFight];

    paladin = [name -> 
      # stamina 100 mana 100 ::name \canFight \canCast];
      
    alex = \fighter 'Alex';
    alex |fight;             // prints 'Alex slashes at the foe'

    cody = \paladin 'Cody';
    cody |fight;             // prints 'Cody slashes at the foe'
    cody |cast 'fireball';   // prints 'Cody casts fireball'
    ```

1. Prototype-based object-orientation: {#extends-example}

    ```
    Fighter = $class [name ->
      this ::name :stamina 100];

    Fighter \:fight [
      + (this :name)' slashes at the foe' $print;
      this -:stamina 1];

    Paladin = $extends Fighter [name ->
      \super name;
      this :mana 100];

    Paladin \:cast [spell ->
      + (this :name)' casts 'spell $print;
      this -:mana 1];

    alex = $new Fighter 'Alex';
    alex |fight;                 // prints 'Alex slashes at the foe'

    cody = $new Paladin 'Cody';
    cody |fight;                 // prints 'Cody slashes at the foe'
    cody |cast 'fireball';       // prints 'Cody casts fireball'
    ```

  In the final example, we use `$class` to create a class and `$extends` to create a subclass:

  * `$class` takes an optional constructor function and returns a class. If used, the constructor must be a function literal.

  * The distinction between a class and a standard function is rarely important &mdash; we could omit `$class` from the above example and simply assign the function to `Fighter`.

  * `$extends` takes a parent class/function and an optional constructor function, and returns a class. If used, the constructor must be a function literal. The constructor defaults to: `[...args -> \super ...args]`.

  * When using `$extends`, `super` is used inside the constructor to call the constructor of the parent class. `super` must be called before `this` is used &mdash; and must be called somewhere in the constructor even if `this` is not used.

  * For both `$class` and `$extends`, the return value of the constructor is ignored.

  * `$extends` can be used to subclass built-in objects, e.g. `$extends Array`.

> The examples in this section are adapted from [here](https://medium.com/code-monkey/object-composition-in-javascript-2f9b9077b5e6).