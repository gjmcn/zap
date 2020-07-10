'use strict';

const scrollama = require("scrollama");

const scroller = scrollama();

const sideLinks = [...document.querySelectorAll('.side-link')];

function highlightLink(index) {
  for (let s of sideLinks) s.classList.remove('selected');
  sideLinks[index].classList.add('selected');
  sideLinks[index].scrollIntoView({block: 'nearest'});
}

scroller
  .setup({
    step: "h2"
  })
  .onStepEnter(({element, index, direction}) => {
    if (direction === 'down') highlightLink(index);
  })
  .onStepExit(({element, index, direction}) => {
    if (direction === 'up') highlightLink(index - 1);
  });

window.addEventListener('resize', scroller.resize);