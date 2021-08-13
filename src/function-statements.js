////////////////////////////////////////////////////////////////////////////////
// Function 'statements'.
// 
// Functions are not true statements since they are inside expressions, but are
// otherwise like block statements.
//
// Unlike normal statements, each statement is a single brnach rather than an
// array of potential branches.
////////////////////////////////////////////////////////////////////////////////

// export const structures, allFirstWords, simpleFirstWords, blockFirstWords;


const statements = new Map();


// fun
statements.set('fun', [ 
  {type: 'keyword', word: 'fun', compile: () => '(function(',}
  {type:}
]);

  

// ========= simple statements (i.e. do not contain a block component) =========

// break, continue, debugger
statements.set(new Set(['break', 'continue', 'debugger']), [
  [
    {
      type: 'keyword',
      word: new Set(['break', 'continue', 'debugger']),
      compile: word => word
    }
  ]
]);



// parameter components, used by function and class statements
const parameterComponents = [
  {type: 'keyword', word: 'par', compile: () => '', optional: 2},
  {type: 'unreservedNames', after: ','},
  {type: 'keyword', word: 'def', compile: () => '', optional: 2},
  {type: 'defaultObjectExpression', after: ','},
  {type: 'keyword', word: 'ops', compile: () => '', optional: 2},
  {type: 'optionObjectExpression', after: ','},
  {type: 'keyword', word: 'rem', compile: () => '', optional: 2},
  {type: 'unreservedName', compile: name => `...${name}`},
];

// function
statements.set(new Set(['fun', 'gen', 'asyncFun', 'asyncGen']), [
  [
    {
      type: 'keyword',
      word: new Set(['fun', 'gen', 'asyncFun', 'asyncGen']),
      compile: word => {
        switch (word) {
          case 'fun':       return 'function ';
          case 'gen':       return 'function* ';
          case 'asyncFun':  return 'async function ';
          case 'asyncGen':  return 'async function* ';
        }
      }
    },
    {type: 'unreservedName', compile: name => `${name}(`},
    ...parameterComponents,
    {type: 'functionBlock'},
  ]
]);

// class
statements.set('class', [
  [
    {type: 'keyword', word: 'class', compile: () => 'class '},
    {type: 'unreservedName', compile: name => name},
    {
      type: 'keyword',
      word: 'extends',
      compile: () => ' extends ',
      optional: 2,
      ifOmitted: ' { constructor('
    },
    {type: 'unreservedName', compile: name => `${name} { constructor(`},
    ...parameterComponents,
    {type: 'functionBlock', after: '}'},
  ]
]);