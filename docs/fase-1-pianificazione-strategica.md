# FASE 1 — Pianificazione strategica

Documento finale di pianificazione per i 17 package critici usati da `examples/hobiri-corporate`.

Scope confermato:

- solo i 17 package in produzione/uso diretto da `hobiri-corporate`
- `customer` è escluso dal track operativo e gestito come caso speciale
- `validation` è escluso dal track operativo e richiede un processo 9-step dedicato
- `simple` e `hobox` restano fuori scope in questa fase
- `xxx` viene ignorato

Le evidenze sotto derivano dai file reali letti nel repository:

- `packages/*/package.json`
- `packages/*/src/index.ts`
- `packages/*/src/error/*`
- `packages/*/src/**/__tests__/*`
- `packages/*/README.md`
- `packages/*/docs/*`
- `docs/standards/*`

## FASE 2 Boundary Rule

La FASE 2 non modifica:

- package type classification
- dependency direction
- public API
- exported contracts
- package ownership

Eventuali discrepanze architetturali emerse durante la documentazione vengono registrate come ADR o task FASE 3.

## Documentation Depth Rule

Il workflow completo di pianificazione Comity

- `SKILL.md`
- `DESIGN.md`
- `API.md`
- `PACKAGE-DESIGN.md`
- `IMPLEMENTATION-PLAN.md`

è richiesto solo quando un package:

- introduce nuovi confini architetturali
- introduce nuovi contratti pubblici
- cambia ownership di concetti di dominio
- cambia la direzione delle dipendenze
- richiede decisioni architetturali

I package di produzione già esistenti, senza cambi architetturali, vengono documentati attraverso:

- `README.md`
- `docs/overview.md`
- `docs/conventions.md`
- `docs/architecture.md` quando richiesto

Per la tabella seguente:

- `Ha context?` significa che il package espone un tipo/contratto di contesto pubblico o di setup esplicito.
- `Ha error/?` significa che nel package esiste un modulo `src/error/` o un contratto d’errore equivalente.
- `Deve avere error/?` è deciso solo dalla combinazione tra ruolo del package e ciò che il codice mostra già.

## 1. Matrice di allineamento per i 17 package critici

