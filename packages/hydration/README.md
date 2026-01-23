# @comity/hydration

Comity hydration module for server-rendered applications.

---

## Purpose

This package provides essential functionality to hydrate client-side rendered parts of server-rendered applications using the Comity framework. It ensures that interactive components are properly initialized and state is synchronized between server and client, providing a smooth user experience without re-renders or flashes of unstyled content (FOUC).

---

## Scope

This package:

- Hydrates client-side components with server-rendered HTML
- Synchronizes component states across the server and client
- Supports various hydration strategies for different parts of the application

This package does NOT:

- Handle routing or navigation on the client side
- Manage global state management solutions like Redux or MobX
- Provide server-side rendering (SSR) capabilities

---

## Public API

The public API includes:

- `hydrateRoot`: Function to initiate hydration of a root component.
- `registerStrategy`: Function to register custom hydration strategies.

For detailed usage and examples, please refer to the official documentation:

- [Comity Documentation](https://github.com/comityjs/framework#readme)

---

## Related Packages

- [@comity/core]: Core utilities for the Comity framework
- [@comity/kernel]: Kernel module for dependency injection in Comity applications

---

## Status

Stable
