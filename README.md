# RealEastate (ZeroAgenzia)

Piattaforma CRM immobiliare con landing page builder, integrazione Meta Lead Ads, appuntamenti e AI Gemini.

## Requisiti

- Node.js 20+
- Progetto Firebase (`firebase-applet-config.json` o variabili `NEXT_PUBLIC_FIREBASE_*`)
- Chiave Gemini per traduzione AI

## Setup locale

```bash
npm install
cp .env.example .env.local
# Compila GEMINI_API_KEY, Firebase Admin (opzionale in dev), Meta (opzionale)
npm run dev
```

Apri http://localhost:3000

### Dev bypass (solo locale)

In `.env.local`:

```
ALLOW_DEV_AUTH_BYPASS=true
NEXT_PUBLIC_ALLOW_DEV_AUTH_BYPASS=true
```

Poi usa il pulsante "Dev: accesso rapido" nella pagina login.

### Login produzione

Usa **Firebase Authentication** (email/password). Gli utenti devono esistere in Auth e nel documento Firestore `users/{uid}` con `tenantId` e `role`.

## Script

| Comando | Descrizione |
|---------|-------------|
| `npm run dev` | Server di sviluppo (porta 3000) |
| `npm run build` | Build produzione |
| `npm run start` | Avvio produzione |
| `npm run lint` | ESLint |
| `npm test` | Test unitari (Vitest) |

## Deploy Hostinger

Usa `server.js` dopo `npm run build`. Assicurati che la cartella `.next` sia presente sul server.

## Documentazione

- `PROGRAMMA.md` — piano di implementazione e stato
- `ROADMAP.md` — roadmap prodotto
- `DESIGN.md` — design system
