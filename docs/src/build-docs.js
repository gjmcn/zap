'use strict';

const fs = require('fs');

const hljs = require('highlight.js');
hljs.registerLanguage('zap', require('./highlightjs-zap.js'));

const md = require('markdown-it')({
  html: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }
    return ''; // use external default escaping
  }
}).use(require('markdown-it-attrs'));

const sections = [
  ['overview', 'Overview'], 
  ['use', 'Use'],
  ['basic-syntax', 'Basic Syntax'],
  ['special-syntax', 'Special Syntax'],
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
  ['is', 'Is'],
  ['elementwise', 'Elementwise'],
  ['conditional', 'Conditional'],
  ['ranges', 'Ranges'],
  ['backticks', 'Backticks'],
  ['reduce', 'Reduce'],
  ['filter', 'Filter'],
  ['group', 'Group'],
  ['order', 'Order'],
  ['bin', 'Bin'],
  ['joins', 'Joins'],
  ['random', 'Random'],
  ['interpolate', 'Interpolate'],
  ['nested-data', 'Nested Data'],
  ['set-theory', 'Set Theory'],
  ['import-and-export', 'Import and Export'],
  ['print-and-debug', 'Print and Debug'],
  ['dom', 'DOM'],
];

let sidebarHtml = '';
let panelHtml = '';

for (let [anchor, heading] of sections) {
  sidebarHtml += `<a id="side-link-${anchor}" class="side-link" href="#${
    anchor}">${heading}</a>`
  panelHtml += md.render(fs.readFileSync(`./contents-md/${anchor}.md`, 'utf8'));
}

let finalHtml = fs.readFileSync('./src/index-template.html', 'utf8')
  .replace('<!-- SIDEBAR CONTENT -->', sidebarHtml)
  .replace('<!-- PANEL CONTENT -->', panelHtml);
fs.writeFileSync('./index.html', finalHtml);