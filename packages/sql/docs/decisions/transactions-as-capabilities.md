# Decision: Transactions as capabilities

Transactions are modeled as explicit capabilities (`SqlTransaction`)
rather than implicit connection state.

This ensures:

- no accidental nested transactions
- clear transactional boundaries
- easier reasoning in concurrent systems
