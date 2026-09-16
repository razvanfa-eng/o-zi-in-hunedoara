/*
 * DATELE SITE-ULUI / SITE DATA
 * =====================================================================
 * Aici adaugi locurile. Momentan sunt doar EXEMPLE (example: true) —
 * șterge-le și pune locurile tale. Descrierile le completăm împreună.
 *
 * Add your places here. For now these are only EXAMPLES (example: true) —
 * delete them and add your own. We'll write the descriptions together.
 *
 * Câmpuri / Fields:
 *   id        text unic, doar litere mici și cratime (folosit în URL)
 *   name      numele afișat
 *   section   "vizitat" | "mancare" | "cazare"
 *   area      zona/orașul (apare ca filtru) — text liber, ex. "Petroșani"
 *   coords    [latitudine, longitudine] — pentru hartă, Waze, Google Maps
 *   images    listă de fișiere din folderul images/ (vezi images/README.md)
 *   ro / en   { tagline, description[], address, hours, phone, website, bestTime, transport }
 *             lasă gol ("" sau []) ce nu se aplică
 */
window.SITE_PLACES = [
  {
    id: "exemplu-obiectiv-petrosani",
    name: "Exemplu · Obiectiv turistic",
    section: "vizitat",
    area: "Petroșani",
    coords: [45.4166, 23.3733],
    example: true,
    images: ["images/exemplu-obiectiv-petrosani-1.jpg", "images/exemplu-obiectiv-petrosani-2.jpg"],
    ro: {
      tagline: "Loc de tip EXEMPLU. Înlocuiește-l cu un obiectiv real din Valea Jiului.",
      description: [
        "Acesta este un loc de probă, pus doar ca să vezi cum arată o pagină. Șterge-l din js/data.js și adaugă obiectivele tale.",
        "Descrierea reală o scriem împreună după ce alegi locurile: istoric, ce se vede, cât stai, sfaturi practice."
      ],
      address: "Petroșani, jud. Hunedoara",
      hours: "",
      phone: "",
      website: "",
      bestTime: "",
      transport: ""
    },
    en: {
      tagline: "This is an EXAMPLE place. Replace it with a real sight in Valea Jiului.",
      description: [
        "This is a sample entry, here only to show how a page looks. Delete it from js/data.js and add your own sights.",
        "We'll write the real description together once you pick the places: history, what to see, how long to stay, practical tips."
      ],
      address: "Petroșani, Hunedoara county",
      hours: "",
      phone: "",
      website: "",
      bestTime: "",
      transport: ""
    }
  },
  {
    id: "exemplu-panorama-parang",
    name: "Exemplu · Punct panoramic",
    section: "vizitat",
    area: "Parâng",
    coords: [45.3430, 23.5190],
    example: true,
    images: ["images/exemplu-panorama-parang-1.jpg"],
    ro: {
      tagline: "EXEMPLU de punct panoramic în masivul Parâng.",
      description: ["Înlocuiește cu un belvedere / traseu real. Coordonatele sunt orientative, pune-le exact pe cele ale locului tău."],
      address: "Masivul Parâng",
      hours: "", phone: "", website: "",
      bestTime: "Iunie–octombrie pentru drumeție; iarna pentru pârtii.",
      transport: "Telescaunul din Petroșani urcă spre platoul Parâng."
    },
    en: {
      tagline: "EXAMPLE viewpoint in the Parâng massif.",
      description: ["Replace with a real viewpoint / trail. The coordinates are approximate — set the exact ones for your place."],
      address: "Parâng massif",
      hours: "", phone: "", website: "",
      bestTime: "June–October for hiking; winter for the ski slopes.",
      transport: "The chairlift from Petroșani goes up towards the Parâng plateau."
    }
  },
  {
    id: "exemplu-restaurant-petrila",
    name: "Exemplu · Restaurant local",
    section: "mancare",
    area: "Petrila",
    coords: [45.4530, 23.4160],
    example: true,
    images: ["images/exemplu-restaurant-petrila-1.jpg"],
    ro: {
      tagline: "EXEMPLU de local. Pune un restaurant / bistro real (aici: Petrila).",
      description: ["Aici vor veni: tipul bucătăriei, specialități, interval de preț, dacă e nevoie de rezervare."],
      address: "Petrila, centru",
      hours: "12:00–23:00",
      phone: "",
      website: "",
      bestTime: "",
      transport: ""
    },
    en: {
      tagline: "EXAMPLE eatery. Add a real restaurant / bistro in Petroșani.",
      description: ["This will hold: type of cuisine, signature dishes, price range, whether booking is needed."],
      address: "Petrila, town centre",
      hours: "12:00–23:00",
      phone: "",
      website: "",
      bestTime: "",
      transport: ""
    }
  },
  {
    id: "exemplu-cabana-straja",
    name: "Exemplu · Cabană cu bucătărie",
    section: "mancare",
    area: "Straja",
    coords: [45.3470, 23.2080],
    example: true,
    images: ["images/exemplu-cabana-straja-1.jpg"],
    ro: {
      tagline: "EXEMPLU de cabană unde se poate mânca, în stațiunea Straja.",
      description: ["Descriere reală de completat: mâncare tradițională, terasă, program iarna/vara."],
      address: "Stațiunea Straja, Lupeni",
      hours: "", phone: "", website: "", bestTime: "", transport: "Telescaun din Lupeni."
    },
    en: {
      tagline: "EXAMPLE mountain chalet with food, in the Straja resort.",
      description: ["Real description to be filled in: traditional food, terrace, winter/summer hours."],
      address: "Straja resort, Lupeni",
      hours: "", phone: "", website: "", bestTime: "", transport: "Chairlift from Lupeni."
    }
  },
  {
    id: "exemplu-pensiune-lupeni",
    name: "Exemplu · Pensiune",
    section: "cazare",
    area: "Lupeni",
    coords: [45.3590, 23.2400],
    example: true,
    images: ["images/exemplu-pensiune-lupeni-1.jpg"],
    ro: {
      tagline: "EXEMPLU de pensiune (aici: Lupeni, la baza stațiunii Straja). Înlocuiește cu una reală.",
      description: ["De completat: număr de camere, facilități, preț orientativ/noapte, dacă acceptă animale, parcare."],
      address: "Lupeni",
      hours: "", phone: "", website: "", bestTime: "", transport: "La baza telescaunului spre Straja."
    },
    en: {
      tagline: "EXAMPLE guesthouse (here: Lupeni, at the foot of the Straja resort). Replace with a real one.",
      description: ["To be filled in: number of rooms, facilities, indicative price/night, pets, parking."],
      address: "Lupeni",
      hours: "", phone: "", website: "", bestTime: "", transport: "At the foot of the Straja chairlift."
    }
  },
  {
    id: "exemplu-hotel-vulcan",
    name: "Exemplu · Hotel",
    section: "cazare",
    area: "Vulcan",
    coords: [45.3780, 23.2740],
    example: true,
    images: ["images/exemplu-hotel-vulcan-1.jpg"],
    ro: {
      tagline: "EXEMPLU de hotel (aici: Vulcan).",
      description: ["De completat: categorie, dotări, restaurant propriu, aproape de centru."],
      address: "Vulcan",
      hours: "", phone: "", website: "", bestTime: "", transport: ""
    },
    en: {
      tagline: "EXAMPLE hotel (here: Vulcan).",
      description: ["To be filled in: rating, amenities, on-site restaurant, close to the centre."],
      address: "Vulcan",
      hours: "", phone: "", website: "", bestTime: "", transport: ""
    }
  }
];