| Package | Tipo | Ha error/? | Deve avere error/? | Ha context? | README | SKILL | docs/ | Priorità | Code changes allowed | Azioni necessarie | Evidenze |
|---|---|---:|---:|---:|---:|---:|---:|---|---|---|---|
| `primitives` | Core | Sì | Sì | No | Sì | No | Sì | Alta | No | Documentazione: aggiornare `README.md` per rimuovere il riferimento obsoleto a `@comity/html-runtime`; il resto del package è già allineato per questa fase. | `packages/primitives/src/index.ts`, `packages/primitives/src/error/base.ts`, `packages/primitives/README.md`, `packages/primitives/docs/*` |
| `composition` | Core | Sì | Sì | Sì | Sì | No | Sì | Alta | No | Nessuna nel package; mantenere il profilo corrente. | `packages/composition/src/index.ts`, `packages/composition/src/error/composition.ts`, `packages/composition/README.md`, `packages/composition/docs/*` |
| `kernel` | Core | Sì | Sì | Sì | Sì | No | Sì | Alta | No | Nessuna nel package; mantenere il profilo corrente. | `packages/kernel/src/index.ts`, `packages/kernel/src/error/kernel.ts`, `packages/kernel/README.md`, `packages/kernel/docs/*` |
| `http` | Core | Sì | Sì | Sì | Sì | No | Sì | Alta | No | Nessuna nel package; mantenere il profilo corrente. | `packages/http/src/index.ts`, `packages/http/src/error/http.ts`, `packages/http/README.md`, `packages/http/docs/*` |
| `http-hono` | Adapter | No | No | Sì | Sì | No | Sì | Alta | No | Nessuna nel package; non introdurre un `src/error/` proprio. | `packages/http-hono/src/index.ts`, `packages/http-hono/src/internal/map-error.ts`, `packages/http-hono/README.md`, `packages/http-hono/docs/*` |
| `html` | Core | Sì | Sì | No | Sì | No | No | Alta | No | Documentazione: creare `docs/overview.md`, `docs/conventions.md`, `docs/architecture.md`. | `packages/html/src/index.ts`, `packages/html/src/error/html.ts`, `packages/html/README.md` |
| `html-preact` | Adapter | No | No | No | Sì | No | No | Alta | No | Documentazione: creare `README.md` solo se serve riallineare il testo pubblico; altrimenti creare `docs/overview.md`, `docs/conventions.md`, `docs/architecture.md`. | `packages/html-preact/src/index.ts`, `packages/html-preact/src/static/renderer.tsx`, `packages/html-preact/README.md` |
| `hydration` | Core | Sì | Sì | No | Sì | No | No | Alta | No | Documentazione: creare `docs/overview.md`, `docs/conventions.md`, `docs/architecture.md`. | `packages/hydration/src/index.ts`, `packages/hydration/src/error/hydration.ts`, `packages/hydration/README.md` |
| `hydration-preact` | Adapter | No | No | No | No | No | No | Alta | No | Documentazione: creare `README.md`, `docs/overview.md`, `docs/conventions.md`; `docs/architecture.md` solo se serve esplicitare la separazione `components/` / `runtime/` / `internal/`. | `packages/hydration-preact/src/index.ts`, `packages/hydration-preact/src/internal/hydrator.ts` |
| `cache` | Core | Sì | Sì | Sì | No | No | No | Alta | No | Documentazione: creare `README.md`, `docs/overview.md`, `docs/conventions.md`, `docs/architecture.md`. | `packages/cache/src/index.ts`, `packages/cache/src/error/cache.ts`, `packages/cache/src/setup/types.ts` |
| `content` | Core | No | No | Sì | No | No | No | Alta | No | Documentazione: creare `README.md`, `docs/overview.md`, `docs/conventions.md`. | `packages/content/src/index.ts`, `packages/content/src/contracts/repository-context.ts` |
| `media` | Utility | No | No | No | No | No | No | Alta | No | Documentazione: creare `README.md`, `docs/overview.md`, `docs/conventions.md`. | `packages/media/src/index.ts`, `packages/media/src/contracts/media.ts` |
| `router` | Core | No | No | Sì | No | No | No | Alta | No | Documentazione: creare `README.md`, `docs/overview.md`, `docs/conventions.md`, `docs/architecture.md`. | `packages/router/src/index.ts`, `packages/router/src/contracts/router.ts`, `packages/router/src/contracts/url-rewriter.ts` |
| `router-path-to-regexp` | Adapter | No | No | No | No | No | No | Alta | No | Documentazione: creare `README.md`, `docs/overview.md`, `docs/conventions.md`. | `packages/router-path-to-regexp/src/index.ts`, `packages/router-path-to-regexp/src/router.ts` |
| `graphql-builder` | Utility | No | No | No | No | No | No | Alta | No | Documentazione: creare `README.md`, `docs/overview.md`, `docs/conventions.md`. | `packages/graphql-builder/src/index.ts`, `packages/graphql-builder/src/builder.ts`, `packages/graphql-builder/src/serializers/*` |
| `graphql-client` | Core | Sì | Sì | Sì | No | No | No | Alta | No | Documentazione: creare `README.md`, `docs/overview.md`, `docs/conventions.md`, `docs/architecture.md`. | `packages/graphql-client/src/index.ts`, `packages/graphql-client/src/error/graphql.ts`, `packages/graphql-client/src/setup/types.ts` |
| `graphql-client-ws` | Adapter | No | No | No | No | No | No | Alta | No | Documentazione: creare `README.md`, `docs/overview.md`, `docs/conventions.md`. | `packages/graphql-client-ws/src/index.ts`, `packages/graphql-client-ws/src/ws-transport.ts` |

## 2. Ordine di intervento

### Documentation approach for the 17 packages

