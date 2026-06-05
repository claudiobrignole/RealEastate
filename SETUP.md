# Setup ZeroAgenzia — guida passo passo

Tutte le credenziali vanno nel file **`.env.local`** nella root del progetto:

```
/Users/claudio2/Projects/RealEastate/.env.local
```

Dopo ogni modifica a `.env.local`, riavvia il server:

```bash
cd /Users/claudio2/Projects/RealEastate
npm run dev
```

Apri sempre: **http://127.0.0.1:3000/login** (non `localhost`, per evitare problemi IPv6).

---

## 1. Firebase Admin (obbligatorio per login e CRM)

Senza queste credenziali il dev bypass e le pagine admin non funzionano.

### Dove trovarle

1. Vai su [Firebase Console](https://console.firebase.google.com/)
2. Progetto: **crafty-centaur-447409-g7**
3. ⚙️ Impostazioni progetto → **Account di servizio**
4. Clicca **Genera nuova chiave privata** → scarica il file JSON

### Cosa copiare in `.env.local`

Dal file JSON scaricato:

```env
FIREBASE_PROJECT_ID="crafty-centaur-447409-g7"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@crafty-centaur-447409-g7.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
```

> La `FIREBASE_PRIVATE_KEY` deve stare tra virgolette e usare `\n` al posto degli a capo.

---

## 2. Creare un utente (login normale)

Serve **due posti**: Firebase Auth + Firestore.

### A) Firebase Authentication

1. Console Firebase → **Authentication** → **Users**
2. **Add user** → email + password (es. `claudio.brignole@exmachina.ch`)

Copia l’**UID** dell’utente creato (es. `abc123xyz`).

### B) Documento profilo in Firestore

1. Console Firebase → **Firestore Database**
2. Database: `ai-studio-92fae3cd-76fd-4651-9d5c-41676394937b`
3. Collection **`users`** → **Add document**
4. Document ID = **lo stesso UID** di Firebase Auth

Campi:

```json
{
  "uid": "abc123xyz",
  "email": "claudio.brignole@exmachina.ch",
  "name": "Claudio Brignole",
  "role": "super_admin",
  "tenantId": "dev-super-admin-uid",
  "createdAt": "2026-06-05T00:00:00.000Z"
}
```

### C) Tenant (se non esiste)

Collection **`tenants`**, document ID `dev-super-admin-uid`:

```json
{
  "id": "dev-super-admin-uid",
  "name": "ZeroAgenzia Casa HQ",
  "plan": "pro",
  "maxUsers": 99,
  "currentUserCount": 1
}
```

Poi accedi con email + password dalla pagina login.

---

## 3. Deploy regole Firestore

### Prerequisito

```bash
npm install -g firebase-tools
firebase login
```

### Deploy

```bash
cd /Users/claudio2/Projects/RealEastate
firebase deploy --only firestore:rules --project crafty-centaur-447409-g7
```

Le regole sono nel file `firestore.rules` del progetto.

---

## 4. Meta (Facebook Lead Ads) — opzionale

In `.env.local`:

```env
META_APP_ID="il-tuo-app-id"
META_APP_SECRET="il-tuo-app-secret"
META_WEBHOOK_VERIFY_TOKEN="una-stringa-segreta-a-tua-scelta"
```

### Dove trovarle

1. [Meta for Developers](https://developers.facebook.com/) → la tua App
2. **Impostazioni** → **Base** → App ID e App Secret
3. `META_WEBHOOK_VERIFY_TOKEN`: la inventi tu; la stessa stringa va inserita nella configurazione webhook Meta

URL callback OAuth: `http://localhost:3000/api/meta/callback` (in produzione usa il dominio reale).

URL webhook: `https://tuodominio.com/api/webhooks/meta`

---

## 5. Gemini AI — opzionale

```env
GEMINI_API_KEY="la-tua-chiave"
```

Da [Google AI Studio](https://aistudio.google.com/apikey).

---

## 6. Dev bypass (solo locale)

Già attivo in `.env.local`:

```env
ALLOW_DEV_AUTH_BYPASS=true
NEXT_PUBLIC_ALLOW_DEV_AUTH_BYPASS=true
```

Pulsante **"Dev: accesso rapido"** sulla pagina login — funziona anche senza utente Firebase Auth, ma per usare lead/progetti serve comunque Firebase Admin (punto 1).

---

## Checklist rapida

- [ ] `.env.local` con `FIREBASE_CLIENT_EMAIL` + `FIREBASE_PRIVATE_KEY`
- [ ] Server avviato: `npm run dev`
- [ ] Browser su `http://127.0.0.1:3000/login`
- [ ] Dev bypass o login Firebase Auth
- [ ] Regole Firestore deployate
- [ ] (Opzionale) Meta e Gemini configurati
