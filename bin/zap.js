#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import repl from 'repl';
import yargs from 'yargs';
import zap from '../dist/zap.mjs';

const options = yargs
  .usage('Usage: zap [options] [path/to/script.za]')
  .option('a', { alias: 'all',         describe: 'Compile all .za files in directory to .js files',  type: 'boolean' })
  .option('c', { alias: 'compile',     describe: 'Compile .za file to .js file of same name',        type: 'boolean' })
  .option('e', { alias: 'eval',        describe: 'Evaluate a string from the command line',          type: 'boolean' })
  .option('h', { alias: 'help',                                                                      type: 'boolean' })
  .option('i', { alias: 'interactive', describe: 'Run an interactive Zap REPL',                      type: 'boolean' })
  .option('m', { alias: 'map',         describe: 'Generate a source map and save as a .js.map file', type: 'boolean' })
  .option('n', { alias: 'nodes',       describe: 'Print the JavaScript tree produced by the parser', type: 'boolean' }) 
  .option('p', { alias: 'print',       describe: 'Print the generated JavaScript',                   type: 'boolean' })
  .option('t', { alias: 'tokens',      describe: 'Print the tokens produced by the lexer',           type: 'boolean' })
  .option('r', { alias: 'proc',        describe: 'Print the tokens after processing blocks',         type: 'boolean' })
  .option('v', { alias: 'version',                                                                   type: 'boolean' })
  .argv;

function basicCompile(zapCode) {
  return zap(zapCode, {js: true}).js;
}

function isDir(p) {
  try {
    return fs.lstatSync(p).isDirectory();
  } catch (err) {
    return false;
  }
}

// do nothing if help or version
if (!options.h && !options.v) {

  // if no flags, --compile if an arg, otherwise --interactive
  if (!process.argv.some(a => a[0] === '-')) {
    options[options._.length ? 'c' : 'i'] = true;
  }

  // interactive
  if (options.i) {
    repl.start({
      prompt: 'zap> ',
      useGlobal: true,
      eval: (cmd, context, filename, callback) => {
        callback(null, (1, eval)(basicCompile(cmd)));
      }
    });
  }

  // eval
  else if (options.e) {
    if (options._.length === 0) {
      console.error('Error: no code to evaluate');
      process.exit(1);
    }
    try {
      console.log((1, eval)(basicCompile(options._[0])));
    }
    catch (err) {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }
  }

  // all
  else if (options.a) {
    if (options._.length === 0) {
      console.error('Error: no directory');
      process.exit(1);
    }
    const zapOptions = {js: true, sourceMap: options.m};
    const compileFiles = dirPath => {
      try {
        var contents = fs.readdirSync(dirPath);
      }
      catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
      }
      for (let item of contents) {  
        const itemPath = `${dirPath}/${item}`;
        if (isDir(itemPath)) {
          compileFiles(itemPath);
        }
        else if (path.extname(item) === '.za') {
          zapOptions.sourceFile = item;
          const jsPath = `${dirPath}/${path.basename(item, '.za')}.js`;
          const mapPath = jsPath + '.map';
          try {
            const zapCode = fs.readFileSync(itemPath, 'utf8');
            const result = zap(zapCode, zapOptions);  
            if (options.m) {
              result.js += `\n//# sourceMappingURL=${path.basename(jsPath)}.map`;
              fs.writeFileSync(mapPath, result.sourceMap.toString());
            }
            else if (fs.existsSync(mapPath)) {
              fs.unlinkSync(mapPath);
            }
            fs.writeFileSync(jsPath, result.js);
          }
          catch (err) {
            console.error(`Error: ${itemPath}, ${err.message}`);
            process.exit(1);
          }
        }
      }
    }
    compileFiles(options._[0]);
  }

  // all other options can be used together
  else {

    if (options._.length === 0) {
      console.error('Error: no source file');
      process.exit(1);
    }
    const sourceFile = '' + options._[0];
    if (path.extname(sourceFile) !== '.za') {
      console.error('Error: file extension must be ".za"');
      process.exit(1);
    }

    let result;
    try {
      result = zap(fs.readFileSync(sourceFile, 'utf8'), {
        tokens:     options.t,
        procTokens: options.r,
        sourceMap:  options.m,
        sourceFile: path.basename(sourceFile), 
        jsTree:     options.n,
        js:         (options.c || options.p),
        asyncIIFE:  false
      });
    }
    catch (err) {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }

    // tokens
    if (options.t) console.log(result.tokens);

    // process tokens
    if (['r', 'c', 'm', 'n', 'p'].some(s => options[s])) {

      if (options.r) console.log(result.procTokens);

      // parse
      if (['c', 'm', 'n', 'p'].some(s => options[s])) {

        // print JS tree
        if (options.n) console.log(result.jsTree);

        // print JS
        if (options.p) console.log(result.js);

        // write files
        if (options.c || options.m) {

          // JS file name
          const jsName = `${path.basename(sourceFile, '.za')}.js`;
          const jsPath = path.dirname(sourceFile);

          // source map
          const mapPath = `${jsPath}/${jsName}.map`;
          try {
            if (options.m) {
              result.js += `\n//# sourceMappingURL=${jsName}.map`;
              fs.writeFileSync(mapPath, result.sourceMap.toString());
            }
            else if (fs.existsSync(mapPath)) {
              fs.unlinkSync(mapPath);
            }
          }
          catch (err) {
            console.error(`Error: ${err.message}`);
            process.exit(1);
          }

          // write JS file
          if (options.c) {

            try {
              fs.writeFileSync(`${jsPath}/${jsName}`, result.js);
            }
            catch (err) {
              console.error(`Error: ${err.message}`);
              process.exit(1);
            }

          }

        }

      }
    }

  }

}