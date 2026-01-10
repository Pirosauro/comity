# Naming and Error Codes Standard

## 1. Naming dei Codici Errore

Per garantire coerenza tra i moduli, i codici errore (proprietà `code`) seguono il pattern di raggruppamento per dominio.

- **Pattern**: `dominio:tipo_errore`
- **Esempi**:
  - `auth:invalid_token`
  - `storage:file_too_large`
  - `identity:user_not_found`

## 2. Naming delle Classi Errore

Le classi che estendono `BaseError` devono essere PascalCase e terminare con il suffisso `Error`.

- ✅ `ConflictError`
- ✅ `ServiceUnavailableError`

## 3. Regole per i Messaggi

I messaggi sono destinati a chi legge i log o allo sviluppatore che integra l'API, non all'utente finale (la cui localizzazione è a carico dell'adapter/UI).

| Scenario               | Codice              | Messaggio Corretto       |
| :--------------------- | :------------------ | :----------------------- |
| Risorsa mancante       | `NOT_FOUND`         | "Resource not found"     |
| Permessi insufficienti | `UNAUTHORIZED`      | "Action not authorized"  |
| Input malformato       | `VALIDATION_FAILED` | "Invalid input provided" |
