const each = require('jest-each').default;
const zap = require('../dist/zap.cjs');

function compute(code, ops) {
  try {
    var jsCode = zap(code, ops).js; 
  }
  catch (err) {  // return error (if throw, jest output includes entire zap.cjs)
    return err;
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

module.exports = {compute, testEach, simpleTest};