# O zi în județul Hunedoara

Site static bilingv (RO / EN) — schelet. Temă: **24 de ore în Valea Jiului**, cu
extindere ulterioară la tot județul Hunedoara.

Secțiuni: **De vizitat**, **Unde mănânci**, **Unde te cazezi**, plus un
**itinerariu pe ore**. Fiecare loc are: poze, descriere, informații practice,
trasee **Waze** + **Google Maps**, și **recenzii** de la vizitatori (note 1–5,
text, titlu, poză opțională, cu moderare și captcha).

## Structură

```
index.html         Prima pagină: itinerariu (preview) + hartă + filtre + carduri
loc.html?id=<slug> Pagina unui loc + secțiunea de recenzii
itinerariu.html    Itinerariul complet, pe ore
credite.html       Lista automată a fișierelor de imagine
404.html           Pagină 404

css/style.css      Tot stilul
js/config.js       SETĂRI: nume site, link donații, mod recenzii (local/remote)
js/data.js         LOCURILE + ITINERARIILE (acum doar exemple — le înlocuiești)
js/i18n.js         Texte RO/EN + comutator de limbă
js/common.js       Funcții comune (Waze/Maps, stele, fallback imagini, donații)
js/reviews.js      Modulul de recenzii (provider local sau Supabase+Netlify)
js/home.js         Logica primei pagini
js/detail.js       Logica paginii de loc
js/itinerary.js    Logica paginii de itinerariu
js/credits.js      Logica paginii de credite

netlify/functions/submit-review.mjs  Primește recenziile (captcha + moderare)
netlify.toml                         Config Netlify
supabase/schema.sql                  Tabelul de recenzii + reguli

images/            Pozele locurilor (vezi images/README.md)
SETUP.md           Cum activezi recenziile reale (Supabase + Turnstile + Netlify)
DOMENIU.md         Cum cumperi domeniul și îl legi de site
```

## Rulare locală

```bash
node serve.js        # http://localhost:5174
```

Recenziile pornesc în modul **local** (se salvează doar în browserul tău, ca să
poți lucra la design). Harta și fonturile au nevoie de internet; restul merge și
offline.

Pentru a testa recenziile **reale** local ai nevoie de Netlify CLI:

```bash
npm i -g netlify-cli
netlify dev
```

## Ce urmează

1. **Locurile:** editează `js/data.js` — șterge exemplele, adaugă locurile tale
   (id, secțiune, zonă, coordonate). Descrierile le scriem împreună.
2. **Pozele:** le pui în `images/` cu numele din `credite.html`.
3. **Recenzii reale:** urmează `SETUP.md`.
4. **Online:** `DOMENIU.md` (domeniu + Netlify).

## Extindere la tot județul

Zona e un simplu câmp `area` în `js/data.js`. Când treci dincolo de Valea Jiului,
adaugi locuri cu `area: "Hațeg"`, `"Deva"`, `"Hunedoara"`, `"Orăștie"` etc. —
filtrul de zonă se populează singur. Poți adăuga și alte itinerarii în
`SITE_ITINERARIES` (ex. „O zi în Țara Hațegului").
