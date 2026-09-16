/*
 * RECENZII / REVIEWS
 * =====================================================================
 * Un singur modul, cu doi „furnizori" (providers):
 *   - local  : salvează în localStorage (probe / dezvoltare). Nepartajat.
 *   - remote : citește din Supabase, trimite prin funcția Netlify
 *              (verificare captcha + moderare). Vezi SETUP.md.
 * Comută din js/config.js -> reviews.provider.
 */
(function () {
  var CFG = (window.SITE_CONFIG && window.SITE_CONFIG.reviews) || {};
  var MODE = CFG.provider === "remote" ? "remote" : "local";
  var T = function (k) { return window.I18N.t(k); };
  var esc = function (s) { return window.RL.esc(s); };

  /* ---------------- Providers ---------------- */

  var LocalProvider = {
    key: function (placeId) { return "hd-reviews-" + placeId; },
    list: function (placeId) {
      try {
        var raw = localStorage.getItem(this.key(placeId));
        return raw ? JSON.parse(raw) : [];
      } catch (e) { return []; }
    },
    submit: function (placeId, data) {
      var all = this.list(placeId);
      all.unshift({
        rating: data.rating, author_name: data.name, title: data.title || "",
        body: data.body, image_url: data.imageDataUrl || "",
        created_at: new Date().toISOString()
      });
      try { localStorage.setItem(this.key(placeId), JSON.stringify(all.slice(0, 50))); } catch (e) {}
      return Promise.resolve({ ok: true, moderated: false });
    }
  };

  var RemoteProvider = {
    list: function (placeId) {
      var base = (CFG.supabaseUrl || "").replace(/\/$/, "");
      if (!base || !CFG.supabaseAnonKey) return Promise.resolve([]);
      var url = base + "/rest/v1/reviews?select=rating,author_name,title,body,image_url,created_at" +
        "&place_id=eq." + encodeURIComponent(placeId) +
        "&status=eq.approved&order=created_at.desc&limit=100";
      return fetch(url, {
        headers: { apikey: CFG.supabaseAnonKey, authorization: "Bearer " + CFG.supabaseAnonKey }
      }).then(function (r) { return r.ok ? r.json() : []; }).catch(function () { return []; });
    },
    submit: function (placeId, data) {
      var endpoint = CFG.submitEndpoint || "/.netlify/functions/submit-review";
      return fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          placeId: placeId,
          rating: data.rating,
          name: data.name,
          title: data.title || "",
          body: data.body,
          token: data.captchaToken || "",
          imageBase64: data.imageBase64 || "",
          imageType: data.imageType || ""
        })
      }).then(function (r) {
        return r.json().then(function (j) {
          if (!r.ok || j.error) throw new Error(j.error || "HTTP " + r.status);
          return { ok: true, moderated: j.moderated !== false };
        });
      });
    }
  };

  var provider = MODE === "remote" ? RemoteProvider : LocalProvider;

  /* ---------------- Captcha (Turnstile) ---------------- */
  var turnstileLoaded = false;
  function loadTurnstile() {
    if (turnstileLoaded || !window.SITE_CONFIG) return;
    turnstileLoaded = true;
    var s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    s.async = true; s.defer = true;
    document.head.appendChild(s);
  }
  var captchaActive = MODE === "remote" && CFG.requireCaptcha && !!CFG.turnstileSiteKey;

  /* ---------------- UI ---------------- */

  function fmtDate(iso) {
    try {
      return new Date(iso).toLocaleDateString(window.I18N.lang === "ro" ? "ro-RO" : "en-GB",
        { year: "numeric", month: "short", day: "numeric" });
    } catch (e) { return ""; }
  }

  function summaryHtml(list) {
    var n = list.length;
    if (!n) return '<p class="reviews-empty">' + T("reviews.none") + "</p>";
    var avg = list.reduce(function (s, r) { return s + Number(r.rating || 0); }, 0) / n;
    var unit = n === 1 ? T("reviews.count.one") : T("reviews.count.many");
    return '<div class="reviews-summary">' +
      '<span class="reviews-avg">' + avg.toFixed(1) + "</span>" +
      window.RL.starsHtml(avg) +
      '<span class="reviews-total">' + n + " " + unit + "</span>" +
    "</div>";
  }

  function itemHtml(r) {
    var img = r.image_url
      ? '<img class="review-photo" loading="lazy" src="' + esc(r.image_url) + '" alt="" onerror="RL.imgError(this)">'
      : "";
    return '<li class="review">' +
      '<div class="review-head">' +
        window.RL.starsHtml(Number(r.rating || 0)) +
        '<span class="review-author">' + esc(r.author_name || "—") + "</span>" +
        '<span class="review-date">' + fmtDate(r.created_at) + "</span>" +
      "</div>" +
      (r.title ? '<p class="review-title">' + esc(r.title) + "</p>" : "") +
      '<p class="review-body">' + esc(r.body || "") + "</p>" +
      img +
    "</li>";
  }

  function formHtml() {
    var photo = (MODE === "remote" && CFG.allowPhoto) || (MODE === "local")
      ? '<label class="rv-field"><span data-i18n="reviews.form.photo">' + T("reviews.form.photo") + '</span>' +
        '<input type="file" name="photo" accept="image/png,image/jpeg,image/webp"></label>'
      : "";
    var captcha = captchaActive
      ? '<div class="rv-captcha cf-turnstile" data-sitekey="' + esc(CFG.turnstileSiteKey) + '"></div>'
      : "";
    var note = MODE === "local"
      ? '<p class="rv-note">' + T("reviews.local.note") + "</p>"
      : "";

    return '<form class="review-form" novalidate>' +
      '<h3 data-i18n="reviews.add">' + T("reviews.add") + "</h3>" +
      note +
      '<div class="rv-row">' +
        '<label class="rv-field"><span data-i18n="reviews.form.name">' + T("reviews.form.name") + '</span>' +
          '<input type="text" name="name" maxlength="80" autocomplete="name" required></label>' +
        '<label class="rv-field rv-field--rating"><span data-i18n="reviews.form.rating">' + T("reviews.form.rating") + '</span>' +
          '<span class="rating-input" role="radiogroup">' +
            [1, 2, 3, 4, 5].map(function (i) {
              return '<label class="ri-star"><input type="radio" name="rating" value="' + i + '" required><span>★</span></label>';
            }).join("") +
          "</span></label>" +
      "</div>" +
      '<label class="rv-field"><span data-i18n="reviews.form.title">' + T("reviews.form.title") + '</span>' +
        '<input type="text" name="title" maxlength="120"></label>' +
      '<label class="rv-field"><span data-i18n="reviews.form.body">' + T("reviews.form.body") + '</span>' +
        '<textarea name="body" rows="4" maxlength="4000" required></textarea></label>' +
      photo +
      captcha +
      '<p class="rv-msg" role="status" hidden></p>' +
      '<button type="submit" class="btn btn--primary" data-i18n="reviews.form.submit">' + T("reviews.form.submit") + "</button>" +
    "</form>";
  }

  function readFileAsBase64(file) {
    return new Promise(function (resolve, reject) {
      var fr = new FileReader();
      fr.onload = function () {
        var s = String(fr.result);
        var comma = s.indexOf(",");
        resolve({ base64: comma >= 0 ? s.slice(comma + 1) : s, dataUrl: s, type: file.type });
      };
      fr.onerror = reject;
      fr.readAsDataURL(file);
    });
  }

  function wireForm(form, placeId, onDone) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = form.querySelector(".rv-msg");
      var btn = form.querySelector('button[type="submit"]');
      var fd = new FormData(form);
      var name = (fd.get("name") || "").toString().trim();
      var rating = Number(fd.get("rating") || 0);
      var body = (fd.get("body") || "").toString().trim();
      var title = (fd.get("title") || "").toString().trim();

      function fail(key) { msg.hidden = false; msg.className = "rv-msg rv-msg--err"; msg.textContent = T(key); }

      if (!name || !body || !(rating >= 1 && rating <= 5)) return fail("reviews.form.required");

      var captchaToken = "";
      if (captchaActive) {
        try { captchaToken = window.turnstile && window.turnstile.getResponse(); } catch (e2) {}
        if (!captchaToken) return fail("reviews.form.captcha");
      }

      var fileInput = form.querySelector('input[type="file"]');
      var file = fileInput && fileInput.files && fileInput.files[0];
      var prep = Promise.resolve(null);
      if (file) {
        if (file.size > 3 * 1024 * 1024) { return fail("reviews.form.error"); }
        prep = readFileAsBase64(file);
      }

      btn.disabled = true;
      msg.hidden = false; msg.className = "rv-msg"; msg.textContent = T("reviews.form.sending");

      prep.then(function (img) {
        return provider.submit(placeId, {
          name: name, rating: rating, body: body, title: title,
          captchaToken: captchaToken,
          imageBase64: img && img.base64, imageType: img && img.type,
          imageDataUrl: img && img.dataUrl
        });
      }).then(function (res) {
        form.reset();
        try { if (captchaActive && window.turnstile) window.turnstile.reset(); } catch (e3) {}
        msg.className = "rv-msg rv-msg--ok";
        msg.textContent = res.moderated ? T("reviews.form.ok.moderated") : T("reviews.form.ok.live");
        btn.disabled = false;
        if (!res.moderated) onDone();
      }).catch(function () {
        msg.className = "rv-msg rv-msg--err";
        msg.textContent = T("reviews.form.error");
        btn.disabled = false;
      });
    });
  }

  function mount(container, placeId) {
    if (!container) return;
    if (captchaActive) loadTurnstile();

    function render() {
      container.innerHTML =
        '<h2 data-i18n="reviews.heading">' + T("reviews.heading") + "</h2>" +
        '<div class="reviews-summary-wrap">…</div>' +
        '<ul class="reviews-list"></ul>' +
        '<div class="review-form-wrap"></div>';

      var sumWrap = container.querySelector(".reviews-summary-wrap");
      var listEl = container.querySelector(".reviews-list");
      var formWrap = container.querySelector(".review-form-wrap");

      Promise.resolve(provider.list(placeId)).then(function (list) {
        list = Array.isArray(list) ? list : [];
        sumWrap.innerHTML = summaryHtml(list);
        listEl.innerHTML = list.map(itemHtml).join("");
      });

      formWrap.innerHTML = formHtml();
      wireForm(formWrap.querySelector("form"), placeId, function () {
        // re-încarcă lista după publicare imediată
        Promise.resolve(provider.list(placeId)).then(function (list) {
          list = Array.isArray(list) ? list : [];
          container.querySelector(".reviews-summary-wrap").innerHTML = summaryHtml(list);
          container.querySelector(".reviews-list").innerHTML = list.map(itemHtml).join("");
        });
      });

      if (captchaActive && window.turnstile) {
        try { window.turnstile.render(formWrap.querySelector(".cf-turnstile"), { sitekey: CFG.turnstileSiteKey }); } catch (e) {}
      }
    }

    render();
    document.addEventListener("langchange", render);
  }

  window.Reviews = { mount: mount, mode: MODE };
})();
