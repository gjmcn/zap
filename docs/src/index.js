(() => {

  'use strict';

  const indexHighlight = require('./index-highlight.js');

  const panel = document.getElementById('panel');

  //current content file and anchor
  let filename, anchor;

  //local storage for scroll position
  let saveScrollPosn, loadScrollPosn;
  {
    if (require('./storageAvailable.js')('localStorage')) {
      saveScrollPosn = () => localStorage[`page_${filename}`] = panel.scrollTop;
      loadScrollPosn = () => localStorage[`page_${filename}`];
    }
    else {
      saveScrollPosn = () => {};
      loadScrollPosn = () => {};
    }
  }

  // tweaked from: https://stackoverflow.com/questions/487073/how-to-check-if-element-is-visible-after-scrolling
  function isElementInView (el, holder) {
    const { top, bottom, height } = el.getBoundingClientRect();
    const holderRect = holder.getBoundingClientRect();
    return top <= holderRect.top
      ? holderRect.top - top <= height - 20
      : bottom - holderRect.bottom <= height - 20;
  }

  //load content into main panel
  async function loadPanel(span, returning) {

    if (filename) saveScrollPosn();

    const oldFilename = filename;
    filename = location.search.slice(1) || 'Overview';
    anchor = location.hash;
 
    if (filename !== oldFilename) {

      //clear panel and make sidebar link bold
      panel.innerHTML = '';
      for (let elm of document.querySelectorAll('#sidebar span')) {
        elm.classList.remove('selected');
      };
      const sidebarLink = span ||
        document.querySelector(`#sidebar span[data-file="${filename}"]`);
      sidebarLink.classList.add('selected');
      if (!isElementInView(sidebarLink, sidebarLink.parentNode)) {
        sidebarLink.scrollIntoView();
      }

      //load content and highlight code
      const content = await fetch(`contents-html/${filename}.html`)
        .then(response => response.text());
      panel.innerHTML = content;
      const preCodes = document.querySelectorAll('pre > code');
      for (let elm of preCodes) {
        if (!elm.classList.contains('no-highlight')) {
          elm.innerHTML = indexHighlight(elm.innerText);  // innerText so e.g. '<' not '&lt;'
        }
      }

      //internal links to different 'page'
      for (let elm of panel.querySelectorAll('a')) {
        elm.addEventListener('click', evt => {
          if (elm.getAttribute('href')[0] === '?') {
            history.pushState(null, '', evt.target.getAttribute('href'));
            loadPanel();
            evt.preventDefault();
            return false;
          }
        });
      }

    }

    //scroll
    if (returning) {  //to previous scroll posn if arrive via back/forward button
      panel.scrollTop = loadScrollPosn(); 
    }
    else if (anchor) {  //to section
      document.querySelector(anchor).scrollIntoView();
    }

  };

  //navigation
  {
    //backward and forward buttons
    window.onpopstate = () => loadPanel(null, true);

    //side bar links
    for (let elm of document.querySelectorAll('#sidebar span')) {
      elm.addEventListener('click',  evt => {
        history.pushState(null, '', `?${evt.target.getAttribute('data-file')}`);
        loadPanel(evt.target);
      });
    };

    //zap link in navbar
    document.querySelector('#zap-link').addEventListener('click', () => {
      document.querySelector('#sidebar span').click();
    });

    //pageshow
    window.addEventListener('pageshow', evt => loadPanel(null, evt.persisted));

    //pagehide
    window.addEventListener('pagehide', () => saveScrollPosn());
  }

})();