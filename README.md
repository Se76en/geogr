# Ghepardul asiatic (Acinonyx jubatus venaticus)

Proiect de geografie prezentat ca website, cu 9 slide-uri (echivalentul unei
prezentări PowerPoint de 9 pagini).

## Cum deschizi proiectul

Dublu-clic pe **`index.html`**. Site-ul se deschide direct în browser, fără
server și fără internet (fonturile și imaginile sunt locale).

Pentru o versiune publicată pe internet, se poate folosi orice hosting static
(GitHub Pages, Netlify, Vercel) sau `python -m http.server` din acest folder.

## Cum prezinți

| Acțiune | Tastă / buton |
|---|---|
| Slide următor | `Săgeată în jos`, `Săgeată la dreapta`, `Spațiu`, `Page Down` |
| Slide anterior | `Săgeată în sus`, `Săgeată la stânga`, `Page Up` |
| Primul / ultimul slide | `Home` / `End` |
| Cuprins | Butonul **Cuprins** din dreapta-sus |
| Închide cuprinsul | `Esc` |
| Salvează ca PDF | **Cuprins** -> **Tipărește / salvează ca PDF** |

Bara de jos din dreapta are butoanele de înainte / înapoi și indicatorul
`n / 9`. Pe telefon, indicatorul apare în bara de sus.

## Cele 9 slide-uri

1. **Ghepardul asiatic** - titlu, stare actuală
2. **Fișa speciei** - taxonomie, dimensiuni, blană, dietă, reproducere
3. **Unde mai trăiește azi** - harta arealului, cele 5 arii protejate, cifrele
4. **Arealul de odinioară și retragerea** - istoricul răspândirii, 1948-2026
5. **De ce a dispărut din vechiul areal** - cele 5 cauze istorice
6. **De ce este pe cale de dispariție** - amenințările actuale
7. **Cifrele prăbușirii** - graficul populației 1970-2026
8. **Ce se face acum** - programul din 2001, cercetare, reproducere, conștiința publică
9. **Cum putem preveni dispariția** - acțiuni concrete + concluzii

## Structura fișierelor

```
Prj geografie/
├── index.html            structura și conținutul celor 9 slide-uri
├── styles.css            design system (tokens, layout, responsive, print)
├── app.js                deck: scroll-snap, tastatură, cuprins, tipărire
├── CREDITS.txt           credite foto, licențe și surse textuale
└── assets/
    ├── fonts/            Archivo + IBM Plex Mono (hostate local, fără CDN)
    └── img/              fotografii și harta
```

## Note tehnice

- **Fără dependințe, fără build.** HTML + CSS + JavaScript vanilla, deci
  funcționează și offline, pe orice calculator.
- **Temă unică (dark), un singur accent** (portocaliu chihlimbarie), o singură
  scară de colțuri (butoane capsule, carduri 14px).
- **Responsiv**: 3 breakpoint-uri (1080px, 720px) și reflow explicit pentru
  fiecare slide.
- **Accesibilitate**: `prefers-reduced-motion` dezactivează toate animațiile,
  contrast WCAG AA, text alternativ pe fiecare imagine, navigare completă cu
  tastatura.
- **Tipărire**: stilul `@media print` pune câte un slide pe o pagină A4
  peisaj, cu fundal alb. Se pot trimite PDF-uri direct din browser.

## Surse

Vezi `CREDITS.txt` pentru lista completă a surselor textuale și a licențelor
foto. Cifrele folosite provin din Lista Roșie IUCN, Societatea Iraniană
pentru Ghepard, Wildlife Conservation Society, CITES și din articole de
specialitate din Iran, India și Asia Centrală.
