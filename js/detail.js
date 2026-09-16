/* Pagina de detaliu: ?id=<slug> + secțiunea de recenzii. */
(function () {
  var root = document.getElementById("place");
  var reviewsRoot = document.getElementById("reviews");
  var id = new URLSearchParams(location.search).get("id");
  var place = window.RL.placeById(id);
  var esc = window.RL.esc;
  function lang() { return window.I18N.lang; }

  if (!place) {
    function miss() {
      document.title = window.I18N.t("detail.notFound");
      root.innerHTML = '<p class="notice">' + window.I18N.t("detail.notFound") + "</p>" +
        '<p><a class="btn" href="index.html">' + window.I18N.t("detail.notFound.link") + "</a></p>";
      if (reviewsRoot) reviewsRoot.hidden = true;
    }
    document.addEventListener("langchange", miss);
    miss();
    return;
  }

  function factRow(labelKey, value) {
    if (!value) return "";
    return "<dt>" + window.I18N.t(labelKey) + "</dt><dd>" + value + "</dd>";
  }

  function render() {
    var l = window.RL.loc(place, lang());
    document.title = place.name + " — " + window.I18N.t("site.name");

    var paras = (l.description || []).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
    var waze = window.RL.wazeUrl(place.coords);
    var gdir = window.RL.gmapsDirUrl(place.coords);
    var gview = window.RL.gmapsViewUrl(place.coords);

    var website = l.website
      ? '<a href="' + esc(l.website) + '" target="_blank" rel="noopener">' + esc(l.website.replace(/^https?:\/\//, "")) + "</a>"
      : "";
    var phone = l.phone ? '<a href="tel:' + esc(l.phone.replace(/\s+/g, "")) + '">' + esc(l.phone) + "</a>" : "";

    var gallery = (place.images || []).map(function (src, i) {
      return '<figure class="gallery__item"><img loading="lazy" src="' + esc(src) +
        '" alt="' + esc(place.name) + " " + (i + 1) + '" onerror="RL.imgError(this)"></figure>';
    }).join("");

    root.innerHTML =
      '<p class="detail__back"><a href="index.html">' + window.I18N.t("detail.back") + "</a></p>" +
      '<header class="detail__head">' +
        '<span class="detail__tag">' + window.RL.sectionLabel(place.section, lang()) + "</span>" +
        (place.example ? '<span class="detail__example" data-i18n="badge.example">' + window.I18N.t("badge.example") + "</span>" : "") +
        "<h1>" + esc(place.name) + "</h1>" +
        '<p class="detail__lead">' + esc(l.tagline || "") + "</p>" +
      "</header>" +
      '<div class="detail__hero"><img src="' + esc((place.images || [])[0] || "images/placeholder.svg") +
        '" alt="' + esc(place.name) + '" onerror="RL.imgError(this)"></div>' +
      '<div class="detail__cols">' +
        '<div class="detail__main">' +
          '<section class="detail__section"><h2>' + window.I18N.t("detail.about") + "</h2>" + paras + "</section>" +
          (gallery ? '<section class="detail__section"><h2>' + window.I18N.t("detail.gallery") + '</h2><div class="gallery">' + gallery + "</div></section>" : "") +
        "</div>" +
        '<aside class="detail__aside">' +
          '<div class="panel"><h2>' + window.I18N.t("detail.practical") + "</h2><dl class=\"facts\">" +
            factRow("detail.address", esc(l.address)) +
            factRow("detail.area", esc(place.area)) +
            factRow("detail.hours", esc(l.hours)) +
            factRow("detail.phone", phone) +
            factRow("detail.website", website) +
            factRow("detail.bestTime", esc(l.bestTime)) +
            factRow("detail.transport", esc(l.transport)) +
            factRow("detail.coords", place.coords[0].toFixed(5) + ", " + place.coords[1].toFixed(5)) +
          "</dl></div>" +
          '<div class="panel"><h2>' + window.I18N.t("detail.getThere") + "</h2>" +
            '<a class="btn btn--waze" href="' + waze + '" target="_blank" rel="noopener">' + window.I18N.t("detail.waze") + "</a>" +
            '<a class="btn btn--gmaps" href="' + gdir + '" target="_blank" rel="noopener">' + window.I18N.t("detail.gmaps") + "</a>" +
            '<a class="btn btn--ghost" href="' + gview + '" target="_blank" rel="noopener">' + window.I18N.t("detail.gmapsView") + "</a>" +
          "</div>" +
        "</aside>" +
      "</div>";
  }

  document.addEventListener("langchange", render);
  render();

  if (reviewsRoot && window.Reviews) window.Reviews.mount(reviewsRoot, place.id);
})();
