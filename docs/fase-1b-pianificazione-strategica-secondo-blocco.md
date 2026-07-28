# FASE 1B — Pianificazione strategica (secondo blocco package)

Documento di pianificazione per i package Comity rimanenti, costruito con lo stesso processo applicato al primo blocco già consolidato.

Scope confermato:

- tutti i package presenti in `packages/`
- esclusi i package già completati nella baseline documentale precedente
- esclusi `customer`
- esclusi `validation`
- esclusi nuovi moduli non ancora entrati nel repository operativo
- gli esempi applicativi restano fuori scope

Fonti usate per la lettura:

- `packages/*/package.json`
- `packages/*/src/index.ts`
- `packages/*/src/**.ts`
- `packages/*/README.md`
- `packages/*/docs/*`
- `packages/*/src/**/__tests__/*`
- `docs/standards/*`

Questa fase:

- non implementa modifiche
- non introduce refactor
- non risolve decisioni architetturali
- non modifica API pubbliche o dipendenze

## Regola fondamentale di profondità documentale

Non applicare automaticamente il workflow completo:

- `SKILL.md`
- `DESIGN.md`
- `API.md`
- `PACKAGE-DESIGN.md`
- `IMPLEMENTATION-PLAN.md`

Questo workflow è richiesto solo se emerge almeno una delle condizioni seguenti:

- nuovo confine architetturale
- nuovo contratto pubblico
- cambio ownership di concetti
- modifica delle dipendenze
- decisione architetturale non risolta

Package già esistenti e stabili vengono documentati con:

- `README.md`
- `docs/overview.md`
- `docs/conventions.md`
- `docs/architecture.md` solo quando realmente necessario

## Boundary Rule

Durante questa fase non si modificano:

- public API
- exports
- dependency graph
- classificazioni architetturali consolidate
- ownership dei concetti

Se emerge una possibile violazione, classificarla come:

- cleanup tecnico
- ADR necessario
- follow-up FASE 3

Non proporre modifiche immediate in questa fase.

## 1. Matrice completa dei package

