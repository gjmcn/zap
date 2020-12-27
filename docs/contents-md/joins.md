## Joins {#joins}

---

`innerJoin`, `leftJoin`, `outerJoin`, `rightJoin` {#inner-join}

These operators combine two iterables of objects (or arrays) and returns a generator. The first two operands are the iterables, the third is a callback that is called on each pair of elements; if the callback returns a truthy value, the returned generator will yield the pair of elements. The optional fourth operand is the maximum number of elements to include in the result.

Join operators differ on how they treat elements that are not included in the returned array:

* `innerJoin`: unmatched elements not included.

* `leftJoin`: unmatched elements from first iterable included.

* `rightJoin`: unmatched elements from second iterable included.

* `outerJoin`: unmatched elements from both iterables included.

The elements of the returned array are pairs of matched elements:

```
EXAMPLE HERE!!!!!
```

> Joins iterate over the iterables in a nested loop and this is reflected in the ordering of the result. Unmatched elements of the first iterable (if included) are added after the matched pairs, followed by unmatched elements of the second iterable (if included).

-----------------

Notes:

* returns objects , but typically flatten
    * returns generator
    * joins can be joined again without flattening - as long as not used
* order of returned rows
* example with arrays - make clear get objects back
* change op list links to be more specific if leave sub headings in
* Count ops - no limit operand
* crossJoin ops