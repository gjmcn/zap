## Group {#group}

---

`group` takes an iterable and a callback function. The callback is applied to each element of the iterable (it is passed the element, index and iterable); the results are used to group the elements. `group` returns a map with arrays for values:

```
x = @ 
| (# u 5 v 10)
| (# u 6 v 20)
| (# u 5 v 30)   // array of objects
  
x group [a :u]   // Map {
                 //   5 => [{u: 5, v: 10}, {u: 5, v: 30}]
                 //   6 => [{u: 6, v: 20}]
                 // }

// second callback
x group [a :u] [a mean [a :v]]   // Map {5 => 20, 6 => 20}

// groupCount
x groupCount [a :u]           // Map {5 => 2, 6 => 1}
x groupCount [a :u] [a > 1]   // Map {5 => true, 6 => false}
```

As shown in the example, `group` can take a second callback. This is applied to each group (it is passed a value and key of the map at each step) and the results are used as the values of the returned map.

`groupCount` gets the size of each group &mdash; see the final examples above. While we could use `group` with a second callback for this, `groupCount` is more efficient and is easier to read. 

Use `groupCount` with the identity function for a frequency count:

```
x = @ 'cat' 'dog' 'dog' 'cat' 'cat' 'hippo' 'cat'
x groupCount [a]   // Map {'cat' => 4, 'dog' => 2, 'hippo' => 1}
```