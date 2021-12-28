////////////////////////////////////////////////////////////////////////////////
// The 'component' structure of each statement. Notes:
// 
// - Can only get contiguous non-"end" keywords at the start of a statement. 
// - The 'optional' property indicates if a component can be omitted and if so,
//   the number of components in the group. So 'optional: 1' indicates that the
//   component itself can be omitted, whereas 'optional: 3' indicates that the
//   component and the 2 following components are included/omitted as a group.
//
// - An optional group is 'commited to' based on its first component, so this
//   cannot be the same as the component that follows the optional group.
//
// - Components with an 'optional' property can have one (or none) of:
//     - 'ifOmitted': string, code to add if optional group omitted 
//     - 'repeat': whether the optional group can be repeated
//
// - Some components types have a compile property: a string, or a function that
//   is passed the relevant value and generates the JS. The JS for other
//   component types is handled in components.js.
// 
// - When a statement has multiple branches (i.e. versions), all branches have
//   the same first component (i.e. start). The second component of each branch
//   uniquely identifies the branch (and unless on the last branch, should not
//   be optional).
////////////////////////////////////////////////////////////////////////////////

export const statements = {};
export const simpleStarts = new Set();
export const blockStarts = new Set();
export let allStarts;
export const commaStarts = new Set([
  'cmd', 'say', 'let', 'export let', 'set', 'nil', 'opt', 'inc', 'dec', 'wait',
  'field', 'static field'
]);


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
  {type: 'unreservedOrRename', optional: 1, repeat: true},
  {type: 'closeCurly', compile: '}'}
];


// ========= simple statements (i.e. do not contain a block component) =========

// break, continue, debugger
{
  const branches = start => [
    [
      {type: 'keyword', word: start, compile: start}
    ]
  ];
  for (let start of ['break', 'continue', 'debugger']) {
    statements[start] = branches(start);
    simpleStarts.add(start);
  }
}

// cmd
statements.cmd = [
  [
    {type: 'keyword', word: 'cmd', compile: ''},
    {type: 'expression'}
  ]
];
simpleStarts.add('cmd');

// out
statements.out = [
  [
    {type: 'keyword',  word: 'out', compile: 'return '},
    {type: 'expression', optional: 1}
  ]
];
simpleStarts.add('out');

// throw
statements.throw = [
  [
    {type: 'keyword',  word: 'throw', compile: 'throw '},
    {type: 'expression'}
  ]
];
simpleStarts.add('throw');

// say
statements.say = [
  [
    {type: 'keyword', word: 'say', compile: 'console.log('},
    {type: 'expression'},
    {type: 'insert', value: ')'}
  ]
];
simpleStarts.add('say');

// let
{
  const branches = start => {
    const firstComponent = {
      type: 'keyword',
      word: start,
      compile: `${start} `
    };
    return [
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
    ];
  };
  for (let start of ['let', 'export let']) {
    statements[start] = branches(start);
    simpleStarts.add(start);
  }
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
  statements.set = [
    createBranch({type: 'unreservedName', compile: name => name}),
    createBranch(...destructureObject),
    createBranch(...destructureArray),
    createBranch({type: 'getterExpression'})
  ];
  simpleStarts.add('set');
}

// nil
{
  const createBranch = component => [
    {type: 'keyword', word: 'nil', compile: ''},
    component,
    {type: 'keyword', word: 'to', compile: ` ??= `},
    {type: 'expression'},
  ];
  statements.nil = [
    createBranch({type: 'unreservedName', compile: name => name}),
    createBranch({type: 'getterExpression'})
  ];
  simpleStarts.add('nil');
}

// opt
statements.opt = [
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
];
simpleStarts.add('opt');

