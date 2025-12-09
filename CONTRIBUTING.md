# Contributing to Comity

Thank you for your interest in contributing to Comity! This document provides guidelines for development, testing, and contributing to the project.

## 🚀 Getting Started

### Prerequisites

- Node.js 24+
- pnpm 10+

### Setup

```bash
git clone https://github.com/comityjs/framework.git
cd framework
pnpm install
pnpm test
```

## 📁 Project Structure

```
packages/          # Framework modules
├── core/         # @comity/core - Main framework
└── [modules]/    # Additional framework modules

examples/         # Example applications
├── admin/        # Admin interface example
└── [demos]/      # Other demo applications
```

## 🧪 Testing Standards

### Running Tests

```bash
pnpm test              # Run all tests
pnpm test:watch        # Watch mode
pnpm test:coverage     # With coverage
```

### Writing Tests

- **Location**: Tests go in `__tests__/` folders next to source code
- **Naming**: `*.test.ts` for test files
- **Structure**: Use `describe` > `it` hierarchy
- **Coverage**: Aim for comprehensive coverage of public APIs

### Test Categories

1. **Unit Tests**: Test individual functions/classes
2. **Integration Tests**: Test module interactions
3. **Real-world Scenarios**: Test common use cases
4. **Edge Cases**: Test error conditions and boundaries

Example test structure:

```typescript
describe("functionName", () => {
  describe("basic functionality", () => {
    it("should handle normal case", () => {
      // Test implementation
    });
  });

  describe("edge cases", () => {
    it("should handle error conditions", () => {
      // Test implementation
    });
  });
});
```

## 💻 Coding Standards

### TypeScript

- Use strict TypeScript configuration
- Export types and interfaces for public APIs
- Prefer explicit types over `any`

### Code Style

- Use consistent naming conventions
- Add JSDoc comments for public APIs
- Keep functions focused and small

### File Organization

- Group related functionality in modules
- Use index files for clean exports
- Keep test files adjacent to source

## 🔧 Development Workflow

### 1. Setup Development Environment

```bash
cd packages/core
pnpm dev                # Watch mode compilation
```

### 2. Making Changes

- Create feature branch from `main`
- Write tests first (TDD approach)
- Implement functionality
- Ensure all tests pass

### 3. Pull Request Process

- Update documentation if needed
- Ensure tests pass: `pnpm test`
- Add changeset: `pnpm changeset`
- Create PR with clear description

## 📖 Architecture Guidelines

### Module Design

- Each package should have a single responsibility
- Use dependency injection patterns
- Design for extensibility and modularity

### Framework Principles

- Build on Hono for web functionality
- Support multiple deployment targets
- Maintain backwards compatibility

## 🐛 Reporting Issues

When reporting issues:

1. Use issue templates
2. Provide minimal reproduction
3. Include environment details
4. Add relevant error messages

## 📝 Documentation

- Keep README files updated
- Add examples for new features
- Document breaking changes
- Use TypeScript for API documentation

## 🎯 Performance

- Consider bundle size impact
- Write performance tests for critical paths
- Profile before optimizing
- Avoid premature optimization

---

Questions? Feel free to open an issue or start a discussion!
