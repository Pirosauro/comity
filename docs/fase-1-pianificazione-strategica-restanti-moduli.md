# FASE 1 — Pianificazione strategica (restanti moduli)

Documento di pianificazione per i package in `packages/` non inclusi nel primo blocco già allineato.

Scope confermato:

- tutti i package restanti in `packages/`
- esclusi i 17 package già trattati nella prima baseline documentale
- `customer` resta fuori dal track operativo
- `validation` resta fuori dal track operativo e richiede un processo 9-step separato
- nuovi moduli non entrano in questa pianificazione
- gli esempi non vengono trattati qui

Le evidenze sotto derivano dai file reali letti nel repository:

- `packages/*/package.json`
- `packages/*/src/index.ts`
- `packages/*/README.md`
- `packages/*/docs/*`
- `packages/*/src/**/__tests__/*`

## Boundary Rule

Questa fase non modifica:

- classificazione architetturale già esistente
- direzione delle dipendenze
- public API
- ownership dei concetti
- grafo delle dipendenze

Eventuali discrepanze trovate durante la pianificazione vengono registrate come cleanup tecnico, ADR o follow-up separato.

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
- richiede decisioni architetturali nuove

I package esistenti già in produzione, senza cambi architetturali, vengono documentati attraverso:

- `README.md`
- `docs/overview.md`
- `docs/conventions.md`
- `docs/architecture.md` quando serve davvero

## 1. Matrice di allineamento per i restanti package

| Package | Tipo | README | docs/overview | docs/conventions | docs/architecture | SKILL | Priorità | Code changes allowed | Azioni necessarie | Evidenze |
|---|---|---:|---:|---:|---:|---:|---|---|---|---|
| `application` | Application support | No | No | No | No | No | Media | No | Documentazione base: `README.md`, `docs/overview.md`, `docs/conventions.md`. | `packages/application/package.json`, `packages/application/src/index.ts` |
| `auth` | Core module | Sì | No | No | No | No | Alta | No | Documentazione: completare il set base; `docs/architecture.md` solo se la review mostra una decisione ancora aperta. | `packages/auth/package.json`, `packages/auth/src/index.ts`, `packages/auth/README.md` |
| `auth-jose` | Adapter / integration | Sì | No | No | No | No | Media | No | Documentazione base: `docs/overview.md`, `docs/conventions.md`. | `packages/auth-jose/package.json`, `packages/auth-jose/src/index.ts`, `packages/auth-jose/README.md` |
| `auth-tokens` | Utility / support | No | No | No | No | No | Media | No | Documentazione base: `README.md`, `docs/overview.md`, `docs/conventions.md`. | `packages/auth-tokens/package.json`, `packages/auth-tokens/src/index.ts` |
| `cache-kv` | Adapter | No | No | No | No | No | Alta | No | Documentazione base: `README.md`, `docs/overview.md`, `docs/conventions.md`. | `packages/cache-kv/package.json`, `packages/cache-kv/src/index.ts` |
| `cache-redis` | Adapter | No | No | No | No | No | Alta | No | Documentazione base; verificare se l’assenza di `src/index.ts` è intenzionale o solo un punto di cleanup tecnico da pianificare dopo. | `packages/cache-redis/package.json`, `packages/cache-redis/src/*` |
| `cart` | Utility / domain support | No | No | No | No | No | Media | No | Documentazione base: `README.md`, `docs/overview.md`, `docs/conventions.md`. | `packages/cart/package.json`, `packages/cart/src/index.ts` |
| `catalog` | Core module | No | No | No | No | No | Alta | No | Documentazione base; `docs/architecture.md` solo se la review conferma un boundary da esplicitare. | `packages/catalog/package.json`, `packages/catalog/src/index.ts`, `packages/catalog/src/setup/types.ts` |
| `html-react` | Adapter | Sì | No | No | No | No | Bassa | No | Documentazione minima di allineamento; nessun cambio strutturale. | `packages/html-react/package.json`, `packages/html-react/src/index.ts`, `packages/html-react/README.md` |
| `hydration-react` | Adapter | No | No | No | No | No | Bassa | No | Documentazione base: `README.md`, `docs/overview.md`, `docs/conventions.md`. | `packages/hydration-react/package.json`, `packages/hydration-react/src/index.ts` |
| `i18n` | Core module | No | No | No | No | No | Alta | No | Documentazione base; `docs/architecture.md` solo se serve chiarire il ruolo del resolver / loader. | `packages/i18n/package.json`, `packages/i18n/src/index.ts` |
| `i18n-typesafe` | Adapter / extension | No | No | No | No | No | Media | No | Documentazione base: `README.md`, `docs/overview.md`, `docs/conventions.md`. | `packages/i18n-typesafe/package.json`, `packages/i18n-typesafe/src/index.ts` |
| `search` | Utility | No | No | No | No | No | Media | No | Documentazione base: `README.md`, `docs/overview.md`, `docs/conventions.md`. | `packages/search/package.json`, `packages/search/src/index.ts` |
| `seo` | Utility | No | No | No | No | No | Media | No | Documentazione base: `README.md`, `docs/overview.md`, `docs/conventions.md`. | `packages/seo/package.json`, `packages/seo/src/index.ts` |
| `sql` | Core / boundary module | No | Sì | No | Sì | No | Alta | No | Documentazione di riallineamento; mantenere il profilo attuale senza aprire refactor. | `packages/sql/package.json`, `packages/sql/src/index.ts`, `packages/sql/docs/overview.md`, `packages/sql/docs/architecture.md` |
| `sql-kysely` | Adapter | No | Sì | No | Sì | No | Alta | No | Documentazione di riallineamento; nessun cambio di contratto. | `packages/sql-kysely/package.json`, `packages/sql-kysely/src/index.ts`, `packages/sql-kysely/docs/overview.md`, `packages/sql-kysely/docs/architecture.md` |
| `storage` | Core module | No | No | No | No | No | Alta | No | Documentazione base; `docs/architecture.md` solo se la review mostra una decisione ancora aperta. | `packages/storage/package.json`, `packages/storage/src/index.ts` |
| `storefront` | Core module | No | No | No | No | No | Alta | No | Documentazione base; `docs/architecture.md` solo se serve consolidare il boundary del storefront. | `packages/storefront/package.json`, `packages/storefront/src/index.ts` |
| `storefront-magento` | Adapter | No | No | No | No | No | Alta | No | Documentazione base; verificare la struttura reale perché l’entrypoint non è standard rispetto agli altri package. | `packages/storefront-magento/package.json`, `packages/storefront-magento/src/*` |

