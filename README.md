# Weekmenu

Weekmenu, boodschappenlijstje en recepten, gedeeld tussen jou en je vriendin.

- **Pagina**: gewone statische site (`index.html`), gehost op GitHub Pages. Geen Google-waarschuwingsbalk, geen inlog.
- **Opslag**: een Google Sheet, bereikt via een kleine Apps Script-API (`apps-script/Code.gs`).

## Eenmalig instellen

### 1. Google Sheet + API
1. Maak een lege Google Sheet (bv. "Weekmenu").
2. **Extensies → Apps Script**. Wis de inhoud van `Code.gs` en plak `apps-script/Code.gs` erin. Opslaan.
3. **Implementeren → Nieuwe implementatie → Web-app**
   - Uitvoeren als: **Ik**
   - Wie heeft toegang: **Iedereen** (zonder dit moet je telkens inloggen)
4. Toestemming geven (Geavanceerd → Ga naar … → Toestaan).
5. Kopieer de Web-app-URL (eindigt op `/exec`).

> Wie de URL kent, kan het menu lezen en wijzigen. Deel hem dus alleen met wie het moet kunnen. Er staan geen gevoelige gegevens in.

### 2. Pagina op GitHub Pages
1. Open `config.js` en plak de URL tussen de aanhalingstekens bij `window.API_URL`.
2. Maak een repository op github.com en upload alle bestanden uit deze map (behalve `apps-script/`, dat mag er ook bij staan).
3. **Settings → Pages → Build and deployment**: Source = *Deploy from a branch*, Branch = `main`, map = `/ (root)`. Opslaan.
4. Na een minuutje staat de app op `https://<jouw-naam>.github.io/<repo>/`.
5. Zet de link op het beginscherm van je telefoon ("Zet op beginscherm") en stuur hem naar je vriendin.

## Later iets wijzigen
- **Pagina** (`index.html`, `config.js`): bestand aanpassen op GitHub en committen. Na een minuutje is het live.
- **API** (`Code.gs`): plakken in Apps Script, dan **Implementeren → Implementaties beheren → potloodje → Nieuwe versie**. De URL blijft gelijk.

## Mapindeling
```
index.html            de app
config.js             API-adres
manifest.webmanifest  maakt installeren op beginscherm mooier
icon*.png / icon.svg  app-icoon
apps-script/Code.gs   backend voor de Google Sheet
```
