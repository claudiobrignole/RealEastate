# ROADMAP

## Stato Attuale
- **Fase 1-4 completate**: Setup progetto Next.js, integrazione Firebase (struttura iniziale), Layout Admin con menu laterale e topbar, Routing base implementato per le pagine principali della dashboard.
- **Fase 5: Landing Builder**: Interfaccia di base dell'editor con Tiptap e Modale.
- **Fase 6: Motore Temi Dinamici e Integrazione Firestore**: Completata. I temi landing sono ora resi dinamicamente come React Components, collegati a dovere in un ambiente Live Preview real-time affiancato al form. I dati vengono salvati con Firebase Admin (createProject server action).

## Prossimi Obiettivi
- **Fase 7: Form & Lead Flow (Completata)**: Moduli Form della Landing salvano su Firestore e vengono letti nel CRM Lead tramite logica CollectionGroup e Actions Server.
- **Fase 8 (In Pausa): AI Assistita**: L'integrazione con Gemini (traduzione automatica/riscrittura AI) è temporaneamente in pausa a causa di problemi con la API key.
  > **Nota/Promemoria:** Riattivare e configurare l'SDK `@google/genai` quando verranno fornite credenziali Gemini valide (API key non soggetta a free-tier limit oppure configurata correttamente sul progetto di billing).

## Task Completati (Recenti)
- [x] Interfaccia Base "Nuovo Progetto" con tab multilingua.
- [x] Setup Editor Multilingua (Tiptap).
- [x] Implementazione dei 4 Temi in React components scalabili in `src/components/themes`.
- [x] Split Layout nell'Editor per includere e renderizzare la componente tematica dinamicamente come Live Preview in scala.
- [x] Integrazione reale per l'action lato server `createProject` su Firestore per salvare l'oggetto multilingua del progetto, collegato al pulsante Save.
- [x] Creazione rotta dinamica pubblica `/p/[projectId]` (o `/[projectId]`) collegata al database per visualizzare le landing con i temi effettivi e selezione della lingua.
- [x] CRM Leads View aggiornata alla rotta `/admin/leads` con lettura reale su Firebase.
- [x] Lead Capture Form (`LeadForm.tsx`) agganciata in tutti i temi, con salvataggio tramite server action.

## Prossimi Step
- Gestione immagini/gallery reali con Cloud Storage.
- Refine dei filtri nella pagina CRM.
