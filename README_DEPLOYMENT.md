# GTB Vragenrad - Deployment Package

## 📦 Inhoud van dit pakket

Dit pakket bevat de volledige GTB Vragenrad applicatie klaar voor deployment naar Cloudflare Pages.

### Bestanden:
- `dist/` - Gebouwde applicatie (klaar voor deployment)
- `client/src/` - React source code
- `package.json` - Dependencies en build scripts
- `CLOUDFLARE_DEPLOYMENT.md` - Gedetailleerde deployment instructies

## 🚀 Snelle Start (5 minuten)

### 1. Code naar GitHub pushen
```bash
# In de projectmap:
git init
git add .
git commit -m "GTB Vragenrad"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/gtb-vragenrad.git
git push -u origin main
```

### 2. Cloudflare Pages connecteren
1. Ga naar https://dash.cloudflare.com
2. Klik "Pages" → "Create a project"
3. Selecteer je GitHub repository
4. Build command: `pnpm build`
5. Build output: `dist/public`
6. Klik "Save and Deploy"

### 3. Klaar!
Je app is nu live op `https://gtb-vragenrad.pages.dev`

## 📋 Wat is er in deze versie?

✅ **Vragenrad** - 66 vragen in 3 moeilijkheidsgraden
✅ **Timer** - 2 minuten per vraag (pauseerbaar)
✅ **Duiding** - "Waarom deze vraag?" uitleg voor begeleiders
✅ **Sessie tracking** - Houd bij welke vragen besproken zijn
✅ **Mobiel optimized** - Werkt perfect op smartphone
✅ **Geen confetti** - Schone, professionele interface
✅ **Credit** - "Concept & Idee: Inge De Grom" in footer

## 🔧 Lokaal testen (optioneel)

```bash
# Dependencies installeren
pnpm install

# Development server starten
pnpm dev

# Open http://localhost:5173 in je browser
```

## 📱 Features

### Voor begeleiders:
- **Draai het wiel** om willekeurige vragen te selecteren
- **Klik op "Duiding"** om te zien waarom een vraag gesteld wordt
- **Markeer als besproken** om voortgang bij te houden
- **Sla over** om naar volgende vraag te gaan
- **Timer** voor gestructureerde gesprekken

### Vraagcategorieën:
- 🟢 **Makkelijk** (ijsbrekers) - Zelfpresentatie, motivatie, sterktes
- 🟠 **Gemiddeld** (zelfreflectie) - Werkstijl, feedback, uitdagingen
- 🔴 **Moeilijk** (dilemma's) - Grenzen, conflicten, persoonlijke groei

## 🎨 Ontwerp

- **Kleur**: GTB paars (#3a2268) met accent rood
- **Typografie**: Space Grotesk (modern, geometrisch)
- **Layout**: Split-screen op desktop, stacked op mobiel
- **Responsive**: Werkt op alle schermformaten

## 📞 Support

### Vragen over deployment?
Zie `CLOUDFLARE_DEPLOYMENT.md` voor gedetailleerde instructies

### Vragen over de app?
- Concept & Idee: Inge De Grom
- GTB: https://www.gtb.be

## 🔐 Privacy & Data

- ✅ Geen data wordt opgeslagen op servers
- ✅ Sessiegegevens worden alleen lokaal opgeslagen (browser)
- ✅ Geen tracking of analytics
- ✅ Volledig GDPR compliant

## 📝 Licentie

Concept & Idee: Inge De Grom
GTB - Gespecialiseerde Trajectbegeleiding

---

**Veel succes met de GTB Vragenrad!** 🎯