| Package | Tipo | README | docs/overview | docs/conventions | docs/architecture | SKILL | Priorità | Code changes allowed | Azioni necessarie | Evidenze |
|---|---|---:|---:|---:|---:|---:|---|---|---|---|
| `application` | Application support | No | No | No | No | No | Media | No | Creare `README.md`, `docs/overview.md`, `docs/conventions.md`; includere anche il subpath `errors` nella documentazione pubblica. | `packages/application/package.json`, `packages/application/src/index.ts`, `packages/application/src/errors/index.ts` |
| `auth` | Core Module | Sì | No | No | No | No | Alta | No | Mantenere il README e creare `docs/overview.md`, `docs/conventions.md`, `docs/architecture.md`; allineare i testi al contratto reale. | `packages/auth/package.json`, `packages/auth/src/index.ts`, `packages/auth/README.md`, `packages/auth/docs/*`, `packages/auth/src/error/auth.ts`, `packages/auth/src/setup/index.ts` |
| `auth-jose` | Adapter | Sì | No | No | No | No | Media | No | Mantenere il README e creare `docs/overview.md`, `docs/conventions.md`; nessun refactor. | `packages/auth-jose/package.json`, `packages/auth-jose/src/index.ts`, `packages/auth-jose/README.md`, `packages/auth-jose/src/setup/index.ts` |
| `auth-tokens` | Utility | No | No | No | No | No | Media | No | Creare `README.md`, `docs/overview.md`, `docs/conventions.md`; documentare il ruolo di supporto senza alzare il livello architetturale. | `packages/auth-tokens/package.json`, `packages/auth-tokens/src/index.ts` |
| `cache-kv` | Adapter | No | No | No | No | No | Media | No | Creare `README.md`, `docs/overview.md`, `docs/conventions.md`; mantenere il package come adapter semplice. | `packages/cache-kv/package.json`, `packages/cache-kv/src/index.ts`, `packages/cache-kv/src/setup/index.ts` |
| `cache-redis` | Adapter | No | No | No | No | No | Alta | No | Creare `README.md`, `docs/overview.md`, `docs/conventions.md`; notare la struttura atipica senza `src/index.ts` come follow-up tecnico, non come refactor di fase 2. | `packages/cache-redis/package.json`, `packages/cache-redis/src/setup/index.ts`, `packages/cache-redis/src/store.ts`, `packages/cache-redis/src/types.ts` |
| `cart` | Core Module | No | No | No | No | No | Media | No | Creare `README.md`, `docs/overview.md`, `docs/conventions.md`; segnalare come possibile punto ADR se la dipendenza da `catalog` richiede giustificazione formale più avanti. | `packages/cart/package.json`, `packages/cart/src/index.ts`, `packages/cart/src/error/index.ts` |
| `catalog` | Core Module | No | No | No | No | No | Alta | No | Creare `README.md`, `docs/overview.md`, `docs/conventions.md`, `docs/architecture.md` se la review mostra boundary aperti; nessuna modifica al codice. | `packages/catalog/package.json`, `packages/catalog/src/index.ts`, `packages/catalog/src/setup/types.ts` |
| `html-react` | Adapter | Sì | No | No | No | No | Media | No | Mantenere il README e creare `docs/overview.md`, `docs/conventions.md`; package sottile, niente architecture doc salvo necessità emersa. | `packages/html-react/package.json`, `packages/html-react/src/index.ts`, `packages/html-react/README.md` |
| `hydration-react` | Adapter | No | No | No | No | No | Media | No | Creare `README.md`, `docs/overview.md`, `docs/conventions.md`; documentazione proporzionata a un adapter sottile. | `packages/hydration-react/package.json`, `packages/hydration-react/src/index.ts` |
| `i18n` | Core Module | No | No | No | No | No | Alta | No | Creare `README.md`, `docs/overview.md`, `docs/conventions.md`, `docs/architecture.md` se la review lo richiede; mantenere il ruolo di core di localizzazione. | `packages/i18n/package.json`, `packages/i18n/src/index.ts`, `packages/i18n/src/error/i18n.ts`, `packages/i18n/src/setup/index.ts` |
| `i18n-typesafe` | Adapter | No | No | No | No | No | Media | No | Creare `README.md`, `docs/overview.md`, `docs/conventions.md`; trattare il package come integrazione specializzata, non come core autonomo. | `packages/i18n-typesafe/package.json`, `packages/i18n-typesafe/src/index.ts`, `packages/i18n-typesafe/src/setup/index.ts` |
| `search` | Utility | No | No | No | No | No | Media | No | Creare `README.md`, `docs/overview.md`, `docs/conventions.md`; package minimale, senza bisogno di architecture doc. | `packages/search/package.json`, `packages/search/src/index.ts` |
| `seo` | Utility | No | No | No | No | No | Media | No | Creare `README.md`, `docs/overview.md`, `docs/conventions.md`; restare leggeri e descrittivi. | `packages/seo/package.json`, `packages/seo/src/index.ts` |
| `sql` | Core Module | No | Sì | No | Sì | No | Alta | No | Creare `README.md` e `docs/conventions.md`; mantenere e riallineare `docs/overview.md` e `docs/architecture.md` se emergono dettagli da correggere. | `packages/sql/package.json`, `packages/sql/src/index.ts`, `packages/sql/docs/overview.md`, `packages/sql/docs/architecture.md`, `packages/sql/src/error/sql.ts` |
| `sql-kysely` | Adapter | No | Sì | No | Sì | No | Alta | No | Creare `README.md` e `docs/conventions.md`; mantenere e riallineare `docs/overview.md` e `docs/architecture.md` se servono piccoli allineamenti. | `packages/sql-kysely/package.json`, `packages/sql-kysely/src/index.ts`, `packages/sql-kysely/docs/overview.md`, `packages/sql-kysely/docs/architecture.md`, `packages/sql-kysely/src/internal/map-sql-error.ts` |
| `storage` | Core Module | No | No | No | No | No | Alta | No | Creare `README.md`, `docs/overview.md`, `docs/conventions.md`, `docs/architecture.md` se la review conferma boundary aperti; nessun refactor. | `packages/storage/package.json`, `packages/storage/src/index.ts`, `packages/storage/src/error/storage.ts`, `packages/storage/src/setup/index.ts` |
| `storefront` | Core Module | No | No | No | No | No | Alta | No | Creare `README.md`, `docs/overview.md`, `docs/conventions.md`, `docs/architecture.md` se utile a chiarire il boundary del storefront; nessuna modifica al codice. | `packages/storefront/package.json`, `packages/storefront/src/index.ts`, `packages/storefront/src/setup/index.ts` |
| `storefront-magento` | Adapter | No | No | No | No | No | Alta | No | Creare `README.md`, `docs/overview.md`, `docs/conventions.md`, `docs/architecture.md`; trattare la struttura multi-cartella come caso speciale da documentare, non da rifattorizzare. | `packages/storefront-magento/package.json`, `packages/storefront-magento/src/setup/index.ts`, `packages/storefront-magento/src/repositories/*`, `packages/storefront-magento/src/internal/*` |

