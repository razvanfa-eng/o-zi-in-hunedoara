/* Pagina de itinerariu: ?id=<slug> (sau primul din listă). */
(function () {
  var root = document.getElementById("itinerary");
  var id = new URLSearchParams(location.search).get("id");
  var esc = window.RL.esc;
  function lang() { return window.I18N.lang; }

  function render() {
    var it = id ? window.RL.itineraryById(id) : window.RL.itineraries()[0];
    if (!it) {
      root.innerHTML = '<p class="notice">' + window.I18N.t("detail.notFound") + "</p>";
      return;
    }
    var L = lang();
    document.title = window.RL.loc(it.title, L) + " — " + window.I18N.t("site.name");

    var steps = (it.steps || []).map(function (s) {
      var p = s.placeId ? window.RL.placeById(s.placeId) : null;
      var name = p ? p.name : window.RL.loc(s.title, L);
      var sub = p ? window.RL.sectionLabel(p.section, L) + (p.area ? " · " + p.area : "") : window.I18N.t("itin.step.free");
      var note = s.note ? window.RL.loc(s.note, L) : "";
      var link = p
        ? '<a class="itin-step__go" href="loc.html?id=' + encodeURIComponent(p.id) + '">' + window.I18N.t("card.details") + " →</a>"
        : "";
      var nav = (p && p.coords)
        ? '<div class="itin-step__nav">' +
            '<a href="' + window.RL.wazeUrl(p.coords) + '" target="_blank" rel="noopener">Waze</a>' +
            '<a href="' + window.RL.gmapsDirUrl(p.coords) + '" target="_blank" rel="noopener">Google Maps</a>' +
          "</div>"
        : "";
      return '<li class="itin-step">' +
        '<div class="itin-step__time">' + esc(s.time || "") + "</div>" +
        '<div class="itin-step__card">' +
          '<h3>' + esc(name || "") + "</h3>" +
          '<p class="itin-step__sub">' + esc(sub) + "</p>" +
          (note ? '<p class="itin-step__note">' + esc(note) + "</p>" : "") +
          nav + link +
        "</div>" +
      "</li>";
    }).join("");

    root.innerHTML =
      '<p class="detail__back"><a href="index.html">' + window.I18N.t("detail.back") + "</a></p>" +
      '<header class="detail__head">' +
        '<span class="detail__tag" data-i18n="itin.title">' + window.I18N.t("itin.title") + "</span>" +
        (it.example ? '<span class="detail__example">' + window.I18N.t("badge.example") + "</span>" : "") +
        "<h1>" + esc(window.RL.loc(it.title, L)) + "</h1>" +
        (it.intro ? '<p class="detail__lead">' + esc(window.RL.loc(it.intro, L)) + "</p>" : "") +
      "</header>" +
      '<ol class="itin-list">' + steps + "</ol>";
  }

  document.addEventListener("langchange", render);
  render();
})();
