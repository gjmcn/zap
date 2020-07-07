const {compute, testEach} = require('./test-helpers.js');

testEach('literals', [
  ['#', {}],
  ['# u 5', {u: 5}],
  ['# ("u" + "v") false "if" true', {uv: false, if: true}],
  ['##', new Map()],
  ['## null 5', new Map([[null, 5]])],
  ['## u 10 5 20', new Map([['u', 10], [5, 20]])],
  ['## ("u" + "v") false "if" true', new Map([['uv', false], ['if', true]])],
  ['@', []],
  ['@ 5', [5]],
  ['@ "ab" NaN', ['ab', NaN]],
  ['@@', new Set()],
  ['@@ "ab"', new Set(['ab'])],
  ['@@ 5 NaN', new Set([5, NaN])],
], true);

test('unary minus', () => {
  expect(compute('- 5')).toBe(-5);
});

test('unary plus', () => {
  expect(compute('"5" +')).toBe(5);
});

test('logical not', () => {
  expect(compute('5 !')).toBe(false);
});

testEach('conditional', [
  ['false ? 5 6', 6],
  ['4 ? 5 6', 5],
]);

testEach('repeat 1', [
  ['"ab" + "c"', 'abc'],
  ['6 + 2',   8],
  ['6 - 2',   4],
  ['6 * 2',  12],
  ['6 / 2',   3],
  ['6 % 2',   0],
  ['6 ^ 2',  36],
  ['6 && 2',  2],
  ['6 || 2',  6],
  ['6 ?? 2',  6],
  ['6 <> 2',  2],
  ['6 >< 2',  6],
]);

testEach('repeat 2', [
  ['+ "a" "bc" "d"', 'abcd'],
  ['+ 2 3 5',      10],
  ['- 2 3 5',      -6],
  ['* 2 3 5',      30],
  ['/ 24 3 2',      4],
  ['% 20 7 4 ',     2],
  ['^ 2 3 5',   32768],
  ['&& 0 2 3',      0],
  ['|| 0 2 3',      2],
  ['?? null 0 2',   0],
  ['<> 2 5 3',      2],
  ['>< 2 5 3',      5],
]);

testEach('comparison', [
  ['2 < 5',     true],
  ['2 <= 5',    true],
  ['2 > 5',     false],
  ['2 >= 5',    false],
  ['2 == 5',    false],
  ['2 == "2"',  false],
  ['2 == 2',    true],
  ['2 != 5',    true],
  ['2 != "2"',  true],
  ['2 != 2',    false],
]);

testEach('backtick pre', [
  ["@ 'a' 'bc' `+ 'de'",  ['ade', 'bcde']],  
  ['@ 2 5 `+ 10',     [12, 15]],
  ['@ 5 3 `- 2',      [3, 1]],
  ['@ 2 5 `* 10',     [20, 50]],
  ['@ 20 50 `/ 10',   [2, 5]],
  ['@ 10 5 `% 3',     [1, 2]],
  ['@ 2 5 `^ 3',      [8, 125]],
  ['@ 0 5 `&& 10',    [0, 10]],
  ['@ 0 5 `|| 10',    [10, 5]],
  ['@ null 5 `?? 10', [10, 5]],
  ['@ 2 10 `<> 5',    [2, 5]],
  ['@ 2 10 `>< 5',    [5, 10]],
  ['@ 10 2 `< 5',     [false, true]],
  ['@ 10 2 `<= 5',    [false, true]],
  ['@ 10 2 `> 5',     [true, false]],
  ['@ 10 2 `>= 5',    [true, false]],
  ['@ 5 2 `== 5',     [true, false]],
  ['@ 5 2 `!= 5',     [false, true]],
  ['@@ 2 5 `+ 10',    [12, 15]],
  ['"ab" `+ "c"',     ['ac', 'bc']],
  ['3 to 4 `+ 10',    [13, 14]],
], true);

