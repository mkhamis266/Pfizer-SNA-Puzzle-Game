// disable double click (zoom) and context Menu
$(function () {
  document.addEventListener("dblclick", function (e) {
    e.preventDefault();
  });
  document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });
});

import { Game } from "./game.js";
let game = new Game();
