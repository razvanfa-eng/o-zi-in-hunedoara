/* Funcții comune / Shared helpers. */
(function () {
  function wazeUrl(c) { return "https://www.waze.com/ul?ll=" + c[0] + "%2C" + c[1] + "&navigate=yes"; }
  function gmapsDirUrl(c) { return "https://www.google.com/maps/dir/?api=1&destination=" + c[0] + "%2C" + c[1]; }
  function gmapsViewUrl(c) { return "https://www.google.com/maps/search/?api=1&query=" + c[0] + "%2C" + c[1]; }

  function places() { return window.SITE_PLACES || []; }
  function placeById(id) {
    var l = places();
    for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i];
    return null;
  }
  function itineraries() { return window.SITE_ITINERARIES || []; }
  function itineraryById(id) {
    var l = itineraries();
    for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i];
    return l[0] || null;
  }

  function loc(obj, lang) { return (obj && (obj[lang] || obj.ro)) || {}; }
  function sectionLabel(sec, lang) { return window.I18N ? window.I18N.t("sec." + sec, lang) : sec; }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  // stele: rating 0..5 (poate fi zecimal pentru medie)
  function starsHtml(rating) {
    var full = Math.round(rating * 2) / 2;
    var out = "";
    for (var i = 1; i <= 5; i++) {
      if (full >= i) out += '<span class="star star--full">★</span>';
      else if (full >= i - 0.5) out += '<span class="star star--half">★</span>';
      else out += '<span class="star">★</span>';
    }
    return '<span class="stars" aria-hidden="true">' + out + '</span>';
  }

  function imgError(img) {
    if (img.dataset.fallback === "1") return;
    img.dataset.fallback = "1";
    img.src = "images/placeholder.svg";
    img.classList.add("is-placeholder");
  }

  window.RL = {
    wazeUrl: wazeUrl, gmapsDirUrl: gmapsDirUrl, gmapsViewUrl: gmapsViewUrl,
    places: places, placeById: placeById,
    itineraries: itineraries, itineraryById: itineraryById,
    loc: loc, sectionLabel: sectionLabel, esc: esc, starsHtml: starsHtml, imgError: imgError
  };

  // Linkuri de donații din config
  document.addEventListener("DOMContentLoaded", function () {
    var url = (window.SITE_CONFIG && window.SITE_CONFIG.donateUrl) || "";
    document.querySelectorAll("[data-donate]").forEach(function (el) {
      if (url) { el.href = url; el.target = "_blank"; el.rel = "noopener"; }
      else { (el.closest("[data-donate-wrap]") || el).hidden = true; }
    });
  });
})();
