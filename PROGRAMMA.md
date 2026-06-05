# Programma di implementazione

## Completato

- [x] Migrazione server → Firebase Admin SDK (`src/lib/server-db.ts`)
- [x] Firestore rules senza bypass `request.auth == null`
- [x] Auth con session cookie Firebase + dev bypass opt-in
- [x] Landing pubblica con `BlockRenderer` (blocchi del page builder)
- [x] Edit progetto (`/admin/projects/[id]/edit` → editor con `?edit=`)
- [x] Dashboard mock rimossa → redirect a `/admin/campaigns`
- [x] Analytics mock → redirect a campagne
- [x] Lead count reale, ricerca progetti, export CSV
- [x] Dettaglio lead `/admin/leads/[id]`
- [x] Webhook Meta: token da env
- [x] README, `.env.example`, test base, CI

## Da configurare manualmente

- [ ] Creare utenti in Firebase Auth per ogni membro del team
- [ ] Deploy regole Firestore: `firebase deploy --only firestore:rules`
- [ ] Indici Firestore per query composite (`tenantId` + `createdAt`)
- [ ] `META_APP_ID`, `META_APP_SECRET`, `META_WEBHOOK_VERIFY_TOKEN`
- [ ] Service account Firebase Admin in produzione (`FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`)

## Prossimi incrementi (opzionali)

- [ ] AI: qualificazione lead, suggerimenti copy ads
- [ ] Meta Marketing API: spesa e CPL reali
- [ ] Sync Google Calendar per appuntamenti
- [ ] `next/image` su tutte le landing
- [ ] Pipeline drag-and-drop stati lead
