/* Test headless (jsdom): randare, linkuri, butoane, filtre, recenzii (mod local). */
import { JSDOM } from "jsdom";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(DIR, "..");
let pass = 0, fail = 0;
const ok = (c, m) => { (c ? pass++ : fail++); console.log((c ? "  ok  " : " FAIL ") + m); };

function prep(html) {
  html = html.replace(/<head>/, `<head><script>window.addEventListener("error",e=>{window.__err=(window.__err||"")+String(e.message||e.error)+" | ";});</script>`);
  html = html.replace(/<link[^>]+href="https?:\/\/[^"]*"[^>]*>/g, "");
  html = html.replace(/<script[^>]+src="https?:\/\/[^"]*"[^>]*><\/script>/g, "");
  html = html.replace(/<script src="(js\/[^"]+)"><\/script>/g, (_, src) =>
    "<script>\n" + fs.readFileSync(path.join(ROOT, src), "utf8") + "\n</script>");
  return html;
}
function load(file, query = "") {
  const dom = new JSDOM(prep(fs.readFileSync(path.join(ROOT, file), "utf8")), {
    runScripts: "dangerously", pretendToBeVisual: true,
    url: "http://localhost:5174/" + file + query
  });
  return new Promise((res) => {
    const w = dom.window;
    const done = () => setTimeout(() => res(w), 40);
    if (w.document.readyState === "complete") done();
    else w.addEventListener("load", done);
  });
}
const DONATE_RE = /^https:\/\/www\.paypal\.com\/donate\/\?business=razvanfa%40gmail\.com/;

/* -------- index.html -------- */
{
  const w = await load("index.html");
  const d = w.document;
  ok(!w.__err, "index: fără erori JS" + (w.__err ? " — " + w.__err : ""));
  ok(d.querySelectorAll("#grid .card").length === 6, "index: 6 carduri (exemple)");
  ok([...d.querySelectorAll("#grid .card")].every(a => /^loc\.html\?id=[a-z-]+$/.test(a.getAttribute("href"))), "index: href-uri carduri valide");
  ok(d.querySelectorAll("#f-section option").length === 1 + 3, "index: filtru secțiune = 3 + Toate");
  ok(d.querySelectorAll("#f-area option").length === 1 + 6, "index: filtru zonă = 6 + Toate (Petroșani, Petrila, Vulcan, Lupeni, Straja, Parâng)");
  ok(/09:00|08:00/.test(d.querySelector("#itin-preview").textContent) || d.querySelector("#itin-preview .itin-mini__list"), "index: preview itinerariu randat");
  ok(!!d.querySelector('#itin-preview a[href^="itinerariu.html?id="]'), "index: buton 'vezi tot itinerariul'");
  const dl = d.querySelectorAll("[data-donate]");
  ok(dl.length >= 2 && [...dl].every(a => DONATE_RE.test(a.href) && a.target === "_blank"), "index: linkuri donații corecte");
  // filtre
  const s = d.querySelector("#f-section"); s.value = "cazare"; s.dispatchEvent(new w.Event("change"));
  ok(d.querySelectorAll("#grid .card").length === 2, "index: filtru secțiune=cazare -> 2 carduri");
  d.querySelector("#f-reset").dispatchEvent(new w.Event("click"));
  ok(d.querySelectorAll("#grid .card").length === 6, "index: reset -> 6 carduri");
  // limba
  const before = d.querySelector(".hero h1").textContent;
  d.querySelector("#lang-toggle").dispatchEvent(new w.Event("click"));
  ok(d.querySelector(".hero h1").textContent !== before && /Valea Jiului/.test(d.querySelector(".hero h1").textContent), "index: comutator RO->EN schimbă titlul");
  ok(d.querySelector("#f-section option").textContent === "All", "index: opțiunile de filtru se traduc");
}

