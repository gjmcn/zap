(() => {

  'use strict';

  window.require = require('d3-require').require;

  const isStorage = require('./storageAvailable.js')('localStorage');
  
  // state
  let resultWidth = (isStorage && localStorage.resultWidth)
    ? +localStorage.resultWidth
    : 50; 
  const saveState = () => {
    if (isStorage) {
      localStorage.zapCode = editor.getValue();
      localStorage.resultWidth = resultWidth;
    }
  };

  // cache some elements
  const resultElm = document.getElementById('result');
  const examplesElm = document.getElementById('examples-select');
  const helpElm = document.getElementById('help-content');

  // result background
  const resultBgrd = '#2b3039';
  resultElm.style.backgroundColor = resultBgrd;

  // initialize observable inspector on result element
  resultElm.inspector =
    new (require('@observablehq/inspector').Inspector)(resultElm);

  // editor
  ace.require("ace/ext/language_tools");
  const editor = ace.edit("editor", {
    fontSize: 13.6,
    fontFamily: "'Source Code Pro', monospace",
    tabSize: 4,
    useSoftTabs: true,
    highlightActiveLine: false,
    useWorker: false,
    enableBasicAutocompletion: true,
    // enableLiveAutocompletion: true
  });
  editor.setTheme("ace/theme/tomorrow_night_bright");
  editor.session.setMode(`ace/mode/zap`);
  editor.setAutoScrollEditorIntoView(true);
  editor.commands.removeCommand(editor.commands.byName.showSettingsMenu);
  editor.setShowPrintMargin(false);
  if (isStorage && localStorage.zapCode) {
    editor.setValue(localStorage.zapCode, -1);
  }
  const setEditorWidth = () => {
    resultElm.style.width = resultWidth + '%';
    document.getElementById('editor').style.width = 100 - resultWidth + '%';
    editor.resize();
  };
  setEditorWidth();
  editor.focus();

  // print
  const print = (result, type) => {
    if (result instanceof Element || result instanceof DocumentFragment) {
      resultElm.style.backgroundColor = '#fff';
      resultElm.innerHTML = '';
      resultElm.appendChild(result);
    }
    else {
      resultElm.style.backgroundColor = resultBgrd;
      resultElm.style.borderStyle = 'solid';
      if (type === 'waiting') {
        resultElm.innerHTML = '<span class="zap-message">waiting ...</span>';
      }
      else if (type === 'throw') {
        resultElm.inspector.rejected(result);
      }
      else if (result instanceof Error) {  //error returned, not thrown
        resultElm.innerHTML = `<span class="zap-error">${'' + result}</span>`;
      }
      else {
        resultElm.inspector.fulfilled(result);
      }
    }
  };

  // run code
  let runCode;
  {
    const zap = require('../../dist/zap.cjs');
    let runId;
    runCode = isHelp => {
      const thisRunId = runId = Symbol();
      saveState();
      resultElm.classList.remove('observablehq--error');
      resultElm.innerHTML = '';
      if (isHelp) {
        print(helpElm);
        return;
      }
      let jsCode;
      try {
        jsCode = zap(editor.getValue(), {asyncIIFE: true});
      }
      catch (err) {
        print(err, 'throw');
        return;
      }
      print(null, 'waiting');
      (new Promise(resolve => {
        resolve((1, eval)(jsCode.js));
      }))
        .then(val => {
          if (thisRunId === runId) print(val);
        })
        .catch(err => {
          if (thisRunId === runId) print(err, 'throw');
        });
    };

    // run code when click Zap button
    document.getElementById('run-button')
      .addEventListener('click', () => runCode());

    //show help when click help or if editor blank when load page
    document.getElementById('help-button')
      .addEventListener('click', () => runCode(true));
    if (!editor.getValue().trim()) runCode(true);

  }

  // examples
  {
    const examples = require('./examples.js');
    for (let name of examples.keys()) {
      const elm = document.createElement("option");
      elm.innerText = name;
      examplesElm.appendChild(elm);
    }
    examplesElm.addEventListener('change', evt => {
      if (evt.target.value) {  // do nothing if select top (empty) example
        editor.setValue(examples.get(evt.target.value), -1);
        runCode();
      }
    })

  }

  // keyboard shortcuts
  {
    document.addEventListener('keydown', function(evt) {
      if ((evt.ctrlKey || evt.shiftKey) && evt.key === 'Enter') {
        runCode();
      }
      else if (evt.altKey && evt.key === 'a') {
        resultWidth = 50;
        setEditorWidth();
      }
      else if (evt.altKey && evt.key === 'w') {
        resultWidth = Math.max(resultWidth - 2, 8);
        setEditorWidth();
      }
      else if (evt.altKey && evt.key === 'q') {
        resultWidth = Math.min(resultWidth + 2, 92);
        setEditorWidth();
      }
      else {
        return;
      }
      evt.preventDefault();
      evt.stopImmediatePropagation();
    });
  }

  // store current code when leave
  window.addEventListener('beforeunload', saveState);

})();