testEach('backtick post', [
  ["'de' +` (@ 'a' 'bc')",  ['dea', 'debc']],  
  ['10 +` (@ 2 5)',     [12, 15]],
  ['2 -` (@ 5 3)',      [-3, -1]],
  ['10 *` (@ 2 5)',     [20, 50]],
  ['50 /` (@ 10 5)',    [5, 10]],
  ['10 %` (@ 5 3)',     [0, 1]],
  ['3 ^` (@ 2 5)',      [9, 243]],
  ['10 &&` (@ 0 5)',    [0, 5]],
  ['10 ||` (@ 0 5)',    [10, 10]],
  ['10 ??` (@ null 5)', [10, 10]],
  ['5 <>` (@ 2 10)',    [2, 5]],
  ['5 ><` (@ 2 10)',    [5, 10]],
  ['5 <` (@ 10 2)',     [true, false]],
  ['5 <=` (@ 10 2)',    [true, false]],
  ['5 >` (@ 10 2)',     [false, true]],
  ['5 >=` (@ 10 2)',    [false, true]],
  ['5 ==` (@ 5 2)',     [true, false]],
  ['5 !=` (@ 5 2)',     [false, true]],
  ['10 +` (@@ 2 5)',    [12, 15]],
  ['"c" +` "ab"',       ['ca', 'cb']],
  ['10 +` (3 to 4)',    [13, 14]],
], true);

testEach('backtick both', [
  ["@ 'a' 'bc' `+` (@ 'xy' 'z')",  ['axy', 'bcz']],  
  ['@ 10 20 `+` (@ 2 5)', [12, 25]],
  ['@ 10 20 `-` (@ 5 3)', [5, 17]],
  ['@ 10 20 `*` (@ 2 5)', [20, 100]],
  ['@ 10 20 `/` (@ 2 5)', [5, 4]],
  ['@ 10 20 `%` (@ 5 3)', [0, 2]],
  ['@ 10 20 `^` (@ 2 3)', [100, 8000]],
  ['@ true false `&&` (@ 0 5)', [0, false]],
  ['@ true false `||` (@ 0 5)', [true, 5]],
  ['@ true false `??` (@ 0 5)', [true, false]],
  ['@ 3 5 `<>` (@ 2 10)',   [2, 5]],
  ['@ 3 5 `><` (@ 2 10)',   [3, 10]],
  ['@ 3 5 `<` (@ 10 2)',    [true, false]],
  ['@ 3 5 `<=` (@ 10 2)',   [true, false]],
  ['@ 3 5 `>` (@ 10 2)',    [false, true]],
  ['@ 3 5 `>=` (@ 10 2)',   [false, true]],
  ['@ 5 3 `==` (@ 5 2)',    [true, false]],
  ['@ 5 3 `!=` (@ 5 2)',    [false, true]],
  ['@ 5 3 `+` (@@ 10 20)',  [15, 23]],
  ['@@ 10 20 `+` (3 to 4)', [13, 24]],
  ['(3 to 4) `+` "ab"',     ['3a', '4b']],
  ['@ 3 4 5 `+` (@ 10 20)',   [13, 24]],
  ['@ 3 4 `+` (@ 10 20 30)',  [13, 24,]],
], true);

testEach('\\ call function', [
  [`
f = [5]
\\f`, 5
  ],
  [`
f = [a - 5]
\\f 20`, 15
  ],
  [`
f = [a - 5]
20 \\f`, 15
  ],
  [`
f = [10 * a - b]
\\f 5 6`, 44
  ],
  [`
f = [10 * a - b]
5 \\f 6`, 44
  ],
  [`
f = [10 * a - b]
5 6 \\f`, 44
  ],
  [`
f = [100 * a + (10 * b) - c]
\\f 5 6 7`, 553
  ],
  [`
f = [100 * a + (10 * b) - c]
5 \\f 6 7`, 553
  ],
  [`
f = [100 * a + (10 * b) - c]
5 6\\f 7`, 553
  ],
  [`
f = [100 * a + (10 * b) - c]
5 6 7 \\f`, 553
  ],
]);

testEach('<\\ call function', [
  [`
f = []
5 <\\f`, 5
  ],
  [`
f = []
<\\f 5 6`, 5
  ],
  [`
f = []
5 <\\f 6 7`, 5
  ],
]);

