/* Pagina principală: itinerariu (preview) + hartă + filtre + carduri. */
(function () {
  var itinBox = document.getElementById("itin-preview");
  var grid = document.getElementById("grid");
  var countEl = document.getElementById("result-count");
  var emptyEl = document.getElementById("empty");
  var searchEl = document.getElementById("f-search");
  var sectionEl = document.getElementById("f-section");
  var areaEl = document.getElementById("f-area");
  var resetEl = document.getElementById("f-reset");

  var places = window.RL.places().slice();
  var map, markers = {};

  function lang() { return window.I18N.lang; }

  var SECTION_ORDER = ["vizitat", "mancare", "cazare"];
  function usedSections() {
    var s = {};
    places.forEach(function (p) { s[p.section] = true; });
    return SECTION_ORDER.filter(function (x) { return s[x]; });
  }
  function usedAreas() {
    var s = {};
    places.forEach(function (p) { if (p.area) s[p.area] = true; });
    return Object.keys(s).sort(function (a, b) { return a.localeCompare(b, "ro"); });
  }

  function fillSelect(sel, values, labelFn) {
    var current = sel.value;
    sel.innerHTML = "";
    var all = document.createElement("option");
    all.value = ""; all.textContent = window.I18N.t("filters.all");
    sel.appendChild(all);
    values.forEach(function (v) {
      var o = document.createElement("option");
      o.value = v; o.textContent = labelFn ? labelFn(v) : v;
      sel.appendChild(o);
    });
    sel.value = current;
  }

  function filters() {
    return {
      q: (searchEl.value || "").trim().toLowerCase(),
      section: sectionEl.value || "",
      area: areaEl.value || ""
    };
  }
  function match(p, f) {
    if (f.section && p.section !== f.section) return false;
    if (f.area && p.area !== f.area) return false;
    if (f.q) {
      var hay = (p.name + " " + (p.area || "")).toLowerCase();
      if (hay.indexOf(f.q) === -1) return false;
    }
    return true;
  }

  function card(p) {
    var l = window.RL.loc(p, lang());
    var a = document.createElement("a");
    a.className = "card";
    a.href = "loc.html?id=" + encodeURIComponent(p.id);

    var media = document.createElement("div");
    media.className = "card__media";
    var img = document.createElement("img");
    img.loading = "lazy"; img.alt = p.name;
    img.src = (p.images && p.images[0]) || "images/placeholder.svg";
    img.setAttribute("onerror", "RL.imgError(this)");
    media.appendChild(img);
    var tag = document.createElement("span");
    tag.className = "card__tag";
    tag.textContent = window.RL.sectionLabel(p.section, lang());
    media.appendChild(tag);
    if (p.example) {
      var ex = document.createElement("span");
      ex.className = "card__example";
      ex.textContent = window.I18N.t("badge.example");
      media.appendChild(ex);
    }

    var body = document.createElement("div");
    body.className = "card__body";
    var h = document.createElement("h3");
    h.className = "card__title"; h.textContent = p.name;
    var meta = document.createElement("p");
    meta.className = "card__meta";
    meta.textContent = [p.area, window.RL.sectionLabel(p.section, lang())].filter(Boolean).join(" · ");
    var desc = document.createElement("p");
    desc.className = "card__desc"; desc.textContent = l.tagline || "";
    var more = document.createElement("span");
    more.className = "card__more"; more.textContent = window.I18N.t("card.details") + " →";
    body.appendChild(h); body.appendChild(meta); body.appendChild(desc); body.appendChild(more);

    a.appendChild(media); a.appendChild(body);
    return a;
  }

  function render() {
    var f = filters();
    var shown = places.filter(function (p) { return match(p, f); });
    grid.innerHTML = "";
    shown.forEach(function (p) { grid.appendChild(card(p)); });
    var unit = shown.length === 1 ? window.I18N.t("filters.count.one") : window.I18N.t("filters.count.many");
    countEl.textContent = shown.length + " " + unit;
    emptyEl.hidden = shown.length !== 0;
    updateMap(shown);
  }

  /* ---------- Itinerariu (preview pe prima pagină) ---------- */
  function renderItinPreview() {
    if (!itinBox) return;
    var it = window.RL.itineraries()[0];
    if (!it) { itinBox.hidden = true; return; }
    var L = lang();
    var steps = (it.steps || []).slice(0, 4).map(function (s) {
      var p = s.placeId ? window.RL.placeById(s.placeId) : null;
      var label = p ? p.name : window.RL.loc(s.title, L);
      var href = p ? ' href="loc.html?id=' + encodeURIComponent(p.id) + '"' : "";
      var tag = href ? "a" : "span";
      return '<li class="itin-mini__step">' +
        '<span class="itin-mini__time">' + window.RL.esc(s.time || "") + "</span>" +
        "<" + tag + ' class="itin-mini__label"' + href + ">" + window.RL.esc(label || "") + "</" + tag + ">" +
      "</li>";
    }).join("");
    itinBox.innerHTML =
      '<p class="itin-mini__kicker">' + window.I18N.t("home.itinerary.kicker") + "</p>" +
      "<h2>" + window.RL.esc(window.RL.loc(it.title, L)) + "</h2>" +
      '<ol class="itin-mini__list">' + steps + "</ol>" +
      '<a class="btn btn--ghost" href="itinerariu.html?id=' + encodeURIComponent(it.id) + '">' +
        window.I18N.t("home.itinerary.cta") + " →</a>";
  }

  /* ---------- Hartă / Map ---------- */
  function initMap() {
    if (typeof L === "undefined") {
      var block = document.querySelector(".map-block");
      if (block) block.hidden = true;
      return;
    }
    map = L.map("map", { scrollWheelZoom: false }).setView([45.41, 23.37], 11);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18, attribution: "© OpenStreetMap"
    }).addTo(map);
    places.forEach(function (p) {
      if (!p.coords) return;
      var m = L.marker(p.coords).addTo(map);
      m.bindPopup('<strong>' + window.RL.esc(p.name) + '</strong><br>' +
        window.RL.esc(p.area || "") + '<br><a href="loc.html?id=' + encodeURIComponent(p.id) + '">' +
        window.I18N.t("card.details") + ' →</a>');
      markers[p.id] = m;
    });
  }
  function updateMap(shown) {
    if (!map) return;
    var ids = {}; shown.forEach(function (p) { ids[p.id] = true; });
    var group = [];
    places.forEach(function (p) {
      var m = markers[p.id]; if (!m) return;
      if (ids[p.id]) { if (!map.hasLayer(m)) m.addTo(map); if (p.coords) group.push(p.coords); }
      else if (map.hasLayer(m)) map.removeLayer(m);
    });
    if (group.length) map.fitBounds(group, { padding: [30, 30], maxZoom: 13 });
  }

  /* ---------- Events ---------- */
  [searchEl, sectionEl, areaEl].forEach(function (el) {
    el.addEventListener("input", render);
    el.addEventListener("change", render);
  });
  resetEl.addEventListener("click", function () {
    searchEl.value = ""; sectionEl.value = ""; areaEl.value = ""; render();
  });
  document.addEventListener("langchange", function () {
    fillSelect(sectionEl, usedSections(), function (s) { return window.RL.sectionLabel(s, lang()); });
    fillSelect(areaEl, usedAreas());
    renderItinPreview();
    render();
  });

  /* ---------- Init ---------- */
  fillSelect(sectionEl, usedSections(), function (s) { return window.RL.sectionLabel(s, lang()); });
  fillSelect(areaEl, usedAreas());
  renderItinPreview();
  initMap();
  render();
})();
