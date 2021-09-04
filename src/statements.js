////////////////////////////////////////////////////////////////////////////////
// The 'component' structure of each statement. Notes:
// 
// - The 'optional' property indicates if a component can be omitted and if so,
//   the number of components in the group. So 'optional: 1' indicates that the
//   component itself can be omitted, whereas 'optional: 3' indicates that the
//   component and the 2 following components are included/omitted as a group.
//
// - An optional group is 'commited to' based on its first component, so this
//   cannot be the same as the component that follows the optional group.
//
// - Components with an 'optional' property can have one (or none) of:
//     - 'ifOmitted': string/function, code to add if optional group omitted 
//     - 'repeat': whether the optional group can be repeated
//
// - Some components types have a compile property: a string or a function that
//   is passed the corresponding token value and generates the JS. The JS for
//   other component types is handled in components.js.
// 
// - When a statement has multiple branches (i.e. versions), all branches have
//   the same first component (i.e. opening keyword). The second component of
//   each branch uniquely identifies the branch (and unless on the last branch,
//   should not be optional)
////////////////////////////////////////////////////////////////////////////////

export let structures, allFirstWords, simpleFirstWords, blockFirstWords;

const statements = new Map();


// ========= reusable components ==========

const destructuredObject = {type: 'nameAsDef', optional: 1, repeat: true};

const destructuredArray = 
  {type: 'unreservedNameDef', optional: 1, repeat: true};

let parameterKeyword;
const parameterSignature = [
  {
    type: 'keyword',
    word: new Set(['par', 'prop', 'elmt']),
    compile: word => {
      parameterKeyword = word;
      if      (word === 'par' ) return '(';
      else if (word === 'prop') return '({';
      else                      return '([';
    },
    optional: 1,
    ifOmitted: () => {
      parameterKeyword = 'par';
      return '(';
    }
  },
  (parameterKeyword === 'prop' ? destructuredObject : destructuredArray),
  {
    type: 'insert',
    value: () => parameterKeyword === 'par'
      ? ')'
      : (parameterKeyword === 'prop' ? '})' : '])')
  }
];


// ========= simple statements (i.e. do not contain a block component) =========

// break, continue, debugger
{
  const words = new Set(['break', 'continue', 'debugger'])
  statements.set(words, [
    [
      {type: 'keyword', word: words, compile: word => word}
    ]
  ]);
}

// do
statements.set('do', [
  [
    {type: 'keyword', word: 'do', compile: ''},
    {type: 'expression'}
  ]
]);

// out
statements.set('out', [
  [
    {type: 'keyword', word: 'out', compile: 'return '},
    {type: 'expression', optional: 1}
  ]
]);

// throw
statements.set('throw', [
  [
    {type: 'keyword', word: 'throw', compile: 'throw '},
    {type: 'expression'}
  ]
]);

// print
statements.set('print', [
  [
    {type: 'keyword', word: 'print', compile: 'console.log('},
    {type: 'expression'},
    {type: 'insert', value: ')'}
  ]
]);

// delete
statements.set('delete', [
  [
    {type: 'keyword', word: 'delete', compile: 'delete '},
    {type: 'getterExpression'}
  ]
]);

// let
statements.set('let', [
  [
    {type: 'keyword', word: 'let', compile: 'let '},
    {type: 'unreservedName', compile: name => name},
    {type: 'keyword', word: 'be', compile: ' = ', optional: 2},
    {type: 'expression'}
  ]
]);

// get
{
  const firstComponent = {type: 'keyword', word: 'get', compile: 'let '}
  statements.set('get', [
    [
      firstComponent,
      {type: 'keyword', word: 'prop', compile: '{'},
      destructuredObject,
      {type: 'keyword', word: 'from', compile: '} = '},
      {type: 'expression'}
    ],
    [
      firstComponent,
      {type: 'keyword', word: 'elmt', compile: '['},
      destructuredArray,
      {type: 'keyword', word: 'from', compile: '] = '},
      {type: 'expression'}
    ]
  ]);
}

// set
{
  const createBranch = component => {
    return [
      {type: 'keyword', word: 'set', compile: ''},
      component,
      {type: 'keyword', word: 'to', compile: ' = '},
      {type: 'expression'}
    ]
  };
  statements.set('set', [
    createBranch({type: 'unreservedName', compile: name => name}),
    createBranch({type: 'getterExpression'}),
  ]);
}

// cet
{
  const createBranch = component => {
    return [
      {type: 'keyword', word: 'cet', compile: ''},
      component,
      {type: 'keyword', word: 'to', compile: ' ??= '},
      {type: 'expression'}
    ]
  };
  statements.set('cet', [
    createBranch({type: 'unreservedName', compile: name => name}),
    createBranch({type: 'getterExpression'}),
  ]);
}

// inc
{
  const createBranch = component => [
    {type: 'keyword', word: 'inc', compile: ''},
    component,
    {
      type: 'keyword',
      word: 'by',
      compile: ' += ',
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
    {type: 'keyword', word: 'dec', compile: ''},
    component,
    {
      type: 'keyword',
      word: 'by',
      compile: ' -= ',
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
      compile: 'await new Promise(r => setTimeout(r, ('
    },
    {type: 'expression'},
    {type: 'insert', value: ')))'}
  ]
]);

