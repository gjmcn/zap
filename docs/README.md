[The Zap website](https://gjmcn.github.io/zap).

### Notes

* There is no Zap syntax highlighting in e.g. [highlight.js](https://highlightjs.org/) yet. `src/index-highlight.js` is used in `src/build-docs.js` to highlight the contents of <code>```</code> blocks:

    * Everything in <code>\`\`\`</code> blocks is highlighted. Use explicit <code>&lt;pre&gt;&lt;code&gt;...&lt;/pre&gt;&lt;/code&gt;</code> blocks where do not want highlighting.

    * Indenting <code>\`\`\`</code> blocks (e.g. to include them in list items) has strange behavior. Instead, use no indent and open the code block with <code>\`\`\`{.indent}</code>.