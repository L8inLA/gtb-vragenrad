# GTB Vragenrad - Cloudflare Pages Deployment Guide

## Overzicht
Dit document beschrijft hoe je de GTB Vragenrad naar Cloudflare Pages deployt.

## Stap 1: Voorbereiding

### Wat je nodig hebt:
- Een Cloudflare account (gratis op https://dash.cloudflare.com)
- De GitHub repository met de GTB Vragenrad code
- Git geïnstalleerd op je computer (optioneel, maar aanbevolen)

## Stap 2: Code voorbereiding

### Optie A: Via GitHub (Aanbevolen)

1. **Push code naar GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial GTB Vragenrad commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/gtb-vragenrad.git
   git push -u origin main
   ```

2. **Zorg dat je `.gitignore` deze bestanden bevat:**
   ```
   node_modules/
   dist/
   .env
   .env.local
   *.log
   ```

### Optie B: Direct uploaden (Minder aanbevolen)

Je kunt ook direct een ZIP-bestand uploaden naar Cloudflare Pages.

## Stap 3: Cloudflare Pages Setup

### 1. Log in op Cloudflare Dashboard
- Ga naar https://dash.cloudflare.com
- Log in met je account

### 2. Navigeer naar Pages
- Klik op **"Pages"** in het linker menu
- Klik op **"Create a project"**

### 3. Verbind je repository
- Selecteer **"Connect to Git"**
- Kies **GitHub** en autoriseer Cloudflare
- Selecteer je repository met de GTB Vragenrad code
- Klik **"Begin setup"**

### 4. Build Settings Configureren

**Project name:** `gtb-vragenrad` (of je voorkeur)

**Production branch:** `main`

**Build command:**
```
pnpm build
```

**Build output directory:**
```
dist/public
```

**Environment variables:** (Niet nodig voor deze static app)

### 5. Deploy

- Klik **"Save and Deploy"**
- Cloudflare zal nu je project bouwen en deployen
- Dit duurt meestal 2-5 minuten

## Stap 4: Controleer je deployment

1. Na deployment zie je een URL: `https://gtb-vragenrad.pages.dev`
2. Test de app:
   - Draai het wiel
   - Controleer of vragen verschijnen
   - Test de timer
   - Controleer de "Duiding" knop (voor vragen met guidance)

## Stap 5: Custom Domain (Optioneel)

Als je een eigen domein hebt (bijv. `gtbrad.nl`):

1. Ga naar je project in Cloudflare Pages
2. Klik op **"Custom domains"**
3. Voeg je domein toe
4. Volg de instructies voor DNS-configuratie

## Stap 6: Automatische Updates

Vanaf nu zal Cloudflare automatisch deployen wanneer je code naar GitHub pusht:

```bash
# Na wijzigingen in je code:
git add .
git commit -m "Beschrijving van wijzigingen"
git push origin main
```

Cloudflare zal automatisch detecteren dat er nieuwe code is en opnieuw deployen.

## Troubleshooting

### Build mislukt
- Controleer of `pnpm build` lokaal werkt: `cd project && pnpm build`
- Zorg dat `package.json` correct is
- Check de build logs in Cloudflare Dashboard

### App werkt niet na deployment
- Controleer of `dist/public` de juiste bestanden bevat
- Zorg dat de build output directory correct is ingesteld
- Controleer browser console op errors (F12)

### Langzame performance
- Cloudflare Pages is zeer snel, maar controleer:
  - Browser cache (Ctrl+Shift+Delete)
  - Network tab in DevTools
  - Cloudflare Analytics

## Verdere optimalisaties

### Caching
Cloudflare Pages cached automatisch:
- HTML: 30 minuten
- CSS/JS/Images: 1 jaar (met versioning)

### Monitoring
- Ga naar je project in Cloudflare Pages
- Klik op **"Analytics"** om traffic te zien
- Controleer **"Deployments"** voor deployment history

## Ondersteuning

Voor vragen over Cloudflare Pages:
- Cloudflare Docs: https://developers.cloudflare.com/pages/
- Cloudflare Community: https://community.cloudflare.com/

Voor vragen over GTB Vragenrad:
- Concept & Idee: Inge De Grom
- GTB: https://www.gtb.be

---

**Succes met je deployment!** 🚀
