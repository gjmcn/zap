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
], 'true');

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
], 'true');

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
], 'true');

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
], 'true');

testEach('call function', [
  ['f = [5]; \\f', 5],
  ['f = [a - 5]; \\f 20', 15],
  ['f = [a - 5]; 20 \\f', 15],
  ['f = [10 * a - b]; \\f 5 6', 44],
  ['f = [10 * a - b]; 5 \\f 6', 44],
  ['f = [10 * a - b]; 5 6 \\f', 44],
  ['f = [100 * a + (10 * b) - c]; \\f 5 6 7', 553],
  ['f = [100 * a + (10 * b) - c]; 5 \\f 6 7', 553],
  ['f = [100 * a + (10 * b) - c]; 5 6\\f 7',  553],
  ['f = [100 * a + (10 * b) - c]; 5 6 7\\f',  553],
]);

testEach('call function, return first argument', [
  ['f = []; 5 <\\f',     5],
  ['f = []; <\\f 5 6',   5],
  ['f = []; 5 <\\f 6 7', 5],
]);

testEach('call method', [
  ['|toUpperCase "abcd"', 'ABCD'],
  ['"abcd" |toUpperCase', 'ABCD'],
  ['|charAt "abcd" 1', 'b'],
  ['"abcd" |charAt 1', 'b'],
  ['"abcd" 1 |charAt', 'b'],
  ['|slice "abcd" 1 3', 'bc'],
  ['"abcd" |slice 1 3', 'bc'],
  ['"abcd" 1 |slice 3', 'bc'],
  ['"abcd" 1 3 |slice', 'bc'],
]);

testEach('call method, non-identifier name', [
  ['s = "slice"; "abcd" |(s) 1 3', 'bc'],
  ['"abcd" |("sli" + "ce") 1 3', 'bc'],
]);

testEach('call method, return calling object', [
  ['x = @ 5 6; x <|pop',      [5]],
  ['x = @ 5; x <|push 6',     [5, 6]],
  ['x = @ 5; x 6 7 <|push',   [5, 6, 7]],
  ['x = @ 5; <|push x 6 7 8', [5, 6, 7, 8]],
], true);

testEach('conditional call method', [
  ['?|toUpperCase "abcd"',  'ABCD'],
  ['"abcd" ?|ToUpperCase',  undefined],
  ['?|charA "abcd" 1',      undefined],
  ['"abcd" ?|chaRAt 1',     undefined],
  ['"abcd" 1 ?|charAt',     'b'],
  ['?|SLICE "abcd" 1 3',    undefined],
  ['"abcd" ?|slice 1 3',    'bc'],
  ['"abcd" 1 ?|slic 3',     undefined],
  ['"abcd" 1 3 ?|slice',    'bc'],
  ['false ?|toString',      'false'],
]);

testEach(': getter', [
  ['# u 5 v 6 :v', 6],
  ['@ 5 6 :1',     6],
  [':1 (@ 5 6)',   6],
  ['# uv 5 wx 6 :("u" + "v")', 5],
  ['x = @ 5 6; i = 1; x :(i)', 6],
]);

testEach(': setter', [
  ['# u 5 :v 6',   {u: 5, v: 6}],
  [':v (# u 5) 6', {u: 5, v: 6}],
  ['(# u 5) 6 :v', {u: 5, v: 6}],
  ['@ 5 6 :1 10',  [5, 10]],
  ['# :("u" + "v") 6', {uv: 6}],
  ['x = @ 5 6; i = 0; :(i) x 10', [10, 6]],
], true);

test('\\: getter-setter', () => {
  expect(compute(`
    f = [] \\:p1 5;
    \\:p2 f 6;
    f 7 \\:('p' + '3'); 
    @ (f \\:p1)
      (f \\:p2)
      (\\:('p' + '3') f)
      (f :p1)
      (f |hasOwnProperty 'p1');
  `)).toStrictEqual([5, 6, 7, undefined, false]);
});

testEach('?: getter', [
  ['# u 5 v 6 ?:v', 6],
  ['@ 5 6 ?:1',     6],
  ['?:1 (@ 5 6)',   6],
  ['# uv 5 wx 6 ?:("u" + "v")', 5],
  ['x = @ 5 6; i = 1; x ?:(i)', 6],
  ['"" ?:length;',              0],            
  ['null ?:v',               undefined],
  ['undefined ?:v',          undefined],
  ['# u 5 v null ?:v',       null],
  ['# u 5 v null ?:v',       null],
  ['# u 5 v null :q ?:w',    undefined],
  ['?:("w" + "x") (@ 5 :1)', undefined],
]);