| Package | Approach |
|---|---|
| `primitives` | docs only |
| `composition` | docs only |
| `kernel` | docs only |
| `http` | docs only |
| `http-hono` | docs only |
| `html` | docs + possible architecture |
| `hydration` | docs + possible architecture |
| `router` | docs + possible architecture |
| `graphql-client` | docs + possible architecture |
| `cache` | docs + possible architecture |
| `content` | docs only initial |
| `media` | docs only |
| `html-preact` | docs only |
| `hydration-preact` | docs only |
| `router-path-to-regexp` | docs only |
| `graphql-builder` | docs only |
| `graphql-client-ws` | docs only |

Interpretazione operativa:

- `docs only` significa: `README.md` + `docs/overview.md` + `docs/conventions.md`, senza attivare il workflow completo
- `docs + possible architecture` significa: gli stessi documenti di base, con `docs/architecture.md` solo se serve a descrivere davvero l’assetto interno del package
- il workflow completo (`SKILL.md`, `DESIGN.md`, `API.md`, `PACKAGE-DESIGN.md`, `IMPLEMENTATION-PLAN.md`) resta riservato ai package nuovi o con cambi architetturali

### Batch 1 — package già allineati, con sola rifinitura documentale

Ordine consigliato:

1. `primitives`
2. `composition`
3. `kernel`
4. `http`
5. `http-hono`

Motivo:

- sono i package più centrali nella catena di dipendenze
- hanno già una base documentale presente
- il rischio è minimo perché la FASE 2 è solo documentazione

Nota:

- `primitives` richiede comunque una micro-correzione alla documentazione pubblica (`README.md`) per eliminare il riferimento a `@comity/html-runtime`.

### Batch 2 — package stabili con documentazione mancante

Ordine consigliato:

1. `cache`
2. `html`
3. `hydration`
4. `router`
5. `graphql-client`
6. `content`

Motivo:

- sono package core o quasi-core già usati da `hobiri-corporate`
- il codice è stabile per quanto osservato
- manca il livello minimo di landing page + docs di base

### Batch 3 — package sottili o adapter-shaped da documentare come eccezioni tecniche

Ordine consigliato:

1. `html-preact`
2. `hydration-preact`
3. `media`
4. `router-path-to-regexp`
5. `graphql-builder`
6. `graphql-client-ws`

Motivo:

- questi package sono più sottili o più specializzati
- non vanno trattati come core completi
- la FASE 2 deve documentarli senza forzarli in una forma più pesante del necessario

Nota operativa:

- eventuali normalizzazioni di struttura interna non vanno eseguite in questa fase
- se emergeranno, saranno pianificate in FASE 3

### Batch 4 — track separati, fuori dal lotto dei 17 package

Non fanno parte dell’esecuzione della FASE 2 sui 17 package critici, ma vanno tenuti esplicitamente fuori dal piano principale:

- `packages/customer` → solo documentazione; ADR per `address`; nessuna modifica al codice
- `packages/validation` → processo completo a 9 step, con pianificazione separata
- `examples/hobiri-corporate` → unico esempio rilevante in questa fase

## 3. Piano file-per-file per la FASE 2

### `packages/primitives`

- `README.md`: aggiornare il blocco `Related Packages` per rimuovere `@comity/html-runtime`
- `docs/*`: nessuna creazione richiesta in questa fase
- `src/*`: nessuna modifica

### `packages/composition`

- `README.md`: nessuna modifica prevista
- `docs/*`: nessuna modifica prevista
- `src/*`: nessuna modifica

### `packages/kernel`

- `README.md`: nessuna modifica prevista
- `docs/*`: nessuna modifica prevista
- `src/*`: nessuna modifica

### `packages/http`

- `README.md`: nessuna modifica prevista
- `docs/*`: nessuna modifica prevista
- `src/*`: nessuna modifica

### `packages/http-hono`

- `README.md`: nessuna modifica prevista
- `docs/*`: nessuna modifica prevista
- `src/*`: nessuna modifica

### `packages/html`

