////////////////////////////////////////////////////////////////////////////////
// The 'component' structure of each statement. Notes:
// 
// - The optional property indicates if a component can be omitted and if so,
//   the number of components in the group. So 'optional: 1' indicates that the
//   component itself can be omitted, whereas 'optional: 3' indicates that the
//   component and the 2 following components are included/omitted as a group.
//
// - Components of type 'keyword', 'name' and 'pathLit' have a compile
//   function that is passed the corresponding token value and generates the JS.
//   The compile function for other component types is defined with the
//   component (in components.js).
//
// - Some statements have additional structure that is not included here. E.g.
//   an 'if' statement can have multiple 'elif's, and a 'try' statement requires
//   at least one of 'catch' and 'finally'.
// 
////////////////////////////////////////////////////////////////////////////////

export const statements = new Map();
  
// debugger
statements.set('debugger', [
  [
    {type: 'keyword', word: 'debugger', compile: () => 'debugger'}
  ]
]);

// break, continue
statements.set(new Set(['break', 'continue']), [
  [
    {
      type: 'keyword',
      word: new Set(['break', 'continue']),
      compile: word => word
    }
  ]
]);

// do
statements.set('do', [
  [
    {type: 'keyword', word: 'do', compile: () => ''},
    {type: 'expr'}
  ]
]);

// out
statements.set('out', [
  [
    {type: 'keyword', word: 'out', compile: () => 'return '},
    {type: 'expr', optional: 1}
  ]
]);

// throw
statements.set('throw', [
  [
    {type: 'keyword', word: 'throw', compile: () => 'throw '},
    {type: 'expr'}
  ]
]);

// const, let, var
statements.set(new Set(['const', 'let', 'var']), [
  [
    {
      type: 'keyword',
      word: new Set(['const', 'let', 'var']),
      compile: word => `${word} `
    },
    {type: 'name', compile: name => name},
    {type: 'assignOp', optional: 2},
    {type: 'expr'}
  ],
  [
    {
      type: 'keyword',
      word: new Set(['const', 'let', 'var']),
      compile: word => `${word} `
    },
    {type: 'destructure'},
    {type: 'assignOp'},
    {type: 'expr'}
  ]
]);

// set
statements.set('set', [
  [
    {type: 'keyword', word: 'set', compile: () => ''},
    {type: 'name', compile: name => name},
    {type: 'anyAssignOp'},
    {type: 'expr'}
  ],
  [
    {type: 'keyword', word: 'set', compile: () => ''},
    {type: 'destructure'},
    {type: 'assignOp'},
    {type: 'expr'}
  ],
  [
    {type: 'keyword', word: 'set', compile: () => ''},
    {type: 'getterExpr'},
    {type: 'anyAssignOp'},
    {type: 'expr'}
  ]
]);

// block
statements.set('block', [
  [
    {type: 'keyword', word: 'block', compile: () => ''},
    {type: 'block'}
  ]
]);

// if
statements.set('if', [
  [
    {type: 'keyword', word: 'if', compile: () => 'if '},
    {type: 'expr'},
    {type: 'block'},
    {type: 'keyword', word: 'elif', compile: () => 'else if ', optional: 3},
    {type: 'expr'},
    {type: 'block'},
    {type: 'keyword', word: 'else', compile: () => 'else ', optional: 3},
    {type: 'expr'},
    {type: 'block'},
  ]
]);

// while
statements.set('while', [
  [
    {type: 'keyword', word: 'while', compile: () => 'while '},
    {type: 'expr'},
    {type: 'block'}
  ]
]);

// each, awaitEach
statements.set(new Set(['each', 'awaitEach']), [
  [
    {
      type: 'keyword',
      word: new Set(['each', 'awaitEach']),
      compile: word => `for ${word === 'each' ? '' : 'await '}(let `
    },
    {type: 'name', compile: name => name},
    {type: 'keyword', word: 'of', compile: () => ' of '},
    {type: 'expr', after: () => ')'},
    {type: 'block'}
  ],
  [
    {
      type: 'keyword',
      word: new Set(['each', 'awaitEach']),
      compile: word => `for ${word === 'each' ? '' : 'await '}(let `
    },
    {type: 'destructure'},
    {type: 'keyword', word: 'of', compile: () => ' of '},
    {type: 'expr', after: () => ')'},
    {type: 'block'}
  ]
]);

