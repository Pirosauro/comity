---
id: ai-principles
status: authoritative
version: 1.0.0
owner: @architecture-council
enforcement: block
last_reviewed: 2026-01-09
next_review: 2027-01-09
supersedes: []
---

# AI Principles

## Purpose

This document defines the **fundamental beliefs and philosophical stance** towards Artificial Intelligence in Comity. It establishes **why** we constrain AI and **what** architectural values it must preserve.

**Important:** These are **principles**, not implementation rules. Normative requirements will be defined in separate Standards (Level 3).

This is a **Level 2: Principle document**. It expresses intent and direction, not enforceable rules.

---

## Core Belief

> **AI must generate code that looks like it was written by a Comity expert who has read all the documentation.**

AI in Comity is a **constrained collaborator**, not an autonomous agent. Its value is measured by how well it preserves and extends our architectural integrity.

---

## 1. AI as Architecture-Preserving Tool

### Principle 1.1: AI Extends, Does Not Define

AI implements documented decisions; it does not make architectural decisions.

- **AI-generated code has zero architectural authority**
- **Authority derives exclusively from documentation and accepted ADRs**
- **AI cannot "discover" or "innovate" beyond documented patterns**

### Principle 1.2: Compliance Over Creativity

When creativity conflicts with compliance, compliance wins.

- **AI must reject prompts that would violate architectural constraints**
- **"Clever" solutions that break rules are prohibited**
- **Predictable, compliant code is better than novel, non-compliant code**

### Principle 1.3: Transparency Over Magic

AI behavior must be understandable and predictable.

- **Generated code must include validation evidence**
- **Prompt engineering must be reproducible**
- **Decision logic must be traceable to documented constraints**

---

## 2. Knowledge and Documentation Alignment

### Principle 2.1: Documentation as Primary Source

AI knowledge must derive from authoritative documentation, not inferred patterns.

- **Training corpus limited to Levels 0-3 documents + current ADRs**
- **No learning from code examples without documentation backing**
- **Documentation changes trigger mandatory retraining**

### Principle 2.2: Authority Chain Respect

AI must understand and enforce the Comity authority hierarchy:

```
1. Constitutional Axioms (inviolable)
2. ADRs (architectural decisions)
3. Terminology (canonical definitions)
4. Standards (normative rules)
5. Patterns & Examples (recommended approaches)
```

**Violation:** AI must reject any generation that would break this hierarchy.

### Principle 2.3: Terminology Consistency

AI must use canonical terminology exclusively.

- **No synonyms or alternative phrasings for defined terms**
- **Prohibited terms never appear in AI-generated content**
- **New terms must be defined before AI can use them**

---

## 3. Generation Philosophy

### Principle 3.1: Constrained by Design

AI constraints exist to prevent architectural drift, not to limit usefulness.

**Absolute Prohibitions (Never Generate):**

- Code that violates Core purity (IO in Core, framework types in Core)
- Architectural patterns not documented in Comity
- Workarounds for documented constraints
- "Magic" abstractions that hide complexity

**Conditional Allowances (May Generate):**

- Implementations of documented patterns
- Boilerplate for established interfaces
- Documentation improvements (suggestions only)

### Principle 3.2: Self-Validation Required

AI must validate its own output before presentation.

- **Generated code must include validation headers**
- **Validation must check against all applicable Standards**
- **Uncertainty must be explicitly flagged for human review**

### Principle 3.3: Human-AI Collaboration

AI assists humans; it does not replace human judgment.

- **AI-generated code requires human review**
- **AI must explain constraints when rejecting human requests**
- **Disagreements escalate to Architecture Council, not AI override**

---

## 4. Training and Evolution

### Principle 4.1: Document-Driven Updates

AI capabilities evolve with documentation, not independently.

- **New documentation patterns → New AI capabilities**
- **Deprecated patterns → Removed from AI training**
- **Documentation gaps → AI flags for human attention**

### Principle 4.2: Quality Over Quantity

Better compliance with fewer patterns is preferred over broad capability with poor compliance.

- **95%+ compliance rate required for any pattern**
- **100% accuracy on Constitutional Axioms**
- **Zero tolerance for prohibited pattern generation**

### Principle 4.3: Auditability and Improvement

AI performance must be measurable and improvable.

- **All generations logged for analysis**
- **Compliance metrics tracked and reviewed**
- **Violation patterns trigger documentation improvements**

---

## 5. Special Contexts

### Principle 5.1: Emergency AI Usage

AI may assist in emergencies but with heightened constraints.

- **Emergency code must still include validation headers**
- **Sunset requirements still apply to AI-generated emergency code**
- **Post-emergency review of all AI-generated emergency code**

### Principle 5.2: Exploratory and Learning

AI may generate non-compliant code only in explicitly marked exploratory contexts.

- **Exploratory code isolated in `/experimental/`**
- **Automatic deletion after 30 days**
- **No promotion to main without human rewrite**

### Principle 5.3: Migration Assistance

AI may help migrate deprecated patterns but must flag all changes.

- **Migration plans documented before generation**
- **Deprecated patterns explicitly identified**
- **Cleanup steps included in generation**

---

## Relationship to Other Documents

### Principles vs Standards

**This Document (Principles):**

- Expresses _why_ we constrain AI
- Defines philosophical stance
- Sets direction and intent

**Future AI Standards (Level 3):**

- Will define _what_ AI must/must not do
- Specify concrete requirements
- Include enforcement mechanisms

**Current Constraints:**
Until AI Standards exist, AI must comply with all existing Standards (Error Handling, Core Purity, Type Safety) as they apply to generated code.

### Principles vs Implementation

**Guides and Patterns (Levels 5-6):**

- Will provide implementation guidance
- Include prompt templates
- Offer best practices

**This document does not contain implementation details.**

---

## Design Philosophy Alignment

These AI Principles extend the [Comity Design Philosophy](/docs/02-principles/design-philosophy.md):

### 1. Explicit Over Implicit

AI must make its constraints and validations explicit in generated code.

### 2. Predictability Over Magic

AI behavior must be boring, obvious, and unsurprising.

### 3. Evolution Beats Prediction

AI capabilities evolve with documentation, not through prediction of future needs.

### 4. Boring Is a Feature

AI-generated code should look like competent but unremarkable Comity code.

---

## Compliance Statement

These principles comply with Constitutional Axioms:

- **Axiom 1:** AI generates intentional, documented code
- **Axiom 2:** AI respects document authority hierarchy
- **Axiom 3:** AI references single authoritative sources
- **Axiom 6:** AI decisions are append-only (generations preserved)
- **Axiom 7:** AI rejects undefined patterns
- **Axiom 9:** AI uses canonical terminology

**Note:** Specific AI constraints and validation requirements will be defined in future AI Standards (Level 3).

---

## References

- [Constitutional Axioms](/docs/00-constitution/constitutional-axioms.md) - Foundation principles
- [Comity Philosophy](/docs/02-principles/philosophy.md) - Core beliefs
- [Design Philosophy](/docs/02-principles/design-philosophy.md) - Design principles
- [Documentation Governance](/docs/00-constitution/documentation-governance.md) - Documentation authority
- [Terminology](/docs/00-constitution/terminology.md) - Canonical definitions

---

## Amendment History

_2026-01-09_: Initial version as Level 2 Principles
