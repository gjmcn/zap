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

import { parseComponent } from "./components";

export let structures, allFirstWords, simpleFirstWords, blockFirstWords,
           commaFirstWords;

const statements = new Map();


// ========= reusable components ==========

const destructureArray = [
  {type: 'openSquare', compile: '['},
  {
    type: 'unreservedName',
    compile: name => `${name},`,
    optional: 1,
    repeat: true
  },
  {type: 'closeSquare', compile: ']'}
];

const destructureObject = [
  {type: 'openCurly', compile: '{'},
  {type: 'nameOrRename', optional: 1, repeat: true},
  {type: 'closeCurly', compile: '}'}
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

// now
statements.set('now', [
  [
    {type: 'keyword', word: 'now', compile: ''},
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

// say
statements.set('say', [
  [
    {type: 'keyword', word: 'say', compile: 'console.log('},
    {type: 'expression'},
    {type: 'insert', value: ')'}
  ]
]);

// var
{
  const words = new Set(['var', 'export var']);
  const firstComponent = {
    type: 'keyword',
    word: words,
    compile: word => word === 'var' ? 'let ' : 'export let '
  };
  statements.set(words, [
    [
      firstComponent,
      {type: 'unreservedName', compile: name => name},
      {type: 'keyword', word: 'to', compile: ' = ', optional: 2},
      {type: 'expression'}
    ],
    [
      firstComponent,
      ...destructureArray,
      {type: 'keyword', word: 'to', compile: ' = '},
      {type: 'expression'}
    ],
    [
      firstComponent,
      ...destructureObject,
      {type: 'keyword', word: 'to', compile: ' = '},
      {type: 'expression'}
    ]
  ]);
}

// set
{
  const createBranch = (...comps) => [
    {type: 'keyword', word: 'set', compile: '('},
    ...comps,
    {type: 'keyword', word: 'to', compile: ` = `},
    {type: 'expression'},
    {type: 'insert', value: ')'}
  ];
  statements.set('set', [
    createBranch({type: 'unreservedName', compile: name => name}),
    createBranch(...destructureObject),
    createBranch(...destructureArray),
    {type: 'getterExpression'}
  ]);
}

// nil
{
  const createBranch = component => [
    {type: 'keyword', word: 'nil', compile: ''},
    component,
    {type: 'keyword', word: 'to', compile: ` ??= `},
    {type: 'expression'},
  ];
  statements.set('nil', [
    createBranch({type: 'unreservedName', compile: name => name}),
    createBranch({type: 'getterExpression'})
  ]);
}

// opt
statements.set('opt', [
  [
    {type: 'keyword', word: 'opt', compile: 'let {'},
    {type: 'optName'},
    {
      type: 'keyword',
      word: 'to',
      compile: ' = ',
      optional: 2,
    },
    {type: 'expression'},
    {type: 'insert', value: '} = ops'}
  ]
]);

// inc, dec
{
  const createBranch = (openingWord, component, op) => [
    {type: 'keyword', word: openingWord, compile: ''},
    component,
    {type: 'keyword', word: 'by', compile: ` ${op} `},
    {type: 'expression', optional: 1, ifOmitted: '1'}
  ];
  statements.set('inc', [
    createBranch('inc', {type: 'unreservedName', compile: name => name}, '+='),
    createBranch('inc', {type: 'getterExpression'}, '+=')
  ]);
  statements.set('dec', [
    createBranch('dec', {type: 'unreservedName', compile: name => name}, '-='),
    createBranch('dec', {type: 'getterExpression'}, '-=')
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
statements.set('export', [
  [
    {type: 'keyword', word: 'export', compile: 'export {'},
    {type: 'exportName'},
    {type: 'exportName', optional: 1, repeat: true},
    {type: 'insert', value: '}'},
    {type: 'keyword', word: 'from', compile: ' from ', optional: 2},
    {type: 'pathLit'}
  ]
]);
statements.set('export default', [
  [
    {type: 'keyword', word: 'export default', compile: 'export default '},
    {type: 'expression'}
  ]
]);

// import
statements.set('import', [
  [
    {type: 'keyword', word: 'import', compile: 'import {'},
    {type: 'importName', optional: 1, repeat: true},
    {type: 'keyword', word: 'from', compile: '} from '},
    {type: 'pathLit'}
  ]
]);
statements.set('import default', [
  [
    {type: 'keyword', word: 'import default', compile: 'import '},
    {type: 'asUnreservedName', compile: name => name},
    {type: 'keyword', word: 'from', compile: ' from '},
    {type: 'pathLit'}
  ]
]);
statements.set('import all', [
  [
    {type: 'keyword', word: 'import all', compile: 'import * as '},
    {type: 'asUnreservedName', compile: name => name},
    {type: 'keyword', word: 'from', compile: ' from '},
    {type: 'pathLit'}
  ]
]);


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

// each
{
  const words = new Set(['each', 'await each']);
  const createBranch = (...comps) => [
    {
      type: 'keyword',
      word: words,
      compile: word => word === 'each' ? 'for (let ' : 'for await (let '
    },
    ...comps,
    {type: 'keyword', word: 'of', compile: ' of '},
    {type: 'expression'},
    {type: 'insert', value: ')'},
    {type: 'block'}
  ];
  statements.set(words, [
    createBranch({type: 'unreservedName', compile: name => name}),
    createBranch(...destructureObject),
    createBranch(...destructureArray)
  ]);
}

// up, down
{
  const createBranch = word => {
    const comparisonOp = word === 'up' ? '<=' : '>=';
    return [
      {type: 'keyword', word, compile: 'for (let z_start_ = '},
      {type: 'expression'},
      {type: 'keyword', word: 'to', compile: ', z_limit_ = '},
      {type: 'expression'},
      {
        type: 'keyword',
        word: 'by',
        compile: ', z_by_ = ',
        optional: 2,
        ifOmitted: `, z_by_ = ${word === 'up' ? '1' : '-1'}` 
      },
      {type: 'expression'},
      {
        type: 'asUnreservedName',
        compile: name => `, ${name} = z_start_; ${name} ${comparisonOp} z_limit_; ${name} += z_by_)`,
        optional: 1,
        ifOmitted: `, z_loop_ = z_start_; z_loop_ ${comparisonOp} z_limit_; z_loop_ += z_by_)`
      },
      {type: 'block'}
    ];
  };
  statements.set('up', [
    createBranch('up')
  ]);
  statements.set('down', [
    createBranch('down')
  ]);
}

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

// fun, method
{
  const funWords = new Set([
    'fun',
    'export fun', 'async fun', 'gen fun',
    'export gen fun', 'async gen fun', 'export async fun',
    'export async gen fun'
  ]);
  const methodWords = new Set([
    'method',
    'static method', 'async method', 'gen method',
    'static gen method', 'async gen method', 'static async method',
    'static async gen method'
  ]);
  const createBranch = isMethod => [
    {
      type: 'keyword',
      word: isMethod ? methodWords : funWords,
      compile: word => {       
        const asyncStr = word.includes('async') ? 'async ' : '';
        const genStr   = word.includes('gen')   ? '*'      : '';
        if (isMethod) {
          const staticStr = word.includes('static') ? 'static ' : '';
          return `${staticStr}${asyncStr}${genStr}`;
        }
        else {
          const exportStr = word.includes('export') ? 'export ' : '';
          return `${exportStr}${asyncStr}function${genStr} `;
        }
      }
    },
    {
      type: 'unreservedName',
      compile: isMethod
        ? name => (name === 'new' ? 'constructor(' : `${name}(`)
        : name => `${name}(`
    },
    {type: 'parameterList', optional: 1},
    {type: 'insert', value: ')'},
    {type: 'block'}
  ];
  statements.set(funWords, [
    createBranch(false),
  ]);
  statements.set(methodWords, [
    createBranch(true),
  ]);
}

// getter
statements.set('getter', [
  [
    {type: 'keyword', word: 'getter', compile: 'get '},
    {type: 'unreservedName', compile: name => `${name}() `},
    {type: 'block'}
  ]
]);

// setter
statements.set('setter', [ 
  [
    {type: 'keyword', word: 'setter', compile: 'set '},
    {type: 'unreservedName', compile: name => `${name}(`},
    {type: 'setterParameter'},
    {type: 'insert', value: ')'},
    {type: 'block'}
  ]
]);

// field
{
  const words = new Set(['field', 'static field']);
  statements.set(words, [
    [
      {
        type: 'keyword',
        word: words,
        compile: word => word === 'field' ? '' : 'static '
      },
      {type: 'unreservedName', compile: name => name},
      {type: 'keyword', word: 'to', compile: ' = ', optional: 2},
      {type: 'expression'}
    ]
  ]);
}

// class
{
  const words = new Set(['class', 'export class']);
  statements.set(words, [
    [
      {type: 'keyword', word: words, compile: word => `${word} `},
      {type: 'unreservedName', compile: name => name},
      {type: 'keyword', word: 'extends', compile: ' extends ', optional: 2},
      {type: 'expression'},
      {type: 'block'}
    ]
  ]);
}

!!!!!HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// ========== exports ==========

// comma statements
commaFirstWords = new Set([
  'now', 'say', 'var', 'export var', 'set', 'nil', 'opt', 'inc', 'dec', 'wait',
  'export', 'import', 'import default', 'import all'
]);

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