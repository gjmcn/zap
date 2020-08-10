const {simpleTest} = require('./test-helpers.js');

simpleTest('call inline', 'fun x (x + 10) call 20', 30);
simpleTest('call [] function inline', '[a + 10] 20 call', 30);
simpleTest('call {} function inline', 'call {a + 10} 20', 30);
simpleTest('call no argument', '[10] call', 10);
simpleTest('call multiple arguments', 'fun x y z (+ x y z) call 5 6 7', 18);

simpleTest('apply inline', 'fun x (x + 10) apply (@ 20)', 30);
simpleTest('apply [] function inline', '[a + b] apply (@@ 10 20), 30')
simpleTest('apply {} function inline', 'apply {c} "ijk"', 'k');
simpleTest('apply, no argument', '[10] apply', 10);