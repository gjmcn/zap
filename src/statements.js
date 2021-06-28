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
// - When a statement has multiple branches (i.e. versions):
//    - the first components of the branches are always identical
//    - the second components of the branches can be used to identify which
//      branch is in use
// 
////////////////////////////////////////////////////////////////////////////////

export const structures, allFirstWords, simpleFirstWords, blockFirstWords;

const statements = new Map();
  

// ========== simple statements (i.e. no block) ==========

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

// print
statements.set('print', [
  [
    {type: 'keyword', word: 'print', compile: () => 'console.log('},
    {type: 'expr', after: ')'}
  ]
]);

// let
{
  const firstComponent = {
    type: 'keyword',
    word: 'let',
    compile: () => 'let '
  };
  statements.set('let', [
    [
      firstComponent,
      {type: 'name', compile: name => name},
      {type: 'assignOp', optional: 2},
      {type: 'expr'}
    ],
    [
      firstComponent,
      {type: 'destructure'},
      {type: 'assignOp'},
      {type: 'expr'}
    ]
  ]);
}

// fix
{
  const firstComponent = {
    type: 'keyword',
    word: 'fix',
    compile: () => 'const '
  };
  statements.set('fix', [
    [
      firstComponent,
      {type: 'name', compile: name => name},
      {type: 'assignOp'},
      {type: 'expr'}
    ],
    [
      firstComponent,
      {type: 'destructure'},
      {type: 'assignOp'},
      {type: 'expr'}
    ]
  ]);
}

// set
{
  const firstComponent =  {type: 'keyword', word: 'set', compile: () => ''};
  statements.set('set', [
    [
      firstComponent,
      {type: 'name', compile: name => name},
      {type: 'anyAssignOp'},
      {type: 'expr'}
    ],
    [
      firstComponent,
      {type: 'destructure'},
      {type: 'assignOp'},
      {type: 'expr'}
    ]
  ]);
}

// mut
statements.set('mut', [
  [
    {type: 'keyword', word: 'mut', compile: () => ''},
    {type: 'getterExpr'},
    {type: 'anyAssignOp'},
    {type: 'expr'}
  ]
]);

// export
{
  const firstComponent = {
    type: 'keyword',
    word: 'export',
    compile: () => 'export '
  };
  statements.set('export', [
    [
      firstComponent,
      {type: 'default', word: 'default', compile: () => 'default '},
      {type: 'expr'},
    ],
    [
      firstComponent,
      {type: 'namesAs'}
    ]
  ]);
}

// import
{
  const firstComponent = {
    type: 'keyword',
    word: 'import',
    compile: () => 'import '
  };
  statements.set('import', [
    [
      firstComponent,
      {type: 'keyword', word: 'default', compile: () => ''},
      {type: 'keyword', word: 'as', compile: () => ''},
      {type: 'name', compile: name => name},
      {type: 'keyword', word: 'from', compile: () => ' from '},
      {type: 'pathLit', compile: p => p}
    ],
    [
      firstComponent,
      {type: 'keyword', word: 'all', compile: () => '*'},
      {type: 'keyword', word: 'as', compile: () => ' as '},
      {type: 'name', compile: name => name},
      {type: 'keyword', word: 'from', compile: () => ' from '},
      {type: 'pathLit', compile: p => p}
    ],
    [
      firstComponent,
      {type: 'namesAs', optional: 2},
      {type: 'keyword', word: 'from', compile: () => ' from '},
      {type: 'pathLit', compile: p => p}
    ],
  ]);
}


// ========== block statements ==========

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
{
  const firstComponent = {
    type: 'keyword',
    word: new Set(['each', 'awaitEach']),
    compile: word => `for ${word === 'each' ? '' : 'await '}(let `
  }
  statements.set(new Set(['each', 'awaitEach']), [
    [
      firstComponent,
      {type: 'name', compile: name => name},
      {type: 'keyword', word: 'of', compile: () => ' of '},
      {type: 'expr', after: ')'},
      {type: 'block'}
    ],
    [
      firstComponent,
      {type: 'destructure'},
      {type: 'keyword', word: 'of', compile: () => ' of '},
      {type: 'expr', after: ')'},
      {type: 'block'}
    ]
  ]);
}

// loop
statements.set('loop', [
  [
    {type: 'keyword', word: 'loop', compile: () => 'for (let _limit_ = '},
    {type: 'expr', optional: 1, ifOmitted: 'Infinity'},
    {
      type: 'keyword',
      word: 'index',
      compile: () => '',
      optional: 2,
      ifOmitted: `, _index_ = 0; _index_ < _limit_; _index_++)`
    },
    {
      type: 'name',
      compile: name => `, ${name} = 0; ${name} < _limit_; ${name}++)`
    },
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
    {type: 'block', after: '}'},
  ]
]);


// ========== exports ==========

// unlike the statements map, the structures object has a single word for each
// key - so some keys point to the same object
structures = {};
allFirstWords = new Set ();
for (let [key, struc] of statements) {
  if (typeof key === 'string') {
    structures[key] = struc;
    allFirstWords.add(key);
  }
  else {
    for (let k of key) {
      structures[k] = struc;
      allFirstWords.add(k);
    }
  }
}

// simple statements have no block components
simpleFirstWords = new Set();
blockFirstWords  = new Set();
outerLoop: for (let fw of allFirstWords) {
  for (let branch of structures[fw]) {
    if (branch.some(obj => obj.type === 'block')) {
      blockFirstWords.add(fw);
      continue outerLoop;
    }
  }
  simpleFirstWords.add(fw);
}