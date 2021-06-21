////////////////////////////////////////////////////////////////////////////////
// The 'component' structure of each statement. Notes:
// 
// - The optional property indicates if a component can be omitted and if so,
//   the number of components in the group. So 'optional: 1' indicates that the
//   component itself can be omitted, whereas 'optional: 3' indicates that the
//   component and the 2 following components are included/omitted as a group.
//
// - Some statements have additional structure that are not included here. E.g.
//   an 'if' statement can have multiple 'elif's, and a 'try' statement requires
//   at least one of 'catch' and 'finally'.
// 
////////////////////////////////////////////////////////////////////////////////

import { reserved } from "./reserved";

export const statements = new Map();
  
// debugger
statements.set('debugger', null);

// break
statements.set('break', null);

// continue
statements.set('continue', null);

// do
statements.set('do', [
  [
    {type: 'expr', optional: 1}
  ]
]);

// out
statements.set('out', [
  [
    {type: 'expr', optional: 1}
  ]
]);

// throw
statements.set('throw', [
  [
    {type: 'expr'}
  ]
]);

// let
statements.set('let', [
  [
    {type: 'name'},
    {type: 'keyword', word: 'be'},
    {type: 'expr'}
  ],
  [
    {type: 'destructure'},
    {type: 'keyword', word: 'be'},
    {type: 'expr'}
  ]
]);

// set
statements.set('set', [
  [
    {type: 'name'},
    {type: 'keyword', word: 'to'},
    {type: 'expr'}
  ],
  [
    {type: 'destructure'},
    {type: 'keyword', word: 'to'},
    {type: 'expr'}
  ],
  [
    {type: 'getterExpr'},
    {type: 'keyword', word: 'to'},
    {type: 'expr'}
  ]
]);

// cet
statements.set('cet', [
  [
    {type: 'name'},
    {type: 'keyword', word: 'to'},
    {type: 'expr'}
  ],
  [
    {type: 'getterExpr'},
    {type: 'keyword', word: 'to'},
    {type: 'expr'}
  ]
]);

// incr/decr
statements.set(new Set(['incr', 'decr']), [
  [
    {type: 'name'},
    {type: 'keyword', word: 'by'},
    {type: 'expr'}
  ],
  [
    {type: 'getterExpr'},
    {type: 'keyword', word: 'by'},
    {type: 'expr'}
  ]
]);

// if
statements.set('if', [
  [
    {type: 'expr'},
    {type: 'block'},
    {type: 'keyword', word: 'elif', optional: 3},
    {type: 'expr'},
    {type: 'block'},
    {type: 'keyword', word: 'else', optional: 3},
    {type: 'expr'},
    {type: 'block'},
  ]
]);

// while
statements.set('while', [
  [
    {type: 'expr'},
    {type: 'block'}
  ]
]);

// each
statements.set(new Set (['each', 'awaitEach']), [
  [
    {type: 'name'},
    {type: 'keyword', word: 'of'},
    {type: 'block'}
  ],
  [
    {type: 'destructure'},
    {type: 'keyword', word: 'of'},
    {type: 'block'}
  ]
]);

// try
statements.set('try', [
  [
    {type: 'block'},
    {type: 'keyword', word: 'catch', optional: 2},
    {type: 'block'},
    {type: 'keyword', word: 'finally', optional: 2},
    {type: 'block'}
  ],

]);

// functions
statements.set(
  new Set(['fun', 'proc', 'gen', 'asyncFun', 'asyncProc', 'asyncGen']), [
  [
    {type: 'name'},
    {type: 'keyword', word: 'par', optional: 2},
    {type: 'params',},
    {type: 'block'},
  ],
  [
    {type: 'getterExpr'},
    {type: 'keyword', word: 'par', optional: 2},
    {type: 'params',},
    {type: 'block'},
  ]
]);

// class
statements.set('class', [
  [
    {type: 'name'},
    {type: 'keyword', word: 'extends', optional: 2},
    {type: 'name'},
    {type: 'keyword', word: 'par', optional: 2},
    {type: 'params',},
    {type: 'block'},
  ]
]);

// export
statements.set('export', [
  [
    {type: 'name'},
    {type: 'keyword', word: 'as'},
    {type: 'keyword', word: 'default'}
  ],
  [
    {type: 'namesAs'}
  ]
]);

// import
statements.set('import', [
  [
    {type: 'keyword', word: 'default'},
    {type: 'keyword', word: 'as'},
    {type: 'name'},
    {type: 'keyword', word: 'from'},
    {type: 'string'}
  ],
  [
    {type: 'keyword', word: 'all'},
    {type: 'keyword', word: 'as'},
    {type: 'name'},
    {type: 'keyword', word: 'from'},
    {type: 'string'}
  ],
  [
    {type: 'namesAs', optional: 2},
    {type: 'keyword', word: 'from'},
    {type: 'string'}
  ],
]);