// try
statements.set('try', [
  [
    {type: 'keyword', word: 'try', compile: () => 'try '},
    {type: 'block'},
    {type: 'keyword', word: 'catch', compile: () => 'catch (', optional: 3},
    {type: 'name', compile: name => `${name})`},
    {type: 'block'},
    {type: 'keyword', word: 'finally', compile: () => 'finally ', optional: 2},
    {type: 'block'}
  ]
]);

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
    {type: 'name', compile: name => name},
    {
      type: 'keyword',
      word: 'par',
      compile: () => '',
      optional: 2,
      ifOmitted: '()'
    },
    {type: 'params', },
    {type: 'block'},
  ],
  [
    {
      type: 'keyword',
      word: new Set(['fun', 'gen', 'asyncFun', 'asyncGen']),
      compile: () => '{'
    },
    {type: 'getterExpr', after: statementWord => {
        switch (statementWord) {
          case 'fun':       return ' = (function ';
          case 'gen':       return ' = (function* ';
          case 'asyncFun':  return ' = (async function ';
          case 'asyncGen':  return ' = (async function* ';
        }
      }
    },
    {
      type: 'keyword',
      word: 'par',
      compile: () => '',
      optional: 2,
      ifOmitted: '()'
    },
    {type: 'params',},
    {type: 'block', after: () => ')}'},
  ]
]);

// class
statements.set('class', [
  [
    {type: 'keyword', word: 'class', compile: () => 'class '},
    {type: 'name', compile: name => name},
    {
      type: 'keyword',
      word: 'extends',
      compile: () => 'extends ',
      optional: 2,
      ifOmitted: '{ constructor'
    },
    {type: 'name', compile: name => `${name} { constructor`},
    {
      type: 'keyword',
      word: 'par',
      compile: () => '',
      optional: 2,
      ifOmitted: '()'
    },
    {type: 'params',},
    {type: 'block', after: () => '}'},
  ]
]);

// export
statements.set('export', [
  [
    {type: 'keyword', word: 'export', compile: () => 'export '},
    {type: 'default', word: 'default', compile: () => ' default '},
    {type: 'expr'},
  ],
  [
    {type: 'keyword', word: 'export', compile: () => 'export '},
    {type: 'namesAs'}
  ]
]);

// import
statements.set('import', [
  [
    {type: 'keyword', word: 'import', compile: () => 'import '},
    {type: 'name', compile: name => name},
    {type: 'keyword', word: 'from', compile: ' from '},
    {type: 'pathLit', compile: p => p}
  ],
  [
    {type: 'keyword', word: 'import', compile: () => 'import '},
    {type: 'keyword', word: 'all', compile: () => '*'},
    {type: 'keyword', word: 'as', compile: ' as '},
    {type: 'name', compile: name => name},
    {type: 'keyword', word: 'from', compile: ' from '},
    {type: 'pathLit', compile: p => p}
  ],
  [
    {type: 'keyword', word: 'import', compile: () => 'import '},
    {type: 'namesAs', optional: 2},
    {type: 'keyword', word: 'from', compile: ' from '},
    {type: 'pathLit', compile: p => p}
  ],
]);

// split statement-first-words into simple (no block components) and block
export const simpleFirstWords = new Set();
export const blockFirstWords  = new Set();
function addToSet(list, value) {
  if (typeof value === 'string') {
    list.add(value);
  }
  else {
    for (let v of value) {
      list.add(v);
    }
  }
}
statementLoop: for (let [key, structure] of statements) {
  for (let branch of structure) {
    if (branch.some(obj => obj.type === 'block')) {
      addToSet(blockFirstWords, key);
      continue statementLoop;
    }
  }
  addToSet(simpleFirstWords, key);
}