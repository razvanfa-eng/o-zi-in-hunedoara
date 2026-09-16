/* Interfață bilingvă RO / EN. Limba se ține în localStorage. */
(function () {
  var STRINGS = {
    ro: {
      "nav.home": "Acasă",
      "nav.itinerary": "Itinerariu 24h",
      "nav.visit": "De vizitat",
      "nav.eat": "Unde mănânci",
      "nav.stay": "Unde te cazezi",
      "nav.credits": "Imagini & credite",
      "nav.donate": "Donează",
      "donate.aria": "Donează prin PayPal (se deschide într-o filă nouă)",
      "donate.heading": "Îți e util site-ul?",
      "donate.text": "Proiectul e gratuit și fără reclame. Dacă vrei, poți susține benevol munca printr-o donație pe PayPal.",
      "donate.cta": "Donează pe PayPal",
      "lang.switch": "EN",
      "lang.switch.aria": "Switch to English",

      "home.itinerary.kicker": "Programul zilei",
      "home.itinerary.cta": "Vezi tot itinerariul",
      "home.map.heading": "Harta locurilor",
      "home.map.hint": "Apasă pe un punct pentru detalii.",

      "filters.heading": "Caută și filtrează",
      "filters.search": "Caută după nume",
      "filters.search.placeholder": "ex. Petroșani, Straja, Parâng…",
      "filters.section": "Secțiune",
      "filters.area": "Zonă / localitate",
      "filters.all": "Toate",
      "filters.reset": "Resetează",
      "filters.count.one": "loc",
      "filters.count.many": "locuri",
      "filters.none": "Niciun loc nu se potrivește cu filtrele alese.",

      "sec.vizitat": "De vizitat",
      "sec.mancare": "Unde mănânci",
      "sec.cazare": "Unde te cazezi",

      "card.details": "Vezi detalii",
      "badge.example": "exemplu",

      "detail.back": "← Toate locurile",
      "detail.about": "Despre",
      "detail.practical": "Informații practice",
      "detail.address": "Adresă",
      "detail.area": "Zonă",
      "detail.hours": "Program",
      "detail.phone": "Telefon",
      "detail.website": "Site web",
      "detail.bestTime": "Când să mergi",
      "detail.transport": "Cum ajungi",
      "detail.coords": "Coordonate",
      "detail.getThere": "Navighează până acolo",
      "detail.waze": "Deschide în Waze",
      "detail.gmaps": "Direcții Google Maps",
      "detail.gmapsView": "Vezi pe Google Maps",
      "detail.gallery": "Galerie",
      "detail.notFound": "Locul căutat nu există.",
      "detail.notFound.link": "Înapoi la toate locurile",

      "itin.title": "Itinerariu — 24 de ore",
      "itin.step.free": "Pas liber",

      "reviews.heading": "Recenzii",
      "reviews.none": "Nicio recenzie încă. Fii primul!",
      "reviews.average": "Media notelor",
      "reviews.count.one": "recenzie",
      "reviews.count.many": "recenzii",
      "reviews.add": "Lasă o recenzie",
      "reviews.form.name": "Numele tău",
      "reviews.form.rating": "Nota ta",
      "reviews.form.title": "Titlu (opțional)",
      "reviews.form.body": "Recenzia ta",
      "reviews.form.photo": "Poză (opțional)",
      "reviews.form.submit": "Trimite recenzia",
      "reviews.form.sending": "Se trimite…",
      "reviews.form.required": "Completează numele, nota și textul.",
      "reviews.form.captcha": "Confirmă că nu ești robot.",
      "reviews.form.ok.moderated": "Mulțumim! Recenzia va apărea după ce este verificată.",
      "reviews.form.ok.live": "Mulțumim! Recenzia ta a fost publicată.",
      "reviews.form.error": "Nu s-a putut trimite recenzia. Încearcă din nou.",
      "reviews.local.note": "Modul de probă: recenziile se salvează doar în acest browser.",
      "reviews.report": "Raportează",

      "footer.note": "Proiect personal, necomercial. Textele sunt originale; imaginile sunt încărcate de proprietarul site-ului.",
      "img.missing": "Imagine în curând"
    },
    en: {
      "nav.home": "Home",
      "nav.itinerary": "24h itinerary",
      "nav.visit": "To see",
      "nav.eat": "Where to eat",
      "nav.stay": "Where to stay",
      "nav.credits": "Images & credits",
      "nav.donate": "Donate",
      "donate.aria": "Donate via PayPal (opens in a new tab)",
      "donate.heading": "Finding the site useful?",
      "donate.text": "This project is free and ad-free. If you'd like, you can support the work with a voluntary PayPal donation.",
      "donate.cta": "Donate with PayPal",
      "lang.switch": "RO",
      "lang.switch.aria": "Comută pe română",

      "home.itinerary.kicker": "The day plan",
      "home.itinerary.cta": "See the full itinerary",
      "home.map.heading": "Map of the places",
      "home.map.hint": "Tap a marker for details.",

      "filters.heading": "Search and filter",
      "filters.search": "Search by name",
      "filters.search.placeholder": "e.g. Petroșani, Straja, Parâng…",
      "filters.section": "Section",
      "filters.area": "Area / town",
      "filters.all": "All",
      "filters.reset": "Reset",
      "filters.count.one": "place",
      "filters.count.many": "places",
      "filters.none": "No place matches the chosen filters.",

      "sec.vizitat": "To see",
      "sec.mancare": "Where to eat",
      "sec.cazare": "Where to stay",

      "card.details": "See details",
      "badge.example": "example",

      "detail.back": "← All places",
      "detail.about": "About",
      "detail.practical": "Practical information",
      "detail.address": "Address",
      "detail.area": "Area",
      "detail.hours": "Opening hours",
      "detail.phone": "Phone",
      "detail.website": "Website",
      "detail.bestTime": "When to go",
      "detail.transport": "Getting there",
      "detail.coords": "Coordinates",
      "detail.getThere": "Navigate there",
      "detail.waze": "Open in Waze",
      "detail.gmaps": "Google Maps directions",
      "detail.gmapsView": "View on Google Maps",
      "detail.gallery": "Gallery",
      "detail.notFound": "That place does not exist.",
      "detail.notFound.link": "Back to all places",

      "itin.title": "Itinerary — 24 hours",
      "itin.step.free": "Free step",

      "reviews.heading": "Reviews",
      "reviews.none": "No reviews yet. Be the first!",
      "reviews.average": "Average rating",
      "reviews.count.one": "review",
      "reviews.count.many": "reviews",
      "reviews.add": "Leave a review",
      "reviews.form.name": "Your name",
      "reviews.form.rating": "Your rating",
      "reviews.form.title": "Title (optional)",
      "reviews.form.body": "Your review",
      "reviews.form.photo": "Photo (optional)",
      "reviews.form.submit": "Submit review",
      "reviews.form.sending": "Sending…",
      "reviews.form.required": "Please fill in name, rating and text.",
      "reviews.form.captcha": "Please confirm you are not a robot.",
      "reviews.form.ok.moderated": "Thank you! Your review will appear once it is checked.",
      "reviews.form.ok.live": "Thank you! Your review is published.",
      "reviews.form.error": "Could not submit the review. Please try again.",
      "reviews.local.note": "Demo mode: reviews are stored only in this browser.",
      "reviews.report": "Report",

      "footer.note": "Personal, non-commercial project. The texts are original; images are uploaded by the site owner.",
      "img.missing": "Image coming soon"
    }
  };

  // nume site + tagline din config (config.js se încarcă înaintea acestui fișier)
  try {
    var _n = window.SITE_CONFIG && window.SITE_CONFIG.siteName;
    if (_n) { STRINGS.ro["site.name"] = _n.ro; STRINGS.en["site.name"] = _n.en; }
    var _t = window.SITE_CONFIG && window.SITE_CONFIG.tagline;
    if (_t) { STRINGS.ro["site.tagline"] = _t.ro; STRINGS.en["site.tagline"] = _t.en; }
  } catch (e) {}

  var LANG_KEY = "hd-lang";

  function getLang() {
    var stored = null;
    try { stored = localStorage.getItem(LANG_KEY); } catch (e) {}
    return (stored === "ro" || stored === "en") ? stored : "ro";
  }
  function setLang(lang) {
    if (lang !== "ro" && lang !== "en") return;
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
    applyLang(lang);
  }
  function t(key, lang) {
    lang = lang || getLang();
    var table = STRINGS[lang] || STRINGS.ro;
    return (key in table) ? table[key] : key;
  }
  function applyLang(lang) {
    lang = lang || getLang();
    document.documentElement.lang = lang;
    document.documentElement.setAttribute("data-lang", lang);
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"), lang);
    });
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(",").forEach(function (pair) {
        var bits = pair.split(":");
        if (bits.length === 2) el.setAttribute(bits[0].trim(), t(bits[1].trim(), lang));
      });
    });
    document.dispatchEvent(new CustomEvent("langchange", { detail: { lang: lang } }));
  }

  window.I18N = {
    get lang() { return getLang(); },
    set: setLang,
    t: t,
    apply: applyLang,
    toggle: function () { setLang(getLang() === "ro" ? "en" : "ro"); }
  };

  document.addEventListener("DOMContentLoaded", function () {
    applyLang(getLang());
    var btn = document.getElementById("lang-toggle");
    if (btn) btn.addEventListener("click", function () { window.I18N.toggle(); });
  });
})();
