# App Authors vs Module Authors

## Application Authors

Application authors:

- create the kernel
- control lifecycle transitions
- wire modules together
- define runtime behavior

They own:

- startup order
- service composition
- adapter selection

---

## Module Authors

Module authors:

- implement domain logic
- expose contracts
- optionally integrate with the kernel

They must not:

- control lifecycle
- assume a kernel exists
- depend on kernel internals

Kernel integration is optional and additive.

---

## Rule of Thumb

If a module cannot run without the kernel, it is no longer portable.
