## Joins {#joins}

---

`innerJoin`, `leftJoin`, `rightJoin`, `outerJoin` {#inner-join}

Database-style joins.

The first two operands are iterables; the elements of each iterable should be objects or arrays. The third operand is a callback that is called on each pair of elements from the iterables; if the callback returns a truthy value, the returned generator yields the pair of elements. The optional fourth operand is the maximum number of results to yield.

Join operators differ on how they treat elements that are not included in the returned array:

* `innerJoin`: unmatched elements not included.

* `leftJoin`: unmatched elements from the first iterable are included.

* `rightJoin`: unmatched elements from the second iterable are included.

* `outerJoin`: unmatched elements from both iterables are included.

```
EXAMPLE
```

The `innerJoinCount`, `leftJoinCount`, `rightJoinCount` and `outerJoinCount` operators behave like the respective join operators, but return the number results in the join (see the final example above). The count operators do not take a fourth 'limit' operand.

Joins are efficient since they do not copy elements from the iterables being joined. However, working with the output of a join can be fiddly. Unless time or memory becomes an issue, we typically use [`flatten`](#flatten) on the returned generator to make the result of the join easier to work with.

Joins can be chained &mdash; there is no need to `flatten` the intermediate join:

```
EXAMPLE HERE
```

> Joins iterate over the iterables in a nested loop and this is reflected in the ordering of the matched pairs. Unmatched elements of the first iterable (if included) are added after the matched pairs, followed by unmatched elements of the second iterable (if included).

#### `crossJoin`{#cross-join}

`crossJoin` returns all pairs or elements from two iterables. `crossJoin` is equivalent to `innerJoin` with a callback function that always returns `true`:

* `x crossJoin y` is equivalent to `x innerJoin y [true]`

* `x crossJoin y 5` is equivalent to `x innerJoin y [true] 5`

```
EXAMPLE
```

As shown in the final example, `crossJoinCount` returns the number of results in a cross-join.

#### `semiJoin`, `antiJoin`{#semi-join}

`semiJoin` returns the elements of the first iterable that match an element of the second iterable. `antiJoin` returns the elements of the first iterable that do not match any elements in the second iterable.

While `semiJoin` and `antiJoin` only return the elements from one iterable, they behave like other joins for consistency: they return a generator that yields arrays (each array containing a single object in this case).

```
EXAMPLE
```

As shown in the final example, `semiJoinCount` returns the number of results in a semi-join (`antiJoinCount` can be used similalry).

#### `flatten` {#flatten}

'Flatten' a join into an array of objects:

```
EXAMPLE
```

`flatten` can take additional objects that specify which properties to keep and whether to append a prefix to property names:

```
EXAMPLE
```

Notes:

* Any number of additional operands can be used with `flatten ` &mdash; since joins can be chained, each 'row' of results can have more than two objects.

* If prefixes are not used and objects in the same row share a property name, the result will use the value from the last object in the row that has the property.

* Use `null`, `undefined` or an empty object to skip an object, e.g. `theJoin flatten null (# prefix '_')`.

* Do not use the new prefixes when listing property names with `keep`.

* If `keep` is not used, all enumerable own properties of the correpsonding object are included in the result.


-----------------------------------

Notes:
* example with arrays - make clear get objects back
* explain that uses naive nested loops
* if have 'expanded' intermediate join, must flatten it before pass to another join (it will no longer have the `_cakeJoinGen` property)