// inc, dec
{
  const createBranch = (start, component, op) => [
    {type: 'keyword', word: start, compile: ''},
    component,
    {type: 'keyword', word: 'by', compile: ` ${op} `},
    {type: 'expression', optional: 1, ifOmitted: '1'}
  ];
  statements.inc = [
    createBranch('inc', {type: 'unreservedName', compile: name => name}, '+='),
    createBranch('inc', {type: 'getterExpression'}, '+=')
  ];
  statements.dec = [
    createBranch('dec', {type: 'unreservedName', compile: name => name}, '-='),
    createBranch('dec', {type: 'getterExpression'}, '-=')
  ];
  simpleStarts.add('inc');
  simpleStarts.add('dec');
}

// wait
statements.wait = [
  [
    {
      type: 'keyword',
      word: 'wait',
      compile: 'await new Promise(r => setTimeout(r, ('
    },
    {type: 'expression'},
    {type: 'insert', value: ')))'}
  ]
];
simpleStarts.add('wait');

// export
statements.export = [
  [
    {type: 'keyword', word: 'export', compile: 'export {'},
    {type: 'exportName'},
    {type: 'exportName', optional: 1, repeat: true},
    {type: 'insert', value: '}'},
    {type: 'keyword', word: 'from', compile: ' from ', optional: 2},
    {type: 'pathLit'}
  ]
];
statements['export default'] = [
  [
    {type: 'keyword', word: 'export default', compile: 'export default '},
    {type: 'expression'}
  ]
];
simpleStarts.add('export');
simpleStarts.add('export default');

// import
statements.import = [
  [
    {type: 'keyword', word: 'import', compile: 'import {'},
    {type: 'importName', optional: 1, repeat: true},
    {type: 'keyword', word: 'from', compile: '} from '},
    {type: 'pathLit'}
  ]
];
statements['import default'] = [
  [
    {type: 'keyword', word: 'import default', compile: 'import '},
    {type: 'asUnreservedName', compile: name => name},
    {type: 'keyword', word: 'from', compile: ' from '},
    {type: 'pathLit'}
  ]
];
statements['import all'] = [
  [
    {type: 'keyword', word: 'import all', compile: 'import * as '},
    {type: 'asUnreservedName', compile: name => name},
    {type: 'keyword', word: 'from', compile: ' from '},
    {type: 'pathLit'}
  ]
];
simpleStarts.add('import');
simpleStarts.add('import default');
simpleStarts.add('import all');

// field
{
  const branches = start => [
    [
      {
        type: 'keyword',
        word: start,
        compile: start === 'field' ? '' : 'static '
      },
      {type: 'unreservedName', compile: name => name},
      {type: 'keyword', word: 'to', compile: ' = ', optional: 2},
      {type: 'expression'}
    ]
  ];
  for (let start of ['field', 'static field']) {
    statements[start] = branches(start);
    simpleStarts.add(start);
  }
}


// ========== block statements (i.e. contain a 'block' component) ==========

// block
statements.block = [
  [
    {type: 'keyword', word: 'block', compile: ''},
    {type: 'block'}
  ]
];
blockStarts.add('block');

// if
statements.if = [
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
];
blockStarts.add('if');

// while
statements.while = [
  [
    {type: 'keyword', word: 'while', compile: 'while ('},
    {type: 'expression'},
    {type: 'insert', value: ')'},
    {type: 'block'}
  ]
];
blockStarts.add('while');

// for
{
  const createBranch = (start, ...comps) => [
    {
      type: 'keyword',
      word: start,
      compile: start === 'for' ? 'for (let ' : 'for await (let '
    },
    ...comps,
    {type: 'keyword', word: 'of', compile: ' of '},
    {type: 'expression'},
    {type: 'insert', value: ')'},
    {type: 'block'}
  ];
  for (let start of ['for', 'wait for']) {
    statements[start] = [
      createBranch(start, {type: 'unreservedName', compile: name => name}),
      createBranch(start, ...destructureObject),
      createBranch(start, ...destructureArray)
    ]
    blockStarts.add(start);
  }
}