// export
{
  const firstComponent = {type: 'keyword', word: 'export', compile: 'export '};
  statements.set('export', [
    [
      firstComponent,
      {type: 'namesAs'}
    ],
    [
      firstComponent,
      {type: 'keyword', word: 'default', compile: 'default '},
      {type: 'unreservedName', compile: name => name}
    ]
  ]);
}

// import
{
  const createBranch = (...comps) => [
    {type: 'keyword', word: 'import', compile: 'import '},
    ...comps,
    {type: 'keyword', word: 'from', compile: ' from '},
    {type: 'pathLit'}
  ];
  statements.set('import', [
    createBranch({type: 'namesAs', optional: 2}),
    createBranch(
      {type: 'keyword', word: 'default', compile: ''},
      {type: 'asUnreservedName', compile: name => name}
    ),
    createBranch(
      {type: 'keyword', word: 'all', compile: '* as '},
      {type: 'asUnreservedName', compile: name => name}
    )
  ]);
}


// ========== block statements (i.e. contain a 'block' component) ==========

// block
statements.set('block', [
  [
    {type: 'keyword', word: 'block', compile: ''},
    {type: 'block'}
  ]
]);

// if
statements.set('if', [
  [
    {type: 'keyword', word: 'if', compile: 'if ('},
    {type: 'expression'},
    {type: 'insert', value: ')'},
    {type: 'block'},
    {
      type: 'keyword',
      word: 'elif',
      compile: 'else if (',
      optional: 4,
      repeat: true
    },
    {type: 'expression'},
    {type: 'insert', value: ')'},
    {type: 'block'},
    {type: 'keyword', word: 'else', compile: 'else ', optional: 2},
    {type: 'block'},
  ]
]);

// while
statements.set('while', [
  [
    {type: 'keyword', word: 'while', compile: 'while ('},
    {type: 'expression'},
    {type: 'insert', value: ')'},
    {type: 'block'}
  ]
]);

// for
{
  const createBranch = (...comps) => [
    {type: 'keyword', word: 'for', compile: 'for (let '},
    ...comps,
    {type: 'expression'},
    {type: 'insert', value: ')'},
    {type: 'block'}
  ];
  statements.set('for', [
    createBranch(
      {type: 'keyword', word: 'each', compile: ''},
      {type: 'unreservedName', compile: name => name},
      {type: 'keyword', word: 'of', compile: ' of '}
    ),
    createBranch(
      {type: 'keyword', word: 'prop', compile: '{'},
      destructuredObject,
      {type: 'keyword', word: 'of', compile: '} of '}
    ),
    createBranch(
      {type: 'keyword', word: 'elmt', compile: '['},
      destructuredArray,
      {type: 'keyword', word: 'of', compile: '] of '}
    )
  ]);
}

// await
statements.set('await', [
  [
    {type: 'keyword', word: 'await', compile: 'for await (let '},
    {type: 'keyword', word: 'each', compile: ''},
    {type: 'unreservedName', compile: name => name},
    {type: 'keyword', word: 'of', compile: ' of '},
    {type: 'expression'},
    {type: 'insert', value: ')'},
    {type: 'block'}
  ]
]);

// loop
statements.set('loop', [
  [
    {type: 'keyword', word: 'loop', compile: 'for (let _limit_ = '},
    {type: 'expression', optional: 1, ifOmitted: 'Infinity'},
    {
      type: 'keyword',
      word: 'index',
      compile: '',
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
    {type: 'keyword', word: 'try', compile: 'try '},
    {type: 'block'},
    {
      type: 'keyword',
      word: 'catch',
      compile: 'catch (',
      optional: 3,
      ifOmitted: 'catch (e) {}'
    },
    {type: 'unreservedName', compile: name => `${name})`},
    {type: 'block'},
    {type: 'keyword', word: 'finally', compile: 'finally ', optional: 2},
    {type: 'block'}
  ]
]);

// fun, gen, @fun, @gen
{
  const words = new Set(['fun', 'gen', '@fun', '@gen']);
  statements.set(words, [
    [
      {
        type: 'keyword',
        word: words,
        compile: word => {
          const asyncStr = word[0] === '@' ? 'async ' : '';
          const genStr = word.slice(-3) === 'gen' ? '*' : '';
          return `${asyncStr}function${genStr} `;
        }
      },
      {type: 'unreservedName', compile: name => name},
      ...parameterSignature,
      {type: 'block'}
    ]
  ]);
}

// class
statements.set('class', [
  [
    {type: 'keyword', word: 'class', compile: 'class '},
    {type: 'unreservedName', compile: name => name},
    {type: 'keyword', word: 'extends', compile: () => ' extends ', optional: 2},
    {type: 'unreservedName', compile: name => name},
    {type: 'insert', value: ' {constructor'},
    ...parameterSignature,
    {type: 'block'},
    {type: 'insert', value: '}'}
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