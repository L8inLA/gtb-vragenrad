# GTB Vragenrad - Deployment via GitHub naar Cloudflare Pages

## 📋 Stap 1: Code naar GitHub pushen

### 1.1 Open Terminal/Command Prompt
```bash
cd /pad/naar/gtb-rad
```

### 1.2 Initialiseer Git repository
```bash
git init
git add .
git commit -m "GTB Vragenrad - Initial commit"
git branch -M main
```

### 1.3 Maak een nieuwe repository op GitHub
1. Ga naar https://github.com/new
2. Vul in:
   - **Repository name:** `gtb-vragenrad` (of naar keuze)
   - **Description:** "GTB Vragenrad - Interview preparation wheel"
   - **Public** (zodat Cloudflare het kan zien)
3. Klik "Create repository"

### 1.4 Push je code naar GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/gtb-vragenrad.git
git push -u origin main
```

Vervang `YOUR_USERNAME` met je GitHub username.

---

## 🚀 Stap 2: Cloudflare Pages Koppelen

### 2.1 Log in op Cloudflare Dashboard
1. Ga naar https://dash.cloudflare.com
2. Log in met je account
3. Je ziet je "gtbrad" Pages project

### 2.2 Koppel je GitHub repository
1. Klik op je **"gtbrad"** project
2. Ga naar **"Settings"** (tandwiel icoon)
3. Klik op **"Build & deployments"**
4. Onder "Source", klik **"Connect a repository"**
5. Selecteer **GitHub**
6. Autoriseer Cloudflare (je wordt doorgestuurd naar GitHub)
7. Selecteer je **`gtb-vragenrad`** repository
8. Klik **"Begin setup"**

### 2.3 Configureer Build Settings
Zorg dat deze instellingen correct zijn:

| Setting | Waarde |
|---------|--------|
| **Production branch** | `main` |
| **Build command** | `pnpm build` |
| **Build output directory** | `dist/public` |
| **Node.js version** | 18 (standaard is prima) |

**Geen environment variables nodig voor deze app!**

### 2.4 Deploy!
1. Klik **"Save and Deploy"**
2. Wacht 2-5 minuten terwijl Cloudflare bouwt en deployt
3. Je ziet een groen vinkje als het klaar is

---

## ✅ Stap 3: Controleer je deployment

1. Ga naar je Cloudflare Pages project
2. Je ziet je deployment URL: `https://gtbrad.pages.dev`
3. Klik erop en test:
   - ✓ Draai het wiel
   - ✓ Controleer of vragen verschijnen
   - ✓ Test de timer
   - ✓ Controleer de "Duiding" knop

---

## 🔄 Stap 4: Automatische Updates (Voortaan)

Nu je GitHub gekoppeld hebt, gebeurt dit automatisch:

```bash
# Maak wijzigingen in je code
# Commit en push naar GitHub:
git add .
git commit -m "Beschrijving van wijzigingen"
git push origin main
```

**Cloudflare ziet automatisch dat je code gewijzigd is en deployt opnieuw!** 🎉

---

## 🆘 Troubleshooting

### Build mislukt?
1. Controleer de build logs in Cloudflare Dashboard
2. Zorg dat `pnpm build` lokaal werkt:
   ```bash
   cd gtb-rad
   pnpm install
   pnpm build
   ```
3. Controleer dat `dist/public` bestaat na build

### App werkt niet na deployment?
1. Open je browser console (F12)
2. Controleer op errors
3. Controleer dat alle assets geladen zijn
4. Probeer cache leeg te maken (Ctrl+Shift+Delete)

### Fout: "Build output directory not found"?
- Zorg dat je `dist/public` hebt ingesteld (niet `dist`)
- Run `pnpm build` lokaal en check dat `dist/public/index.html` bestaat

### Fout: "Repository not found"?
- Controleer dat je GitHub token geldig is
- Ga naar Cloudflare Settings → Integrations → GitHub
- Disconnect en reconnect GitHub

---

## 📊 Monitoring & Analytics

In Cloudflare Pages kun je zien:
- **Deployments**: Alle eerdere deployments
- **Analytics**: Hoeveel bezoekers je hebt
- **Custom domain**: Als je later een eigen domein wilt

---

## 🎯 Samenvatting

| Stap | Wat | Waar |
|------|-----|------|
| 1 | Push code naar GitHub | `git push origin main` |
| 2 | Koppel GitHub aan Cloudflare | Cloudflare Dashboard |
| 3 | Configureer build settings | Build command: `pnpm build` |
| 4 | Deploy | Cloudflare deployt automatisch |
| 5 | Test | Bezoek `https://gtbrad.pages.dev` |

---

## 💡 Tips

- **Automatische deployments**: Elke push naar `main` triggert een nieuwe build
- **Preview deployments**: Als je een pull request maakt, maakt Cloudflare een preview
- **Rollback**: Je kunt altijd naar een vorige deployment gaan in Cloudflare Dashboard
- **Custom domain**: Voeg later je eigen domein toe in Cloudflare

---

**Veel succes! 🚀**

Voor vragen: Zie de Cloudflare Pages docs op https://developers.cloudflare.com/pages/
