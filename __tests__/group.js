const {compute} = require('./test-helpers.js');

test('group array', () => {
  expect(compute('@ 5 6 4 5 5 4 group [a]'))
    .toStrictEqual(new Map([[5, [5, 5, 5]], [6, [6]], [4, [4, 4]]]));
});

test('groupCount array', () => {
  expect(compute('@ 5 6 4 5 5 4 groupCount [a]'))
    .toStrictEqual(new Map([[5, 3], [6, 1], [4, 2]]));
});

test('group empty array', () => {
  expect(compute('@ group [a]'))
    .toStrictEqual(new Map([]));
});

test('groupCount empty array', () => {
  expect(compute('@ groupCount [a]'))
    .toStrictEqual(new Map([]));
});

const arrayOfObjects = `@ (# u 5 v 10) (# u 6 v 20) (# u 5 v 50) `;

test('group array-of-objects', () => {
  expect(compute(arrayOfObjects + 'group [a :u]'))
    .toStrictEqual(new Map([
      [5, [{u: 5, v: 10}, {u: 5, v: 50}]],
      [6, [{u: 6, v: 20}]]
    ]));
});

test('group array-of-objects, use second callback', () => {
  expect(compute(arrayOfObjects + 'group [a :u] [a mean [a :v]]'))
    .toStrictEqual(new Map([[5, 30], [6, 20]]));
});

test('groupCount array-of-objects', () => {
  expect(compute(arrayOfObjects + 'groupCount [a :u]'))
    .toStrictEqual(new Map([[5, 2], [6, 1]]))
});

test('groupCount array-of-objects, use second callback', () => {
  expect(compute(arrayOfObjects + "groupCount [a :u] [a == 1 ? '1' '>1']"))
    .toStrictEqual(new Map([[5, '>1'], [6, '1']]));
});

test('group generator', () => {
  expect(compute(`
f = fun
    # u 5 v 10 yield
    # u 6 v 20 yield
    # u 5 v 50 yield
\\f group [a :u]`))
  .toStrictEqual(new Map([
    [5, [{u: 5, v: 10}, {u: 5, v: 50}]],
    [6, [{u: 6, v: 20}]]
  ]));
});

test('groupCount string', () => {
  expect(compute(`
vowels = @@ 'a' 'e' 'i' 'o' 'u'
'akzeopk' groupCount [vowels ~has a ? 'vowel' 'consonant']`))
      .toStrictEqual(new Map([['vowel', 3], ['consonant', 4]]));
});

test('group, use index argument', () => {
  expect(compute('@ 10 20 30 group [b boolean]'))
    .toStrictEqual(new Map([[false, [10]], [true, [20, 30]]]));
});

test('groupCount, use iterable argument', () => {
  expect(compute('@ 10 20 30 groupCount [c , b == 20]'))
    .toStrictEqual(new Map([[false, 2], [true, 1]]));
});