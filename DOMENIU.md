# Domeniu + publicare online

## 1. Alege și cumpără domeniul

Idei de nume: `ozihunedoara.ro`, `valeajiului24h.ro`, `descoperahunedoara.ro`,
`hunedoara24.ro` (sau `.com` dacă vizezi și public străin).

- **`.ro`** — prin un registrar acreditat ROTLD: de ex. **RoTLD partners**,
  Hostico, ROMARG, GoDaddy. Preț ~10–15 €/an.
- **`.com` / `.eu`** — **Cloudflare Registrar** (preț la cost, fără adaos),
  **Namecheap**, **Porkbun**. ~10 €/an.

Recomandare: cumpără domeniul de la **Cloudflare** (dacă alegi `.com`) sau de la
un registrar `.ro` serios, și lasă **hostingul pe Netlify** (gratuit).

## 2. Leagă domeniul de Netlify

1. În Netlify: **Site → Domain management → Add a domain** → scrie domeniul tău.
2. Netlify îți arată fie:
   - **name servers** (varianta recomandată): le pui la registrar în locul celor
     implicite. Netlify gestionează tot DNS-ul + certificatul HTTPS automat.
   - fie **înregistrări DNS** (A / CNAME) dacă vrei să ții DNS-ul la registrar:
     - `@`  → `75.2.60.5` (A record Netlify)
     - `www` → `<numele-site>.netlify.app` (CNAME)
3. Așteaptă propagarea (minute–ore). Netlify emite automat certificat Let's
   Encrypt → site pe `https://`.
4. Setează varianta principală (cu sau fără `www`) din **Domain management**.

## 3. După conectare

- Adaugă domeniul în **Cloudflare Turnstile** (lista de domenii permise) — altfel
  captcha dă eroare pe domeniul nou. Vezi `SETUP.md`.
- Verifică `SUPABASE_URL` și cheile în variabilele de mediu Netlify.

## Alternativă fără Netlify

Dacă preferi hosting clasic (cPanel): site-ul static merge ca atare (urci
fișierele prin FTP), dar **funcția de recenzii nu va rula** — ai nevoie de un
echivalent în PHP. Spune-mi dacă mergi pe varianta asta și îl scriu.
