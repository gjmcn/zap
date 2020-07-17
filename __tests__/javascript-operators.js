const {compute, testEach} = require('./test-helpers.js');

testEach('delete', [
  [`
o = # u 5 v 6
o delete "u"
o`, {v: 6}
  ]
], 'true');

testEach('in', [
  ['"u" in (# u 5 v 6)', true],
  ['"u" in (# v 6)',     false],
]);

testEach('instanceof', [
  ['new Date instanceof Date',   true],
  ['new Date instanceof RegExp', false],
]);

test('typeof', () => {
  expect(compute('typeof 5')).toBe('number');
});

test('yield', () => {
  expect(compute(`
f = fun
    yield 5
    yield 6
\\f array`)).toStrictEqual([5, 6])});

test('yieldFrom', () => {
  expect(compute(`
f = fun
    @ 5 6 yieldFrom
\\f array`)).toStrictEqual([5, 6])});

testEach('void', [
  ['void 0',        undefined],
  ['5 void',        undefined],
  ['void (x = 5)',  undefined],
  [`
void (x = 5)
x`, 5
  ],
]);

testEach('new', [
  ['new Date instanceof Date',     true],
  ['new Date "2050" ~getFullYear', 2050],
  ['Date new 2050 11 ~getMonth',   11],
]);

test('await', async () => {
  const val = await compute(`
20 period await  
5`, {iife: 'async'});
  expect(val).toBe(5);
});
