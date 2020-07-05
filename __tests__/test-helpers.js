const each = require('jest-each').default;
const zap = require('../dist/zap.cjs');

function tokens(zapCode, prop = 'tokens') {
  try {
    return zap(zapCode, {[prop]: true, js: false})[prop];
  }
  catch (err) {  // if throw err, jest output includes entire zap.cjs
    throw Error(err.message);
  }
}

function compute(code, ops) {
  try {
    var jsCode = zap(code, ops).js;
  }
  catch (err) {  // if throw err, jest output includes entire zap.cjs
    throw Error(err.message);
  }
  return (1, eval)(jsCode);
}

function testEach(description, questions, objCompare) {
  each(questions).test(`${description}: %s`, (q, a) => {
    expect(compute(q))[objCompare ? 'toStrictEqual' : 'toBe'](a);
  });
}
  
function simpleTest(description, code, result) {
  test(description, () => expect(compute(code)).toBe(result));
}

module.exports = {tokens, compute, testEach, simpleTest};