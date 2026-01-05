Cosa faccio ORA (senza altre domande)

Produrrò un unico ZIP finale che contiene:

📦 packages/auth/ – modulo completo Comity-style

1. Core (puro, deterministico, Result-based)

core/types.ts

core/session.ts

core/assurance.ts

core/policy.ts

core/validate.ts

core/refresh.ts

core/step-up.ts

core/result.ts

✔️ Zero Date / crypto / fs / throw
✔️ Tutto time-based passa da input
✔️ Nessuna dipendenza da adapter o storage

2. Ports / Contracts

ports/session-store.ts

ports/refresh-store.ts

ports/event-bus.ts

✔️ Interfacce strette
✔️ Nessuna assunzione infrastrutturale

3. Storage reference (minimo ma corretto)

storage/inmemory-session-store.ts

storage/inmemory-refresh-store.ts

✔️ Solo per test / dev / esempio
✔️ Chiaramente marcato come reference

4. Adapters concreti

JWT

adapters/jwt/sign.ts

adapters/jwt/verify.ts
(usando jose, kid, alg, payload coerente con il tuo JWTPayload)

HTTP

adapters/http/login-handler.ts

adapters/http/refresh-handler.ts

adapters/http/step-up-handler.ts

✔️ Qui entrano Date, errori, BaseError, framework
✔️ Core rimane intatto

5. Event model

events/auth.events.ts

✔️ Naming @comity/auth:\*
✔️ Nessuna emissione nel core, solo descrizione

6. Policy

TTL dinamico

sliding sessions

step-up thresholds

assurance scoring configurabile

7. Documentazione (breve ma vera)

README.md – come usarlo

ARCHITECTURE.md – filosofia + flussi

SECURITY.md – threat model + invariants