// loop
statements.loop = [
  [
    {
      type: 'keyword',
      word: 'loop',
      compile: 'for (let z_limit_ = '
    },
    {type: 'expression'},
    {
      type: 'asUnreservedName',
      compile: name => `, ${name} = 0; ${name} < z_limit_; ${name}++)`,
      optional: 1,
      ifOmitted: ', z_loop_ = 0; z_loop_ < z_limit_; z_loop_++)'
    },
    {type: 'block'}
  ]
];
blockStarts.add('loop');

// up, down
{
  const branches = start => {
    const comparisonOp = start === 'up' ? '<=' : '>=';
    const incrementOp  = start === 'up' ? '+=' : '-=';
    return [
      [
        {type: 'keyword', word: start, compile: 'for (let z_start_ = '},
        {type: 'expression'},
        {type: 'keyword', word: 'to', compile: ', z_limit_ = '},
        {type: 'expression'},
        {
          type: 'keyword',
          word: 'by',
          compile: ', z_by_ = ',
          optional: 2,
          ifOmitted: ', z_by_ = 1'
        },
        {type: 'expression'},
        {
          type: 'asUnreservedName',
          compile: name => `, ${name} = z_start_; ${name} ${comparisonOp
              } z_limit_; ${name} ${incrementOp} z_by_)`,
          optional: 1,
          ifOmitted: `, z_loop_ = z_start_; z_loop_ ${comparisonOp
            } z_limit_; z_loop_ ${incrementOp} z_by_)`
        },
        {type: 'block'}
      ]
    ];
  };
  for (let start of ['up', 'down']) {
    statements[start] = branches(start);
    blockStarts.add(start);
  }
}

// try
statements.try = [
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
];
blockStarts.add('try');

// fun, method
{
  const branches = (start, isMethod) => {
    const asyncStr = start.includes('async') ? 'async ' : '';
    const genStr   = start.includes('gen')   ? '*'      : '';
    let staticStr, exportStr;
    isMethod
      ? (staticStr = start.includes('static') ? 'static ' : '')
      : (exportStr = start.includes('export') ? 'export ' : '');
    return [
      [
        {
          type: 'keyword',
          word: start,
          compile: isMethod
            ? `${staticStr}${asyncStr}${genStr}`      
            : `${exportStr}${asyncStr}function${genStr} `
        },
        {type: 'unreservedName', compile: name => `${name}(`},
        {type: 'parameterList', optional: 1},
        {type: 'insert', value: ')'},
        {type: 'block'}
      ]
    ];
  }
  for (let start of [
        'fun',
        'export fun', 'async fun', 'gen fun',
        'export gen fun', 'async gen fun', 'export async fun',
        'export async gen fun'
      ]) {
    statements[start] = branches(start, false);
    blockStarts.add(start);
  }
  for (let start of [
        'method',
        'static method', 'async method', 'gen method',
        'static gen method', 'async gen method', 'static async method',
        'static async gen method'
      ]) {
    statements[start] = branches(start, true);
    blockStarts.add(start);
  }
}

// getter
statements.getter = [
  [
    {type: 'keyword', word: 'getter', compile: 'get '},
    {type: 'unreservedName', compile: name => `${name}()`},
    {type: 'block'}
  ]
];
blockStarts.add('getter');

// setter
statements.setter = [
  [
    {type: 'keyword', word: 'setter', compile: 'set '},
    {type: 'unreservedName', compile: name => `${name}(`},
    {type: 'setterParameter'},
    {type: 'insert', value: ')'},
    {type: 'block'}
  ]
];
blockStarts.add('setter');

// class
{
  const branches = start => [
    [
      {type: 'keyword', word: start, compile: `${start} `},
      {type: 'unreservedName', compile: name => name},
      {type: 'keyword', word: 'extends', compile: ' extends ', optional: 2},
      {type: 'expression'},
      {type: 'block'}
    ]
  ];
  for (let start of ['class', 'export class']) {
    statements[start] = branches(start);
    blockStarts.add(start);
  }
}

// all starts
allStarts = new Set([...simpleStarts, ...blockStarts]);