testEach('?: setter', [
  ['# u 5 v 6 ?:v 10',        {u: 5, v: 6}],
  ['# u 5 ?:v 6',             {u: 5, v: 6}],
  ['# u 5 v undefined ?:v 6', {u: 5, v: 6}],
  ['# u 5 v null ?:v 6',      {u: 5, v: 6}],
  ['?:v (# u 5) 6',           {u: 5, v: 6}],
  ['(# u 5) 6 ?:v',           {u: 5, v: 6}],
  ['@ 5 6 ?:1 10',       [5, 6]],
  ['@ 5 6 ?:2 10',       [5, 6, 10]],
  ['# ?:("u" + "v") 6',  {uv: 6}],
  ['x = @ 5; i = 0; ?:(i) x 10 ?:(i + 1) 20', [5, 20]],
], true);

test('?: setter, null object - throw', () => {
  expect(() => compute('null ?:v 5')).toThrow();
});

testEach(': update setters', [
  [`o = # u 3 v 4 w 5 x 6 y 7 z 8;
    p = 'y';
    o +:u 10;
    o -:v 20
      *:w 30;
    /:x o 2;
    o 5 %:(p) ^:('Z' |toLowerCase) 2;` ,
        {u: 13, v: -16, w: 150, x: 3, y: 2, z: 64}
  ],
  [`@ 3 4 5 6 7 8
      +:0 10
      -:1 20
      *:2 30
      /:3  2
      %:4  5
      ^:5  2`,
        [13, -16, 150, 3, 2, 64]
  ],
], true);

test(':: setter', () => {
  expect(compute(`
    width = 100;
    height = 200;
    fill = 'red';
    stroke = 'green';
    o = # ::width;
    o ::height ::fill;
    ::stroke o;
  `)).toStrictEqual({width: 100, height: 200, fill: 'red', stroke: 'green'})});

testEach('= assignment', [
  ['x = 5;',    5],
  ['x = 5; x;', 5],
]);

testEach('\\= assignment', [
  ['x = 5; \\[x \\= 6]; x', 6],
  ['x = 5; x \\= 6',        6],
  ['x = 5; x \\= 6; x',     6],
]);

testEach('?= assignment', [
  ['x = 5; x ?= 6;',           5],
  ['x = 5; x ?= 6; x',         5],
  ['x = false; x ?= 6;',       false],
  ['x = false; x ?= 6; x',     false],
  ['x = 0; x ?= 6;',           0],
  ['x = ~0; x ?= 6;',          -0],
  ['x = 0n; x ?= 6;',          0n],
  ['x = NaN; x ?= 6;',         NaN],
  ['x = ""; x ?= 6;',          ''],
  ['x = null; x ?= 5;',        5],
  ['x = null; x ?= 5; x',      5],
  ['x = undefined; x ?= 5;',   5],
  ['x = undefined; x ?= 5; x', 5],
]);

testEach('=: assignment', [
  [`
    f = [ops -> 
      q =: 2;   r =: 3;   s =: 4;   t =: 5;       u =: 6;
      v =: 7;   w =: 8;   x =: 9;   y =: 10;      z =: 11;
      @ q r s t u v w x y z];
    # q 99      r 0       s ~0      t 0n          u ''
      v NaN     w false   x null    y undefined   z (@ true 'abc') 
        \\f`,
      [99, 0, -0, 0n, '', NaN, false, 9, 10, [true, 'abc']]],
  [`
    f = [u ops v ...w =>
      x =: 5;
      y =: 6;
      z =: 7;
      @ u x y z v w];
    \\f 10 (# x 20 z null) 30 40 50;`,
      [10, 20, 6, 7, 30, [40, 50]]],
  [`\\[ops -> w =: 5;]`,   5],
  [`\\[ops -> w =: 5; w]`, 5],
  [`\\[ops -> ops]`, {}]
], true);

testEach('update assignment', [
  ['x = 10; x += 4;',     14],
  ['x = 10; x += 4; x',   14],
  ['x = 10; x -= 4; x',    6],
  ['x = 10; x *= 4; x',   40],
  ['x = 10; x /= 2; x',    5],
  ['x = 10; x %= 7; x',    3],
  ['x = 10; x ^= 3; x', 1000],
]);

testEach('destructure object', [
  [`o = # u 5 v 6 w 7;
    u v w #= o;
    (u == 5) && (v == 6) && (w == 7)`,
      true
  ],
  [`uv wx #= # wx "a";
    (uv == undefined) && (wx == "a");`,  
      true
  ],
  [`o = # u 5 v 6 w 7;
    v ...z #= o;
    (v = 6) && (z :u == 5) && (z :w == 7);`,
      true
  ],
]);

testEach('destructure array', [
  [`u v @= @ 5 6;
    (u == 5) && (v == 6);`,
      true
  ],
  [`x = @ 5 6 7;
    u null v w @= x;
    (u == 5) && (v == 7) && (w == undefined);`,  
      true
  ],
  [`x = @ 5 6 7;
    u ...v @= x;
    (u == 5) && (v :length == 2) && (v :0 == 6) && (v :1 == 7)`,
      true
  ],
]);

testEach('destructure returns object', [
  ['u v #= # u 5 v 6;', {u: 5, v: 6}],
  ['u v @= @ 5 6;',     [5, 6]],
], true);

