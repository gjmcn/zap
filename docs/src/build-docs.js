 
const fs = require('fs');
const path = require('path');
const md = require('markdown-it')({ html: true })
  .use(require('markdown-it-attrs'));
const indexHighlight = require('./index-highlight.js');

fs.readdirSync('./contents-md').forEach(page => {
  const mdText = fs.readFileSync(`./contents-md/${page}`, 'utf8')
    .replace(
      /```(\{\.indent\})?[\n\r]*([\s\S]*?)```/g,
      (m, m1, m2) => {
        return `<pre${m1 ? ' class="indent"' : ''}><code>${
          indexHighlight(m2)}</code></pre>`
      }
    );
  fs.writeFileSync(
    `./contents-html/${path.basename(page, '.md')}.html`,
    md.render(mdText) + '\n<br><br><br>'
  );
});