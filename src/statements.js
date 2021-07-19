////////////////////////////////////////////////////////////////////////////////
// The 'component' structure of each statement. Notes:
// 
// - The 'optional' property indicates if a component can be omitted and if so,
//   the number of components in the group. So 'optional: 1' indicates that the
//   component itself can be omitted, whereas 'optional: 3' indicates that the
//   component and the 2 following components are included/omitted as a group.
//
// - Components with an 'optional' property can have one (or none) of:
//     - 'ifOmitted': code to add if optional group omitted 
//     - 'repeat': whether the optional group can be repeated
//
// - Components of type 'keyword' and 'unreservedName' have a compile function
//   that is passed the corresponding token value and generates the JS. The
//   JS for other component types is handled in components.js.
//
// - The requirement that try statements have at least one of 'catch' and
//   'finally' is not encoded here.
// 
// - When a statement has multiple branches (i.e. versions):
//    - the first component of each branch is identical
//    - the second component of each branch uniquely identifies the branch (and
//      unless on the last branch, should not be optional)
//
////////////////////////////////////////////////////////////////////////////////

export const structures, allFirstWords, simpleFirstWords, blockFirstWords;

const statements = new Map();
  

// ========= simple statements (i.e. do not contain a block component) =========

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
    {type: 'expression'}
  ]
]);

// out
statements.set('out', [
  [
    {type: 'keyword', word: 'out', compile: () => 'return '},
    {type: 'expression', optional: 1}
  ]
]);

// throw
statements.set('throw', [
  [
    {type: 'keyword', word: 'throw', compile: () => 'throw '},
    {type: 'expression'}
  ]
]);

// print
statements.set('print', [
  [
    {type: 'keyword', word: 'print', compile: () => 'console.log('},
    {type: 'expression', after: ')'}
  ]
]);

// delete
statements.set('delete', [
  [
    {type: 'keyword', word: 'delete', compile: () => 'delete '},
    {type: 'getterExpression'}
  ]
]);

// let
statements.set('let', [
  [
    {type: 'keyword', word: 'let', compile: () => 'let '},
    {type: 'unreservedName', compile: name => name},
    {type: 'keyword', word: 'be', compile: () => ' = ', optional: 2},
    {type: 'expression'}
  ]
]);

// let_
statements.set('let_', [
  [
    {type: 'keyword', word: 'let_', compile: () => 'let ['},
    {type: 'unreservedNames'},
    {type: 'keyword', word: 'be', compile: () => '] = '},
    {type: 'expression'}
  ]
]);

// let__
statements.set('let__', [
  [
    {type: 'keyword', word: 'let__', compile: () => 'let {'},
    {type: 'unreservedNames'},
    {type: 'keyword', word: 'be', compile: () => '} = '},
    {type: 'expression'}
  ]
]);

// set
{
  const firstComponent = {type: 'keyword', word: 'set', compile: () => ''};
  statements.set('set', [
    [
      firstComponent,
      {type: 'unreservedName', compile: name => name},
      {type: 'keyword', word: 'to', compile: () => ' = '},
      {type: 'expression'}
    ],
    [
      firstComponent,
      {type: 'getterExpression'},
      {type: 'keyword', word: 'to', compile: () => ' = '},
      {type: 'expression'}
    ]
  ]);
}

// set_
statements.set('set_', [
  [
    {type: 'keyword', word: 'set_', compile: () => '['},
    {type: 'unreservedNames'},
    {type: 'keyword', word: 'to', compile: () => '] = '},
    {type: 'expression'}
  ]
]);

// set__
statements.set('set__', [
  [
    {type: 'keyword', word: 'set__', compile: () => '({'},
    {type: 'unreservedNames'},
    {type: 'keyword', word: 'to', compile: () => '} = '},
    {type: 'expression', after: ')'}
  ]
]);

// use
{
  const firstComponent = {type: 'keyword', word: 'use', compile: () => ''};
  statements.set('use', [
    [
      firstComponent,
      {type: 'unreservedName', compile: name => name},
      {type: 'keyword', word: 'or', compile: () => ' ??= '},
      {type: 'expression'}
    ],
    [
      firstComponent,
      {type: 'getterExpression'},
      {type: 'keyword', word: 'or', compile: () => ' ??= '},
      {type: 'expression'}
    ]
  ]);
}

