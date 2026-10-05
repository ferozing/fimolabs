// Fimo Labs site behaviour: the "year in health" grid and the engine highlight, as in the design.

// Set this when Oyesun has a public link. Until then its card is not clickable and shows no URL.
var OYESUN_URL = "";

(function () {
  document.querySelectorAll("[data-oyesun]").forEach(function (a) {
    if (OYESUN_URL) {
      a.href = OYESUN_URL;
    } else {
      a.removeAttribute("href");
      a.setAttribute("aria-disabled", "true");
      a.style.cursor = "default";
    }
  });
  document.querySelectorAll("[data-oyesun-url]").forEach(function (el) {
    if (OYESUN_URL) {
      el.textContent = OYESUN_URL.replace(/^https?:\/\//, "");
      el.hidden = false;
    }
  });

  var grid = document.getElementById("yearGrid");
  var dayEl = document.getElementById("yearDay");
  var layers = document.querySelectorAll("[data-layer]");
  if (!grid && !layers.length) return;

  var clinic = { 38: 1, 39: 1, 141: 1, 236: 1, 302: 1, 303: 1 };
  var cells = [];
  if (grid) {
    for (var i = 0; i < 365; i++) {
      var c = document.createElement("span");
      grid.appendChild(c);
      cells.push(c);
    }
  }

  function paint(t) {
    if (grid) {
      var cycle = t % 130;
      var reached = Math.round(Math.min(1, cycle / 100) * 365);
      for (var i = 0; i < 365; i++) {
        var bg = "#ECEAE3";
        if (clinic[i]) bg = i < reached ? "#FF6A3D" : "#F7D3C5";
        else if (i < reached) bg = "#2F3CFF";
        cells[i].style.background = bg;
      }
      dayEl.textContent = Math.max(1, reached);
    }
    var active = Math.floor(t / 50) % 3;
    layers.forEach(function (el, i) { el.classList.toggle("on", i === active); });
  }

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) { paint(100); return; }
  var t = 0;
  paint(t);
  setInterval(function () { t += 1; paint(t); }, 60);
})();