- `README.md`: nessuna modifica prevista, salvo eventuale riallineamento descrittivo al codice reale
- `docs/overview.md`: creare
- `docs/conventions.md`: creare
- `docs/architecture.md`: creare
- `src/*`: nessuna modifica

### `packages/html-preact`

- `README.md`: verificare e aggiornare solo se il testo pubblico non riflette più il codice reale
- `docs/overview.md`: creare
- `docs/conventions.md`: creare
- `docs/architecture.md`: creare se serve esplicitare il doppio ramo `static/` e `streaming/`
- `src/*`: nessuna modifica

### `packages/hydration`

- `README.md`: nessuna modifica prevista, salvo eventuale riallineamento descrittivo al codice reale
- `docs/overview.md`: creare
- `docs/conventions.md`: creare
- `docs/architecture.md`: creare
- `src/*`: nessuna modifica

### `packages/hydration-preact`

- `README.md`: creare
- `docs/overview.md`: creare
- `docs/conventions.md`: creare
- `docs/architecture.md`: creare solo se serve rendere esplicita la separazione tra `components/`, `runtime/` e `internal/`
- `src/*`: nessuna modifica

### `packages/cache`

- `README.md`: creare
- `docs/overview.md`: creare
- `docs/conventions.md`: creare
- `docs/architecture.md`: creare
- `src/*`: nessuna modifica

### `packages/content`

- `README.md`: creare
- `docs/overview.md`: creare
- `docs/conventions.md`: creare
- `docs/architecture.md`: opzionale; creare solo se serve descrivere l’uso di `contracts/` e `setup/`
- `src/*`: nessuna modifica

### `packages/media`

- `README.md`: creare
- `docs/overview.md`: creare
- `docs/conventions.md`: creare
- `docs/architecture.md`: non necessaria in questa fase
- `src/*`: nessuna modifica

### `packages/router`

- `README.md`: creare
- `docs/overview.md`: creare
- `docs/conventions.md`: creare
- `docs/architecture.md`: creare
- `src/*`: nessuna modifica

### `packages/router-path-to-regexp`

- `README.md`: creare
- `docs/overview.md`: creare
- `docs/conventions.md`: creare
- `docs/architecture.md`: non necessaria in questa fase
- `src/*`: nessuna modifica

### `packages/graphql-builder`

- `README.md`: creare
- `docs/overview.md`: creare
- `docs/conventions.md`: creare
- `docs/architecture.md`: opzionale; creare solo se serve descrivere `contracts/`, `internal/` e `serializers/`
- `src/*`: nessuna modifica

### `packages/graphql-client`

- `README.md`: creare
- `docs/overview.md`: creare
- `docs/conventions.md`: creare
- `docs/architecture.md`: creare
- `src/*`: nessuna modifica

### `packages/graphql-client-ws`

- `README.md`: creare
- `docs/overview.md`: creare
- `docs/conventions.md`: creare
- `docs/architecture.md`: non necessaria in questa fase
- `src/*`: nessuna modifica

## 4. Aggiornamenti alla documentazione generale

### File da aggiornare sicuramente

- `docs/standards/adapters.md`
  - rimuovere i riferimenti a `@comity/http-fetch`
  - rimuovere i riferimenti a `@comity/runtime-node`

- `docs/standards/modules.md`
  - rimuovere `@comity/example`
  - lasciare un esempio che usi un package reale del workspace, oppure rimuovere l’esempio se non serve più

- `packages/primitives/README.md`
  - rimuovere `@comity/html-runtime` dai related packages

### File da verificare, ma senza drift confermato nell’analisi

- `docs/standards/documentation.md`
- `docs/standards/public-api.md`
- `docs/standards/dependency-graph-policy.md`
- `docs/standards/layering-policy.md`
- `docs/standards/architecture-principles.md`

## 5. Casi speciali

### `packages/customer`

Stato confermato:

- il package è intenzionalmente doc-first
- la documentazione esiste già
- il codice non va toccato in questa fase
- va pianificato un ADR sull’ownership e sulla composizione del concetto `address`