## 2. Ordine di intervento

### Batch 1 — package già vicini alla baseline documentale

1. `auth`
2. `auth-jose`
3. `html-react`
4. `sql`
5. `sql-kysely`

Motivo:

- hanno già una documentazione parziale o una forte struttura pubblica
- sono package centrali o già relativamente leggibili
- permettono di stabilizzare rapidamente la convenzione documentale del secondo blocco

### Batch 2 — package senza documentazione minima

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
12. `storefront`

Motivo:

- mancano README o docs di base
- il codice è già presente e leggibile
- l’intervento resta documentale e non richiede scelte architetturali nuove

### Batch 3 — package atipici o delicati

1. `cache-redis`
2. `storefront-magento`

Motivo:

- hanno una struttura meno standard rispetto agli altri package
- richiedono un po’ più di attenzione nella documentazione per evitare di forzarli in uno schema troppo rigido
- eventuali anomalie vanno annotate, non corrette in questa fase

## 3. Piano file-per-file per la FASE 2

### `application`

- creare `README.md`
- creare `docs/overview.md`
- creare `docs/conventions.md`
- lasciare invariati `src/index.ts` e `src/errors/index.ts`

### `auth`

- mantenere `README.md`
- creare `docs/overview.md`
- creare `docs/conventions.md`
- creare `docs/architecture.md`
- lasciare invariati `src/index.ts`, `src/error/*`, `src/setup/*`, `src/contracts/*`, `src/hooks/*`, `src/policies/*`, `src/use-cases/*`

### `auth-jose`

- mantenere `README.md`
- creare `docs/overview.md`
- creare `docs/conventions.md`
- lasciare invariati `src/index.ts`, `src/setup/*`, `src/types.ts`

### `auth-tokens`

- creare `README.md`
- creare `docs/overview.md`
- creare `docs/conventions.md`
- lasciare invariati `src/index.ts`, `src/contracts/*`, `src/facade/*`

### `cache-kv`

- creare `README.md`
- creare `docs/overview.md`
- creare `docs/conventions.md`
- lasciare invariati `src/index.ts` assente, `src/setup/*`, `src/store.ts`, `src/types.ts`

### `cache-redis`

- creare `README.md`
- creare `docs/overview.md`
- creare `docs/conventions.md`
- lasciare invariati `src/setup/*`, `src/store.ts`, `src/types.ts`
- segnalare l’assenza di `src/index.ts` come struttura atipica da tenere sotto osservazione

### `cart`

- creare `README.md`
- creare `docs/overview.md`
- creare `docs/conventions.md`
- lasciare invariati `src/index.ts`, `src/error/*`, `src/contracts/*`

### `catalog`

- creare `README.md`
- creare `docs/overview.md`
- creare `docs/conventions.md`
- creare `docs/architecture.md` solo se la review conferma la necessità
- lasciare invariati `src/index.ts`, `src/setup/*`, `src/contracts/*`

### `html-react`

- mantenere `README.md`
- creare `docs/overview.md`
- creare `docs/conventions.md`
- lasciare invariati `src/index.ts`, `src/setup/*`, `src/streaming/*`

