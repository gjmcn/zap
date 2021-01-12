#### 0.4.1 &mdash; Jan 12, 2021

* Add UMD version. 

#### 0.4.0 &mdash; Jan 6, 2021

* Add: `innerJoin`, `outerJoin`, `leftJoin`, `rightJoin`, `crossJoin`, `semiJoin`, `antiJoin`, `crush`.
* Add `covariance`, `covariancePop`, `correlation`.
* Add `variancePop`, `deviationPop`.
* Change `array` to allow non-iterables; strings are not flattened.
* Remove UMD version. 

#### 0.3.1 &mdash; Dec 17, 2020

* `at`, `mapAt`: accept third operand, if truthy put selected properties in array.

#### 0.3.0 &mdash; Dec 13, 2020

* Change colon property getters to standard operators &mdash; no special syntax rules.
* Change comma property getter to have high precedence and autoquoting.
* Add semicolon property getter: as comma, but no autoquoting.

#### 0.2.6

* `filter`, `filterIndex`, `group`, `groupCount` and convenience reduction operators: default callback and ability to pass property/index instead of callback.

#### 0.2.5

* `order`, `orderIndex`, `rank`: accept convenience operands as alternative to callback.

#### 0.2.4

* Add: `pick`, `mapAt`, `interpolate`, `rank`, `filterIndex`, `quantile`, `median`.
* Add: `isBigInt`, `isBoolean`, `isFunction`, `isNull`, `isNullish`, `isNumber`, `isString`, `isSymbol`, `isUndefined`.

#### 0.2.3

* Add: `difference`, `intersection`, `union`.

#### 0.2.2

* Add: `zeros`, `ones`, `empties`.

#### 0.2.1

* Option to omit IIFE wrapper from compiled code.