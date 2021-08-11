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
// - Components of type 'keyword', 'unreservedName' and 'asUnreservedName' have
//   a compile function that is passed the corresponding token value and
//   generates the JS. The JS for other component types is handled in
//   components.js.
//
// - The requirement that try statements have at least one of 'catch' or
//   'finally' is not encoded here.
// 
// - When a statement has multiple branches (i.e. versions), all branches have
//   the same first component (i.e. opening keyword). The second component of
//   each branch uniquely identifies the branch (and unless on the last branch,
//   should not be optional)
////////////////////////////////////////////////////////////////////////////////

export const structures, allFirstWords, simpleFirstWords, blockFirstWords;

const statements = new Map();
  

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
{
  const firstComponent = {type: 'keyword', word: 'let', compile: () => 'let '};
  statements.set('let', [
    [
      firstComponent,
      {type: 'unreservedName', compile: name => name},
      {type: 'keyword', word: 'be', compile: () => ' = ', optional: 2},
      {type: 'expression'}
    ],
    [
      firstComponent,
      {type: 'destructure'},
      {type: 'keyword', word: 'be', compile: () => ' = '},
      {type: 'expression'}
    ]
  ]);
}

// set
{
  const createBranch = component => {
    const isDestructure = component.type === 'destructure';
    return [
      {
        type: 'keyword',
        word: 'set',
        compile: isDestructure ? () => '(' : () => ''
      },
      component,
      {type: 'keyword', word: 'to', compile: () => ' = '},
      {type: 'expression', after: isDestructure ? ')' : ''}
    ]
  };
  statements.set('set', [
    createBranch({type: 'unreservedName', compile: name => name}),
    createBranch({type: 'getterExpression'}),
    createBranch({type: 'destructure'})
  ]);
}

// cet
{
  const firstComponent = {type: 'keyword', word: 'cet', compile: () => ''};
  statements.set('cet', [
    [
      firstComponent,
      {type: 'unreservedName', compile: name => name},
      {type: 'keyword', word: 'to', compile: () => ' ??= '},
      {type: 'expression'}
    ],
    [
      firstComponent,
      {type: 'getterExpression'},
      {type: 'keyword', word: 'to', compile: () => ' ??= '},
      {type: 'expression'}
    ]
  ]);
}

// inc
{
  const createBranch = component => [
    {type: 'keyword', word: 'inc', compile: () => ''},
    component,
    {
      type: 'keyword',
      word: 'by',
      compile: () => ' += ',
      optional: 2,
      ifOmitted: '++'
    },
    {type: 'expression'}
  ];
  statements.set('inc', [
    createBranch({type: 'unreservedName', compile: name => name}),
    createBranch({type: 'getterExpression'})
  ]);
}

// dec
{
  const createBranch = component => [
    {type: 'keyword', word: 'dec', compile: () => ''},
    component,
    {
      type: 'keyword',
      word: 'by',
      compile: () => ' -= ',
      optional: 2,
      ifOmitted: '--'
    },
    {type: 'expression'}
  ];
  statements.set('dec', [
    createBranch({type: 'unreservedName', compile: name => name}),
    createBranch({type: 'getterExpression'})
  ]);
}

// wait
statements.set('wait', [
  [
    {
      type: 'keyword',
      word: 'wait',
      compile: () => 'await new Promise(r => setTimeout(r, ('
    },
    {type: 'expression', after: ')))'}
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
      {type: 'namesAs'}
    ],
    [
      firstComponent,
      {type: 'keyword', word: 'default', compile: () => 'default '},
      {type: 'unreservedName', compile: name => name}
    ]
  ]);
}

// import
{
  const createBranch = (...comps) => [
    {type: 'keyword', word: 'import', compile: () => 'import '},
    ...comps,
    {type: 'keyword', word: 'from', compile: () => ' from '},
    {type: 'pathLit'}
  ];
  statements.set('import', [
    createBranch({type: 'namesAs', optional: 2}),
    createBranch(
      {type: 'keyword', word: 'default', compile: () => ''},
      {type: 'asUnreservedName', compile: name => name}
    ),
    createBranch(
      {type: 'keyword', word: 'all', compile: () => '* as '},
      {type: 'asUnreservedName', compile: name => name}
    )
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

// asyncBlock
statements.set('asyncBlock', [
  [
    {type: 'keyword', word: 'asyncBlock', compile: () => '(async () => '},
    {type: 'block', after: ')()'}
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
{
  const createBranch = component => [
    {
      type: 'keyword',
      word: new Set(['each', 'awaitEach']),
      compile: word => `for ${word === 'each' ? '' : 'await '}(let `
    },
    component,
    {type: 'keyword', word: 'of', compile: () => ' of '},
    {type: 'expression', after: ')'},
    {type: 'block'}
  ];
  statements.set(new Set(['each', 'awaitEach']), [
    createBranch({type: 'unreservedName', compile: name => name}),
    createBranch({type: 'destructure'})
  ]);
}

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
blockFirstWords = new Set();
outerLoop: for (let fw of allFirstWords) {
  for (let branch of structures[fw]) {
    if (branch.some(obj => obj.type === 'block')) {
      blockFirstWords.add(fw);
      continue outerLoop;
    }
  }
  simpleFirstWords.add(fw);
}