/* -------- loc.html + recenzii (mod local) -------- */
{
  const w = await load("loc.html", "?id=exemplu-obiectiv-petrosani");
  const d = w.document;
  ok(!w.__err, "loc: fără erori JS" + (w.__err ? " — " + w.__err : ""));
  ok(/Obiectiv turistic/.test(d.querySelector("h1")?.textContent || ""), "loc: titlu randat");
  ok(d.querySelector(".btn--waze")?.href === "https://www.waze.com/ul?ll=45.4166%2C23.3733&navigate=yes", "loc: link Waze corect");
  ok(d.querySelector(".btn--gmaps")?.href === "https://www.google.com/maps/dir/?api=1&destination=45.4166%2C23.3733", "loc: link Google Maps corect");
  ok(!!d.querySelector(".detail__example"), "loc: badge 'exemplu' afișat");

  // recenzii
  ok(!!d.querySelector("#reviews .review-form"), "recenzii: formularul e randat");
  ok(!!d.querySelector('#reviews .rv-note'), "recenzii: nota 'mod de probă' vizibilă (provider local)");
  ok(!d.querySelector("#reviews .cf-turnstile"), "recenzii: fără captcha în mod local");
  ok(/Nicio recenzie/.test(d.querySelector("#reviews").textContent), "recenzii: mesaj 'nicio recenzie' inițial");

  // trimite o recenzie
  const form = d.querySelector("#reviews .review-form");
  form.querySelector('input[name="name"]').value = "Ion Test";
  const r4 = form.querySelector('input[name="rating"][value="4"]'); r4.checked = true;
  form.querySelector('textarea[name="body"]').value = "Foarte frumos, merită.";
  form.querySelector('input[name="title"]').value = "Recomand";
  form.dispatchEvent(new w.Event("submit", { cancelable: true, bubbles: true }));
  await new Promise(r => setTimeout(r, 60));
  const txt = d.querySelector("#reviews").textContent;
  ok(/Ion Test/.test(txt) && /Foarte frumos/.test(txt), "recenzii: recenzia trimisă apare în listă (mod local)");
  ok(/1\.0|4\.0|Media|recenzie/.test(txt) && d.querySelector("#reviews .reviews-avg")?.textContent === "4.0", "recenzii: media notelor = 4.0");
  ok(/verificat|apărea|checked/i.test(d.querySelector("#reviews .rv-msg")?.textContent || "") === false, "recenzii: mesaj de confirmare afișat (nu eroare)");
}

/* -------- loc.html id invalid -------- */
{
  const w = await load("loc.html", "?id=nope");
  const d = w.document;
  ok(!w.__err, "loc invalid: fără erori JS");
  ok(/nu există|does not exist/i.test(d.querySelector("#place").textContent), "loc invalid: mesaj corect");
  ok(d.querySelector("#reviews").hidden, "loc invalid: secțiunea de recenzii ascunsă");
}

/* -------- itinerariu.html -------- */
{
  const w = await load("itinerariu.html");
  const d = w.document;
  ok(!w.__err, "itinerariu: fără erori JS" + (w.__err ? " — " + w.__err : ""));
  ok(d.querySelectorAll(".itin-step").length === 6, "itinerariu: 6 pași");
  const navs = d.querySelectorAll(".itin-step__nav a");
  ok(navs.length >= 8 && [...navs].every(a => /waze\.com|google\.com\/maps/.test(a.href)), "itinerariu: fiecare pas cu loc are linkuri Waze + Maps");
  ok([...d.querySelectorAll('.itin-step__go')].every(a => /^loc\.html\?id=[a-z-]+$/.test(a.getAttribute("href"))), "itinerariu: linkuri 'vezi detalii' valide");
}

/* -------- credite.html -------- */
{
  const w = await load("credite.html");
  const d = w.document;
  ok(!w.__err, "credite: fără erori JS");
  ok(d.querySelectorAll(".credit-card").length === 6, "credite: 6 blocuri");
  ok(d.querySelectorAll(".credit-files li code").length === 7, "credite: 7 fișiere de imagine listate");
}

/* -------- fișiere prezente -------- */
{
  const files = ["index.html","loc.html","itinerariu.html","credite.html","404.html","netlify.toml",
    "README.md","SETUP.md","DOMENIU.md","css/style.css","supabase/schema.sql",
    "netlify/functions/submit-review.mjs","images/placeholder.svg",
    "js/config.js","js/data.js","js/i18n.js","js/common.js","js/reviews.js","js/home.js","js/detail.js","js/itinerary.js","js/credits.js"];
  const missing = files.filter(f => !fs.existsSync(path.join(ROOT, f)));
  ok(missing.length === 0, "toate fișierele există" + (missing.length ? ": lipsesc " + missing.join(", ") : ""));
}

console.log(`\n${pass} pass, ${fail} fail`);
process.exit(fail ? 1 : 0);
