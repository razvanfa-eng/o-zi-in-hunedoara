# Activarea recenziilor reale (Supabase + Turnstile + Netlify)

În modul implicit (`provider: "local"` în `js/config.js`) recenziile se salvează
doar în browserul fiecărui vizitator. Pentru recenzii reale, partajate, urmează
pașii de mai jos. Toate serviciile au plan gratuit suficient pentru un site mic.

---

## 1. Supabase (baza de date)

1. Creează cont pe <https://supabase.com> → **New project**. Notează:
   - **Project URL**  → `https://xxxx.supabase.co`
   - **anon public key** (Settings → API)
   - **service_role key** (Settings → API) — **SECRETĂ**, nu o pune niciodată în `js/`
2. **SQL Editor** → lipește conținutul din `supabase/schema.sql` → **Run**.
3. **Storage** → **New bucket** → nume `review-photos` → bifează **Public**.

## 2. Cloudflare Turnstile (captcha)

1. <https://dash.cloudflare.com> → **Turnstile** → **Add site**.
2. Domenii: adaugă domeniul tău + `localhost` (pentru teste).
3. Notează **Site Key** (publică) și **Secret Key** (secretă).

## 3. Configurare în cod

În `js/config.js`, la `reviews`:

```js
provider: "remote",
supabaseUrl: "https://xxxx.supabase.co",
supabaseAnonKey: "eyJhbGciOi...",      // anon public key
turnstileSiteKey: "0x4AAAAAAA...",     // Site Key de la Turnstile
```

(`supabaseAnonKey` și `turnstileSiteKey` sunt **publice** prin design — sunt
protejate de regulile RLS și de verificarea din funcție.)

## 4. Netlify (găzduire + funcția de trimitere)

1. Urcă proiectul pe GitHub și conectează-l în Netlify (**Add new site → Import
   from Git**). Build command: gol. Publish directory: `.`.
2. **Site settings → Environment variables** → adaugă:
   - `SUPABASE_URL` = `https://xxxx.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` = *(service_role key — secretă)*
   - `TURNSTILE_SECRET_KEY` = *(Secret Key de la Turnstile)*
3. Redeploy.

## 5. Moderarea recenziilor

O recenzie nouă intră cu `status = 'pending'` și **nu apare** pe site.
Ca s-o publici:

- Supabase → **Table editor → reviews** → schimbi `status` în `approved`.
- sau SQL: `update public.reviews set status='approved' where id='...';`

Pune `status = 'rejected'` pentru spam (rămâne în tabel, dar ascuns).

## Test local cu recenzii reale

```bash
npm i -g netlify-cli
netlify dev
```

Netlify CLI încarcă variabilele de mediu dintr-un fișier `.env` local (ține-l
în afara git — e deja în `.gitignore`):

```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
TURNSTILE_SECRET_KEY=...
```