Decisione operativa:

- mantenere tutta la documentazione già scritta
- non introdurre refactor sul codice
- trattarlo come track separato, non come parte dei 17 package critici
- pianificare un ADR su ownership e composizione del concetto `address`
- l’ADR deve chiarire se `Address` è un concetto condiviso, se `CustomerAddressBook` appartiene a `Customer`, e come modellare gli address di order/company

### `packages/validation`

Stato confermato:

- è un nuovo modulo
- richiede il giro completo di pianificazione
- non va trattato come allineamento documentale “leggero”

Decisione operativa:

- creare un piano separato dedicato al processo 9-step
- non mischiarlo con il track dei 17 package critici
- non introdurre `validation` come nuova dipendenza di alcun package durante la FASE 2
- lasciare invariato ogni uso esistente di validation fino all’approvazione del processo dedicato

### Esempi applicativi

Decisione confermata:

- solo `examples/hobiri-corporate` è rilevante per questa fase
- `simple`, `hobox` e `xxx` restano fuori scope del piano corrente

## FASE 2 Output

Al termine della FASE 2 devono esistere:

- package documentation inventory
- updated documentation tree
- list of discovered architectural gaps
- ADR candidates generated durante la documentazione
- FASE 3 backlog

## 6. Stima impatto e rischi

### Tipi di azione previsti

#### Aggiornamento di `docs/standards/*`

- Rischio: Basso
- Effort stimato: 2-4 ore
- Impatto su produzione: Nessuno

#### Aggiornamento di README e docs di package già stabili

- Rischio: Basso
- Effort stimato: 30-90 minuti per package piccolo; 2-4 ore per package più articolato
- Impatto su produzione: Nessuno

#### Creazione di documentazione per package senza README/docs

- Rischio: Basso
- Effort stimato: 1-2 giorni per il blocco dei package più grandi, meno per i package sottili
- Impatto su produzione: Nessuno

#### Correzione della documentazione `primitives/README.md`

- Rischio: Molto basso
- Effort stimato: meno di 30 minuti
- Impatto su produzione: Nessuno

#### Verifica post-FASE 2 del grafo dipendenze e della superficie pubblica

- Rischio: Basso
- Effort stimato: 1-2 ore
- Impatto su produzione: Nessuno

### Rischi specifici da tenere sotto controllo

- introdurre standard più forti del necessario sui package adapter-shaped
- confondere la mancanza di `src/error/` con un difetto, quando il codice mostra un riuso intenzionale degli errori del core
- spostare in FASE 2 correzioni strutturali che vanno invece pianificate per FASE 3

## 7. Metriche di completion

La FASE 2 può considerarsi completata quando queste metriche risultano vere per i 17 package critici:

- 17/17 package hanno documentazione minima adeguata al ruolo architetturale
- i Core Modules hanno `README.md`, `docs/overview.md`, `docs/conventions.md` e `docs/architecture.md` quando previsto dal piano
- gli Adapter hanno `README.md`, `docs/overview.md` e `docs/conventions.md` quando previsto dal piano
- i package utility hanno documentazione proporzionata alla complessità
- 0 package critici richiedono modifiche di codice in FASE 2
- 0 riferimenti obsoleti restano in `docs/standards/adapters.md`
- 0 riferimenti obsoleti restano in `docs/standards/modules.md`
- 0 riferimenti obsoleti restano in `packages/primitives/README.md`
- `customer` è rimasto fuori dal track operativo e ha un’azione separata sull’ADR di `address`
- `validation` ha un piano dedicato approvato separatamente
- `hobiri-corporate` è l’unico esempio considerato in questa fase
- 0 nuove dipendenze runtime introdotte
- 0 cambiamenti al dependency graph
- 0 nuovi export pubblici introdotti

Per la colonna `SKILL`:

- nessuno dei 17 package critici richiede l’aggiunta di un nuovo `SKILL.md` in questa fase
- `SKILL.md` resta un requisito speciale, non un gate universale del track corrente
