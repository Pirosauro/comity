# @comity/auth — Overview

`@comity/auth` defines the authentication and session domain core for Comity.

## What it includes

- authentication facade and contracts
- session lifecycle use cases
- assurance, refresh, and revocation policies
- hooks and setup metadata
- domain error types

## What it does not include

- HTTP request parsing
- token transport details
- persistence implementations
- framework-specific orchestration

## Ecosystem role

The package provides stable authentication semantics that adapters and
applications can compose around.