testEach('~ call method', [
  ['~"toUpperCase" "abcd"', 'ABCD'],
  ['"abcd" ~"toUpperCase"', 'ABCD'],
  ['~charAt "abcd" 1', 'b'],
  ['"abcd" ~charAt 1', 'b'],
  ['"abcd" 1 ~charAt', 'b'],
  ['~slice "abcd" 1 3', 'bc'],
  ['"abcd" ~slice 1 3', 'bc'],
  ['"abcd" 1 ~slice 3', 'bc'],
  ['"abcd" 1 3 ~slice', 'bc'],
  ['"abcd" ~("sli" + "ce") 1 3', 'bc'],
  [`
s = "slice"
"abcd" ~(s) 1 3`, 'bc'
  ],
]);

testEach('<~ call method', [
  [`
x = @ 5 6
x <~pop`, [5]
  ],
  [`
x = @ 5
x <~push 6`, [5, 6]
  ],
  [`
x = @ 5
x 6 7 <~push`, [5, 6, 7]
  ],
  [`
x = @ 5
<~push x 6 7 8`, [5, 6, 7, 8]
  ],
], true);

testEach(': get', [
  ['# u 5 v 6 :v',  6],
  ['@ 5 6 :1',      6],
  [':1 (@ 5 6)',    6],
  ["'abc' :1",      'b'],
  ['# uv 5 wx 6 :("u" + "v")', 5],
  [`
x = @ 5 6
i = 1
x :(i)`, 6
  ],
]);

testEach(', get', [
  ['# u 5 v 6 , "v"', 6],
  ['@ 5 6 , 1',       6],
  [', (@ 5 6) 1',     6],
  ["'abc' , 1",       'b'],
  ['# uv 5 wx 6 , ("u" + "v")', 5],
  [`
x = @ 5 6
i = 1
x , i`, 6
  ],
]);

testEach(':: get', [
  ['Array :: slice typeof', 'function'],
  [`
list = fun
    Array ::slice ~'call' arguments
3 4 5 \\list`, [3, 4, 5]],
], true);

testEach('?: get', [
  ['# u 5 v 6 ?:v', 6],
  ['@ 5 6 ?:1',     6],
  ['?:1 (@ 5 6)',   6],
  ['# uv 5 wx 6 ?:("u" + "v")', 5],
  [`
x = @ 5 6
i = 1
x ?:(i)`, 6
  ],
  ['"" ?:length',           0],            
  ['null ?:v',               undefined],
  ['undefined ?:v',          undefined],
  ['# u 5 v null ?:v',       null],
  ['# u 5 v null :v ?:w',    undefined],
  ['# u 5 v null :q ?:w',    undefined],
  ['?:("w" + "x") (@ 5 :1)', undefined],
]);

testEach('= assignment', [
  ['x = 5', 5],
  [`
x = 5
x`, 5
  ],
]);

test('= assignment - set object property', () => {
  expect(compute(`
q = 'd'
w = 'i'  
o = #
o :a = 5
:b o = 6
o :'if' = 7
o :('cd' :0) = 8
o :(q) = 9
o , 'e' = 10
, o 'f' = 11
o 'g' , = 12 
o , 'do' = 13 
o , ('gh', 1) = 14
o , w = 15 
o`)).toStrictEqual({
  a: 5, b: 6, if: 7, c: 8, d: 9, e: 10, f: 11, g: 12, do: 13, h: 14, i: 15   
})});

test('= assignment - set array property', () => {
  expect(compute(`
q = 1 
w = 4  
x = @ 5 6 7
x :0 = 10
x :(q) = 20
x , 3 = 30
x , w = 40
x`)).toStrictEqual([10, 20, 7, 30, 40])});

test('= assignment - set property, returns new value', () => {
  expect(compute('# u 5 :v = 6')).toBe(6);
});

testEach('\\= assignment', [
  [`
x = 5
\\[x \\= 6]
x`, 6],
  [`
x = 5
x \\= 6`, 6
  ],
  [`
x = 5
x \\= 6
x`, 6
  ],
]);