## 2. Ordine di intervento

### Batch 1 — package con base documentale già presente o molto vicina al target

1. `sql`
2. `sql-kysely`
3. `auth`
4. `html-react`

Motivo:

- hanno già segnali documentali utili
- il rischio di drift è basso
- sono buoni candidati per allineamento rapido prima dei package più vuoti

### Batch 2 — package stabili ma senza documentazione minima

1. `application`
2. `auth-tokens`
3. `cache-kv`
4. `cart`
5. `catalog`
6. `hydration-react`
7. `i18n`
8. `i18n-typesafe`
9. `search`
10. `seo`
11. `storage`

Motivo:

- codice già presente e leggibile
- manca la baseline documentale minima
- il lavoro è quasi interamente documentale

### Batch 3 — package atipici o più delicati da trattare come eccezioni tecniche

1. `auth-jose`
2. `cache-redis`
3. `storefront`
4. `storefront-magento`

Motivo:

- sono più vicini a integrazioni o composizioni specifiche
- alcune strutture non sono omogenee con il resto del repository
- vanno documentati senza forzare un modello più pesante del necessario

## 3. Piano file-per-file per la FASE 2

### `packages/application`

- `README.md`: creare
- `docs/overview.md`: creare
- `docs/conventions.md`: creare
- `src/*`: nessuna modifica

### `packages/auth`

- `README.md`: aggiornare e allineare al codice reale
- `docs/overview.md`: creare
- `docs/conventions.md`: creare
- `docs/architecture.md`: solo se la review finale conferma un boundary non ancora esplicitato

### `packages/auth-jose`

- `README.md`: mantenere e riallineare se necessario
- `docs/overview.md`: creare
- `docs/conventions.md`: creare
- `src/*`: nessuna modifica

### `packages/auth-tokens`

- `README.md`: creare
- `docs/overview.md`: creare
- `docs/conventions.md`: creare
- `src/*`: nessuna modifica

### `packages/cache-kv`

- `README.md`: creare
- `docs/overview.md`: creare
- `docs/conventions.md`: creare
- `src/*`: nessuna modifica

### `packages/cache-redis`

- `README.md`: creare
- `docs/overview.md`: creare
- `docs/conventions.md`: creare
- `src/*`: nessuna modifica in FASE 2

### `packages/cart`