/*
 * ITINERARII / ITINERARIES
 * =====================================================================
 * Fiecare itinerariu e un program pe ore. Un pas poate:
 *  - trimite la un loc din SITE_PLACES prin placeId, SAU
 *  - fi un pas liber, cu title propriu.
 * note = text scurt bilingv (opțional).
 */
window.SITE_ITINERARIES = [
  {
    id: "o-zi-valea-jiului",
    area: "Valea Jiului",
    example: true,
    title: { ro: "O zi în Valea Jiului", en: "One day in Valea Jiului" },
    intro: {
      ro: "Un exemplu de program pentru 24 de ore. Îl rescriem împreună după ce alegi locurile.",
      en: "A sample 24-hour plan. We'll rewrite it together once you pick the places."
    },
    steps: [
      { time: "08:00", placeId: "exemplu-restaurant-petrila", note: { ro: "Mic dejun în Petrila.", en: "Breakfast in Petrila." } },
      { time: "09:30", placeId: "exemplu-obiectiv-petrosani", note: { ro: "Primul obiectiv al zilei.", en: "First sight of the day." } },
      { time: "12:00", placeId: "exemplu-panorama-parang", note: { ro: "Urci în Parâng pentru priveliște și o drumeție scurtă.", en: "Up to Parâng for the views and a short hike." } },
      { time: "14:30", placeId: "exemplu-cabana-straja", note: { ro: "Prânz la cabană, în Straja.", en: "Lunch at the chalet, in Straja." } },
      { time: "16:30", title: { ro: "Timp liber în centrul Petroșaniului", en: "Free time in central Petroșani" }, note: { ro: "Plimbare, cafea, muzeu.", en: "A walk, coffee, the museum." } },
      { time: "19:30", placeId: "exemplu-hotel-vulcan", note: { ro: "Cazare și cină.", en: "Check in and dinner." } }
    ]
  }
];