testEach('?= assignment', [
  [`
x = 5
x ?= 6`, 5
  ],
  [`
x = 5
x ?= 6
x`, 5
  ],
  [`
x = false
x ?= 6`, false
  ],
  [`
x = false
x ?= 6
x`, false
  ],
  [`
x = 0
x ?= 6`, 0
  ],
  [`
x = - 0
x ?= 6`, -0
  ],
  [`
x = 0n
x ?= 6`, 0n
  ],
  [`
x = NaN
x ?= 6`, NaN
  ],
  [`
x = ""
x ?= 6`, ''
  ],
  [`
x = null
x ?= 5`,5
  ],
  [`
x = null
x ?= 5
x`, 5
  ],
  [`
x = undefined
x ?= 5`, 5
  ],
  [`
x = undefined
x ?= 5
x`, 5
  ],
]);

testEach('<- assignment', [
  [`
f = fun ops
    q <- 2
    r <- 3
    s <- 4
    t <- 5
    u <- 6
    v <- 7
    w <- 8
    x <- 9
    y <- 10
    z <- 11
    @ q r s t u v w x y z
# q 99    r 0       s (- 0)   t 0n          u ''
| v NaN   w false   x null    y undefined   z (@ true 'abc') 
| \\f`, [99, 0, -0, 0n, '', NaN, false, 9, 10, [true, 'abc']]
  ],
  [`
f = fun u ops v rest
    x <- 5
    y <- 6
    z <- 7
    @ u x y z v rest
\\f 10 (# x 20 z null) 30 40 50`, [10, 20, 6, 7, 30, [40, 50]]
  ],
  [`\\(fun ops (w <- 5))`,   5],
  [`\\(fun ops (ops))`, {}]
], true);

testEach('update assignment', [
  [`
x = 10
x += 4`, 14
  ],
  [`
x = 10
x += 4
x`, 14
  ],
  [`
x = 10
x -= 4
x`, 6
  ],
  [`
x = 10
x *= 4
x`, 40
  ],
  [`
x = 10
x /= 2
x`, 5
  ],
  [`
x = 10
x %= 7
x`, 3],
  [`
x = 10
x ^= 3
x`, 1000
  ],
]);

test('update assignment - set object property', () => {
  expect(compute(`
q = 'g'
w = 'h'  
o = # a 5 b 6 c 7 d 8 e 9 f 10 g 11 h 12 i 13 j 14
o :a += 10
o :b -= 10
:c o *= 10
o , "d" /= 2
o "e" , ^= 2
, o "f" %= 7
o :(q) += 10
o , w -= 10
o :('ijk' :0) *= 10
o , ('ijk' , 1) /= 7
o`)).toStrictEqual({
  a: 15, b: -4, c: 70, d: 4, e: 81, f: 3, g: 21, h: 2, i: 130, j: 2
})});

test('update assignment - set array property', () => {
  expect(compute(`
q = 1 
w = 4  
x = @ 3 4 5 6 7 8
x :0 += 10
x :(q) -= 10
:(5 - 3) x *= 10 
x , 3 /= 2
x , w ^= 2
x , (2 + 3) %= 5
x`)).toStrictEqual([13, -6, 50, 3, 49, 3])});

test('update assignment - set property, returns new value', () => {
  expect(compute('@ 5 6 :0 = 10')).toBe(10);
});

testEach('destructure object', [
  [`
o = # u 5 v 6 w 7
u v w #= o
@ u v w`, [5, 6, 7]
  ],
  [`
uv wx #= # wx "a"
@ uv wx`, [undefined, 'a']
  ],
  [`
o = # u 5 v 6 w 7
v #= o
v`, 6
  ],
], true);

testEach('destructure array', [
  [`
u v @= @ 5 6
@ u v`, [5, 6]
  ],
  [`
x = @ 5 6
u v w @= x
@ u v w`, [5, 6, undefined]
  ],
  [`
x = @ 5 6
u @= x
u`, 5
  ],
], true);

testEach('destructure returns object', [
  ['u #= # u 5 v 6',      {u: 5, v: 6}],
  ['u v #= # u 5 v 6',    {u: 5, v: 6}],
  ['u v w #= # u 5 v 6',  {u: 5, v: 6}],
  ['u @= @ 5 6',          [5, 6]],
  ['u v @= @ 5 6',        [5, 6]],
  ['u v w @= @ 5 6',      [5, 6]],
], true);