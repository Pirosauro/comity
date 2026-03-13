# Decision: No ORM abstraction

We explicitly decided NOT to provide:

- entity mapping
- relations
- repositories
- change tracking
- schema ownership

Reasoning:

- ORMs lock architectural decisions too early
- SQL remains the most stable abstraction
- Adapters can provide higher-level APIs if needed

@comity/sql models SQL execution, not persistence modeling.
