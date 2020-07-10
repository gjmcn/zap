'use strict';

const fs = require('fs');
const md = require('markdown-it')({ html: true })
  .use(require('markdown-it-attrs'));
const indexHighlight = require('./index-highlight.js');

const sections = [
  ['overview', 'Overview'], 
  ['use', 'Use'],
  ['syntax', 'Syntax'],
  ['operators', 'Operators'],
  ['literals', 'Literals'],
  ['calling-functions', 'Calling Functions'],
  ['assignment', 'Assignment'],
  ['get-property', 'Get Property'],
  ['set-property', 'Set Property'],
  ['writing-functions', 'Writing Functions'],
  ['classes', 'Classes'],
  ['loops', 'Loops'],
  ['exceptions', 'Exceptions'],
  ['elementwise', 'Elementwise'],
  ['conditional', 'Conditional'],
  ['ranges', 'Ranges'],
  ['backticks', 'Backticks'],
  ['reduce', 'Reduce'],
  ['filter', 'Filter'],
  ['group', 'Group'],
  ['order', 'Order'],
  ['bin', 'Bin'],
  ['random', 'Random'],
  ['tabular-data', 'Tabular Data'],
  ['import-and-export', 'Import and Export'],
  ['print-and-debug', 'Print and Debug'],
  ['dom', 'DOM'],
];

let sidebarHtml = '';
let panelHtml = '';

for (let [anchor, heading] of sections) {
  sidebarHtml += `<a id="side-link-${anchor}" class="side-link" href="#${
    anchor}">${heading}</a>`
  const mdText = fs.readFileSync(`./contents-md/${anchor}.md`, 'utf8')
    .replace(
      /```(\{\.indent\})?[\n\r]*([\s\S]*?)```/g,
      (m, m1, m2) => {
        return `<pre${m1 ? ' class="indent"' : ''}><code>${
          indexHighlight(m2)}</code></pre>`;
      }
    );
  panelHtml += md.render(mdText);
}

let finalHtml = fs.readFileSync('./src/index-template.html', 'utf8')
  .replace('<!-- SIDEBAR CONTENT -->', sidebarHtml)
  .replace('<!-- PANEL CONTENT -->', panelHtml);
fs.writeFileSync('./index.html', finalHtml);