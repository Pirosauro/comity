# FAQ

### Is this an ORM?

No. This is an adapter.

### Can I access the raw Kysely client?

No. That would break isolation and portability.

### Can I execute raw SQL?

Yes, if the `@comity/sql` contract allows it.

### Is this meant for domain logic?

No. Use repositories or services in the application layer.
