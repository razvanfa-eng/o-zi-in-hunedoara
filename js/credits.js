/* Listează sloturile de imagini pentru fiecare loc. */
(function () {
  var root = document.getElementById("credits-list");
  function render() {
    var lang = window.I18N.lang;
    root.innerHTML = window.RL.places().map(function (p) {
      var rows = (p.images || []).map(function (src) {
        return "<li><code>" + window.RL.esc(src.split("/").pop()) + "</code></li>";
      }).join("");
      return '<div class="credit-card"><h3>' + window.RL.esc(p.name) +
        ' <span class="muted">· ' + window.RL.esc(p.area || "") + "</span></h3>" +
        '<p class="muted">' + window.RL.sectionLabel(p.section, lang) + "</p>" +
        '<ul class="credit-files">' + rows + "</ul></div>";
    }).join("");
  }
  document.addEventListener("langchange", render);
  render();
})();