// inc
{
  const firstComponent = {type: 'keyword', word: 'inc', compile: () => ''};
  statements.set('inc', [
    [
      firstComponent,
      {type: 'unreservedName', compile: name => name},
      {type: 'keyword', word: 'by', compile: () => ' += '},
      {type: 'expression'}
    ],
    [
      firstComponent,
      {type: 'getterExpression'},
      {type: 'keyword', word: 'by', compile: () => ' += '},
      {type: 'expression'}
    ]
  ]);
}

// dec
{
  const firstComponent = {type: 'keyword', word: 'dec', compile: () => ''};
  statements.set('dec', [
    [
      firstComponent,
      {type: 'unreservedName', compile: name => name},
      {type: 'keyword', word: 'by', compile: () => ' -= '},
      {type: 'expression'}
    ],
    [
      firstComponent,
      {type: 'getterExpression'},
      {type: 'keyword', word: 'by', compile: () => ' -= '},
      {type: 'expression'}
    ]
  ]);
}

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
      {type: 'keyword', word: 'default', compile: () => 'default '},
      {type: 'expression'},
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
      {type: 'unreservedName', compile: name => name},
      {type: 'keyword', word: 'from', compile: () => ' from '},
      {type: 'pathLit'}
    ],
    [
      firstComponent,
      {type: 'keyword', word: 'all', compile: () => '*'},
      {type: 'keyword', word: 'as', compile: () => ' as '},
      {type: 'unreservedName', compile: name => name},
      {type: 'keyword', word: 'from', compile: () => ' from '},
      {type: 'pathLit'}
    ],
    [
      firstComponent,
      {type: 'namesAs', optional: 2},
      {type: 'keyword', word: 'from', compile: () => ' from '},
      {type: 'pathLit'}
    ],
  ]);
}


// ========== block statements (i.e. contain a 'block' component) ==========

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
    {type: 'expression'},
    {type: 'block'},
    {
      type: 'keyword',
      word: 'elif',
      compile: () => 'else if ',
      optional: 3,
      repeat: true
    },
    {type: 'expression'},
    {type: 'block'},
    {type: 'keyword', word: 'else', compile: () => 'else ', optional: 3},
    {type: 'expression'},
    {type: 'block'},
  ]
]);

// while
statements.set('while', [
  [
    {type: 'keyword', word: 'while', compile: () => 'while '},
    {type: 'expression'},
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
    {type: 'unreservedName', compile: name => name},
    {type: 'keyword', word: 'of', compile: () => ' of '},
    {type: 'expression', after: ')'},
    {type: 'block'}
  ]
]);

// each_, awaitEach_
statements.set(new Set(['each_', 'awaitEach_']), [
  [
    {
      type: 'keyword',
      word: new Set(['each_', 'awaitEach_']),
      compile: word => `for ${word === 'each_' ? '' : 'await '}(let [`
    },
    {type: 'unreservedNames'},
    {type: 'keyword', word: 'of', compile: () => '] of '},
    {type: 'expression', after: ')'},
    {type: 'block'}
  ]
]);

// each__, awaitEach__
statements.set(new Set(['each__', 'awaitEach__']), [
  [
    {
      type: 'keyword',
      word: new Set(['each__', 'awaitEach__']),
      compile: word => `for ${word === 'each__' ? '' : 'await '}(let {`
    },
    {type: 'unreservedNames'},
    {type: 'keyword', word: 'of', compile: () => '} of '},
    {type: 'expression', after: ')'},
    {type: 'block'}
  ]
]);

// loop
statements.set('loop', [
  [
    {type: 'keyword', word: 'loop', compile: () => 'for (let _limit_ = '},
    {type: 'expression', optional: 1, ifOmitted: 'Infinity'},
    {
      type: 'keyword',
      word: 'index',
      compile: () => '',
      optional: 2,
      ifOmitted: `, _index_ = 0; _index_ < _limit_; _index_++)`
    },
    {
      type: 'unreservedName',
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
    {type: 'unreservedName', compile: name => `${name})`},
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
    {type: 'unreservedName', compile: name => name},
    {
      type: 'keyword',
      word: 'par',
      compile: () => '',
      optional: 2,
      ifOmitted: '()'
    },
    {type: 'params'},
    {type: 'block'},
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
      compile: () => 'extends ',
      optional: 2,
      ifOmitted: '{ constructor'
    },
    {type: 'unreservedName', compile: name => `${name} { constructor`},
    {
      type: 'keyword',
      word: 'par',
      compile: () => '',
      optional: 2,
      ifOmitted: '()'
    },
    {type: 'params'},
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