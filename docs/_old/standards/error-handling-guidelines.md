# Error Handling Guidelines (Authoritative)

Questo documento definisce lo standard per la gestione degli errori in Comity, integrando il pattern Result per la logica di dominio e le eccezioni strutturate per i fallimenti di sistema.

## 1. Modello Ibrido di Gestione

Comity distingue tra **condizioni di dominio attese** e **violazioni operative**.

### 1.1 Result / Either (Dominio)

Da utilizzare per tutte le condizioni di business logic che il chiamante deve gestire esplicitamente.

- **Casi d'uso**: Validazione input, conflitti di stato, entità non trovate durante la ricerca, permessi negati.
- **Regola**: Il framework non deve usare `throw` come controllo di flusso per queste condizioni.
- **Esempio**: `Promise<Result<User, UserNotFoundError | ValidationError>>`.

### 1.2 Throw / BaseError (Sistema & Invarianti)

Da utilizzare per violazioni di invarianti, errori di infrastruttura o stati "impossibili".

- **Casi d'uso**: Dipendenze mancanti, fallimento IO irreversibile, configurazioni corrotte, bug logici (invarianti violate).
- **Regola**: Ogni errore lanciato deve estendere `BaseError`.

## 2. Anatomia dell'Errore

### 2.1 Identità e Messaggi

- **Code**: Stringa stabile e parlante (es. `NOT_FOUND`). Usata per branching programmatico.
- **Message**: Breve, stabile e leggibile, ma **non** orientato alla macchina.
  - ✅ **SÌ**: `"Service not found"`, `"Access denied"`.
  - ❌ **NO (Codice macchina)**: `"ERR_404"`, `"AUTH_FAIL"`.
  - ❌ **NO (Interpolazione)**: `"User 'admin' not found"` (le info dinamiche vanno nei metadati).
- **Metadata**: Oggetto serializzabile per trasportare valori dinamici senza sporcare il messaggio.

### 2.2 BaseError Contract

```typescript
export abstract class BaseError extends Error {
  abstract readonly code: string;
  readonly meta: Record<string, unknown>;

  constructor(message: string, meta: Record<string, unknown> = {}) {
    super(message);
    this.meta = meta;
  }
}
```
