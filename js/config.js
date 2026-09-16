/*
 * Configurare site / Site configuration.
 * =====================================================================
 * Aici se schimbă TOT ce ține de setări, fără să atingi restul codului.
 * Everything configurable lives here.
 */
window.SITE_CONFIG = {

  /* Numele site-ului (apare în header și în <title>). Bilingv. */
  siteName: {
    ro: "O zi în Valea Jiului",
    en: "One day in Valea Jiului"
  },
  /* Subtitlu scurt pe prima pagină. */
  tagline: {
    ro: "Ce vizitezi, unde mănânci și unde te cazezi — un plan pentru 24 de ore în Valea Jiului, în drum spre tot județul Hunedoara.",
    en: "What to see, where to eat and where to stay — a 24-hour plan for Valea Jiului, on the way to the whole of Hunedoara county."
  },

  /* -------------------------------------------------------------------
   * DONAȚII
   * Link PayPal generat din adresa de e-mail. Schimbă e-mailul dacă
   * PayPal-ul tău folosește altă adresă (păstrează %40 în loc de @).
   * Pune "" ca să ascunzi butonul de donații.
   * ------------------------------------------------------------------- */
  donateUrl: "https://www.paypal.com/donate/?business=razvanfa%40gmail.com&no_recurring=0&item_name=Sus%C8%9Binerea%20proiectului%20O%20zi%20%C3%AEn%20jude%C8%9Bul%20Hunedoara&currency_code=EUR",

  /* -------------------------------------------------------------------
   * RECENZII
   * provider:
   *   "local"  -> recenziile se salvează în browserul vizitatorului
   *               (localStorage). Bun pentru dezvoltare / probe.
   *               NU sunt partajate între vizitatori.
   *   "remote" -> recenziile se citesc din Supabase și se trimit prin
   *               funcția Netlify (cu verificare captcha + moderare).
   *               Vezi SETUP.md pentru pași.
   * ------------------------------------------------------------------- */
  reviews: {
    provider: "local",

    // completează după ce creezi proiectul Supabase (SETUP.md)
    supabaseUrl: "",            // ex: https://abcdefgh.supabase.co
    supabaseAnonKey: "",        // cheia "anon public" din Supabase

    // endpointul funcției care primește recenzia (rulează pe Netlify)
    submitEndpoint: "/.netlify/functions/submit-review",

    // Cloudflare Turnstile (captcha) — cheia publică "site key"
    turnstileSiteKey: "",

    // câmpuri active în formular
    allowPhoto: true,           // vizitatorul poate atașa o poză
    requireCaptcha: true,       // cere captcha înainte de trimitere (doar în modul "remote")
    moderated: true             // recenziile apar doar după aprobarea ta
  }
};
