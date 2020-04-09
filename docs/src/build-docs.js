 
const fs = require('fs');
const path = require('path');
const md = require('markdown-it')({ html: true })
  .use(require('markdown-it-attrs'));

fs.readdirSync('./contents-md').forEach(page => {
  fs.writeFileSync(
    `./contents-html/${path.basename(page, '.md')}.html`,
    md.render(fs.readFileSync(`./contents-md/${page}`, 'utf8')) +
      '\n\n<br><br><br>'
  );
});