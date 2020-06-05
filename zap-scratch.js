import zap from './src/index.js';

const zapCode = `
Lion = extends
    x = 5
    Cat
| name
    y = 10
    this :name = name
`
console.log(zap(zapCode, {
  js: true,
  // tokens: true,
  procTokens: true
}));


// Lion = extends (animals :Cat)

// x map xi i fruit
//     z = 30
//     xi + z

// x :5 as fifth
//     fifth :length print

