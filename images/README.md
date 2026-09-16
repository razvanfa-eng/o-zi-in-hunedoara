# Imagini / Images

Pune fișierele aici. Numele fișierelor trebuie să fie **exact** cele din lista
`images` a fiecărui loc din `js/data.js`. Format: `.jpg`, minim ~1600 px pe latura
mare, orientare peisaj de preferat. Dacă un fișier lipsește, site-ul afișează
automat `placeholder.svg`.

Prima imagine din listă (`...-1.jpg`) e folosită pe card și ca imagine mare pe
pagina locului.

## Exemplele curente (le vei înlocui)

| Loc | Fișiere |
|---|---|
| Exemplu · Obiectiv turistic (Petroșani) | `exemplu-obiectiv-petrosani-1.jpg`, `exemplu-obiectiv-petrosani-2.jpg` |
| Exemplu · Punct panoramic (Parâng) | `exemplu-panorama-parang-1.jpg` |
| Exemplu · Restaurant local (Petrila) | `exemplu-restaurant-petrila-1.jpg` |
| Exemplu · Cabană cu bucătărie (Straja) | `exemplu-cabana-straja-1.jpg` |
| Exemplu · Pensiune (Lupeni) | `exemplu-pensiune-lupeni-1.jpg` |
| Exemplu · Hotel (Vulcan) | `exemplu-hotel-vulcan-1.jpg` |

Pagina **Imagini & credite** (`credite.html`) generează automat lista completă
din `js/data.js`, deci după ce adaugi locurile tale vei vedea acolo toate numele
de fișiere de care ai nevoie.

## Pozele din recenzii

Sunt separate: vizitatorii le încarcă prin formular, iar în modul „remote" ajung
în Supabase Storage (bucket `review-photos`), nu în acest folder.