### `hydration-react`

- creare `README.md`
- creare `docs/overview.md`
- creare `docs/conventions.md`
- lasciare invariati `src/index.ts`, `src/components/*`, `src/contracts/*`, `src/runtime/*`

### `i18n`

- creare `README.md`
- creare `docs/overview.md`
- creare `docs/conventions.md`
- creare `docs/architecture.md` solo se la review finale lo richiede
- lasciare invariati `src/index.ts`, `src/error/*`, `src/hooks/*`, `src/setup/*`, `src/contracts/*`

### `i18n-typesafe`

- creare `README.md`
- creare `docs/overview.md`
- creare `docs/conventions.md`
- lasciare invariati `src/index.ts`, `src/setup/*`

### `search`

- creare `README.md`
- creare `docs/overview.md`
- creare `docs/conventions.md`
- lasciare invariati `src/index.ts`, `src/contracts/*`

### `seo`

- creare `README.md`
- creare `docs/overview.md`
- creare `docs/conventions.md`
- lasciare invariati `src/index.ts`, `src/contracts/*`

### `sql`

- creare `README.md`
- creare `docs/conventions.md`
- mantenere `docs/overview.md`
- mantenere `docs/architecture.md`
- lasciare invariati `src/index.ts`, `src/error/*`, `src/contracts/*`, `src/hooks/*`

### `sql-kysely`

- creare `README.md`
- creare `docs/conventions.md`
- mantenere `docs/overview.md`
- mantenere `docs/architecture.md`
- lasciare invariati `src/index.ts`, `src/internal/*`, `src/query/*`, `src/transaction/*`, `src/client/*`

### `storage`

- creare `README.md`
- creare `docs/overview.md`
- creare `docs/conventions.md`
- creare `docs/architecture.md` solo se necessario
- lasciare invariati `src/index.ts`, `src/error/*`, `src/hooks/*`, `src/setup/*`, `src/stores/*`

### `storefront`

- creare `README.md`
- creare `docs/overview.md`
- creare `docs/conventions.md`
- creare `docs/architecture.md` solo se necessario
- lasciare invariati `src/index.ts`, `src/contracts/*`, `src/setup/*`, `src/composers/*`

### `storefront-magento`

- creare `README.md`
- creare `docs/overview.md`
- creare `docs/conventions.md`
- creare `docs/architecture.md`
- lasciare invariati `src/setup/*`, `src/repositories/*`, `src/internal/*`, `src/contracts/*`

## 4. Casi speciali

### Package che sembrano richiedere ADR

- `cart`
  - la dipendenza su `catalog` merita attenzione se in fase successiva si vuole formalizzare il boundary tra i due domini
- `storefront`
  - il package coordina più contratti di dominio e potrebbe richiedere una decisione esplicita sul suo perimetro
- `i18n`
  - se la review mostra ambiguità tra responsabilità di localizzazione e integrazione runtime, serve ADR

### Package con struttura non standard

- `cache-redis`
  - non espone `src/index.ts`
  - struttura focalizzata su `setup/` e file di supporto
- `storefront-magento`
  - struttura multi-cartella molto più ampia degli altri adapter
  - non va normalizzata in FASE 2, solo documentata

### Package che potrebbero richiedere futura revisione architetturale

- `auth`
- `catalog`
- `storage`
- `sql`
- `sql-kysely`

Questi package hanno boundary più ricchi o più delicati e meritano una review più stretta durante la fase documentale, ma senza aprire refactor qui.

## 5. Metriche di completamento

La FASE 2 del secondo blocco è completata quando:

- tutti i package in scope hanno `README.md`
- tutti i package in scope hanno `docs/overview.md`
- tutti i package in scope hanno `docs/conventions.md`
- i package complessi hanno `docs/architecture.md` solo dove giustificato
- non restano riferimenti documentali obsoleti rispetto ai package reali
- la documentazione pubblica descrive `src/index.ts` e i subpath esportati in modo coerente
- nessun package è stato rifattorizzato o riclassificato durante la fase