- `README.md`: creare
- `docs/overview.md`: creare
- `docs/conventions.md`: creare
- `src/*`: nessuna modifica

### `packages/catalog`

- `README.md`: creare
- `docs/overview.md`: creare
- `docs/conventions.md`: creare
- `docs/architecture.md`: solo se la review richiede esplicitare il boundary
- `src/*`: nessuna modifica

### `packages/html-react`

- `README.md`: mantenere e riallineare se necessario
- `docs/overview.md`: creare
- `docs/conventions.md`: creare
- `src/*`: nessuna modifica

### `packages/hydration-react`

- `README.md`: creare
- `docs/overview.md`: creare
- `docs/conventions.md`: creare
- `src/*`: nessuna modifica

### `packages/i18n`

- `README.md`: creare
- `docs/overview.md`: creare
- `docs/conventions.md`: creare
- `docs/architecture.md`: solo se la review mostra una decisione ancora aperta sul resolver/loader

### `packages/i18n-typesafe`

- `README.md`: creare
- `docs/overview.md`: creare
- `docs/conventions.md`: creare
- `src/*`: nessuna modifica

### `packages/search`

- `README.md`: creare
- `docs/overview.md`: creare
- `docs/conventions.md`: creare
- `src/*`: nessuna modifica

### `packages/seo`

- `README.md`: creare
- `docs/overview.md`: creare
- `docs/conventions.md`: creare
- `src/*`: nessuna modifica

### `packages/sql`

- `README.md`: mantenere e riallineare se necessario
- `docs/overview.md`: mantenere e riallineare se necessario
- `docs/conventions.md`: creare o completare
- `docs/architecture.md`: mantenere e riallineare se necessario
- `src/*`: nessuna modifica

### `packages/sql-kysely`

- `README.md`: creare o riallineare
- `docs/overview.md`: mantenere e riallineare se necessario
- `docs/conventions.md`: creare
- `docs/architecture.md`: mantenere e riallineare se necessario
- `src/*`: nessuna modifica

### `packages/storage`

- `README.md`: creare
- `docs/overview.md`: creare
- `docs/conventions.md`: creare
- `docs/architecture.md`: solo se la review richiede esplicitare il boundary
- `src/*`: nessuna modifica

### `packages/storefront`

- `README.md`: creare
- `docs/overview.md`: creare
- `docs/conventions.md`: creare
- `docs/architecture.md`: solo se la review richiede esplicitare il boundary
- `src/*`: nessuna modifica

### `packages/storefront-magento`

- `README.md`: creare
- `docs/overview.md`: creare
- `docs/conventions.md`: creare
- `src/*`: nessuna modifica in FASE 2

## 4. Aggiornamenti alla documentazione generale

Per questo secondo blocco non sono previsti, in FASE 1, aggiornamenti ai file in `docs/standards/`.

Eventuali correzioni alle linee guida generali vanno registrate solo se emergono come necessarie durante la documentazione dei singoli package.

## 5. Casi speciali

### `customer`

- documentazione mantenuta
- ADR per `address`
- nessuna modifica al codice

### `validation`

- processo completo 9-step
- pianificazione separata

### `storefront-magento`

- trattarlo come caso più delicato rispetto agli altri adapter
- nessuna riscrittura in questa fase
- eventuali anomalie di struttura saranno valutate nel review finale, non ora

## 6. Stima impatto e rischi

| Azione | Rischio | Effort stimato | Impatto produzione |
|---|---|---:|---|
| Creazione documentazione minima per package senza README/docs | Basso | 0.5–1 giorno per blocco di package | Nessuno |
| Riallineamento documentazione di package già documentati | Basso | 1–2 ore per package | Nessuno |
| Esplicitazione di architecture.md solo dove necessario | Medio | 1–2 ore per package | Nessuno |
| Gestione dei package atipici (`cache-redis`, `storefront-magento`) | Medio | 1 giorno complessivo | Nessuno |

## 7. Metriche di completion

Alla fine della FASE 2 per questo blocco, consideriamo completato il lavoro quando:

- tutti i package in scope hanno almeno `README.md`
- tutti i package in scope hanno almeno `docs/overview.md`
- tutti i package in scope hanno almeno `docs/conventions.md`
- i package che richiedono una spiegazione architetturale hanno `docs/architecture.md`
- non ci sono riferimenti documentali obsoleti ai package fuori baseline
- la documentazione pubblica è coerente con `src/index.ts`
- nessun package del blocco è stato rifattorizzato durante la fase documentale

