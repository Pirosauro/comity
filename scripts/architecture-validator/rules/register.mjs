const REGISTER_SOURCE =
  "ADR-008 (docs/standards/decisions/ADR-008-explicit-core-module-composition-exceptions.md)";

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function deepEqual(a, b) {
  if (a === b) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => deepEqual(item, b[index]));
  }
  if (isObject(a) && isObject(b)) {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    return aKeys.every((key) => key in b && deepEqual(a[key], b[key]));
  }
  return false;
}

function matchesType(value, type) {
  switch (type) {
    case "object":
      return isObject(value);
    case "array":
      return Array.isArray(value);
    case "string":
      return typeof value === "string";
    case "integer":
      return typeof value === "number" && Number.isInteger(value);
    case "number":
      return typeof value === "number";
    case "boolean":
      return typeof value === "boolean";
    case "null":
      return value === null;
    default:
      return false;
  }
}

function resolveRef(root, ref) {
  if (!ref.startsWith("#/$defs/")) return null;
  return root.$defs?.[ref.slice("#/$defs/".length)] ?? null;
}

function walk(instance, schema, path, errors, root) {
  if (!schema || typeof schema !== "object") return;

  if (schema.$ref) {
    const resolved = resolveRef(root, schema.$ref);
    if (resolved) walk(instance, resolved, path, errors, root);
    return;
  }

  if (schema.type) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    if (!types.some((type) => matchesType(instance, type))) {
      errors.push(`${path} expected type ${types.join(" or ")}`);
      return;
    }
  }

  if (schema.const !== undefined && !deepEqual(instance, schema.const)) {
    errors.push(`${path} expected const value`);
  }

  if (schema.enum !== undefined && !schema.enum.some((option) => deepEqual(instance, option))) {
    errors.push(`${path} value is not in enum`);
  }

  if (typeof instance === "string") {
    if (schema.minLength !== undefined && instance.length < schema.minLength) {
      errors.push(`${path} shorter than minLength ${schema.minLength}`);
    }
    if (schema.pattern !== undefined && !new RegExp(schema.pattern).test(instance)) {
      errors.push(`${path} does not match pattern`);
    }
  }

  if (Array.isArray(instance)) {
    if (schema.minItems !== undefined && instance.length < schema.minItems) {
      errors.push(`${path} fewer than minItems ${schema.minItems}`);
    }
    if (schema.uniqueItems === true) {
      const seen = [];
      for (const item of instance) {
        if (seen.some((other) => deepEqual(other, item))) {
          errors.push(`${path} items are not unique`);
          break;
        }
        seen.push(item);
      }
    }
    if (schema.items) {
      const itemSchema = Array.isArray(schema.items) ? schema.items[0] : schema.items;
      if (itemSchema) {
        instance.forEach((item, index) =>
          walk(item, itemSchema, `${path}[${index}]`, errors, root)
        );
      }
    }
  }

  if (isObject(instance)) {
    if (schema.required) {
      for (const key of schema.required) {
        if (!(key in instance)) errors.push(`${path} missing required property '${key}'`);
      }
    }

    if (schema.properties) {
      for (const [key, propertySchema] of Object.entries(schema.properties)) {
        if (key in instance) walk(instance[key], propertySchema, `${path}.${key}`, errors, root);
      }
    }

    if (schema.additionalProperties === false) {
      for (const key of Object.keys(instance)) {
        if (!schema.properties || !(key in schema.properties)) {
          errors.push(`${path} unexpected property '${key}'`);
        }
      }
    }
  }

  if (schema.if && schema.then) {
    const ifErrors = [];
    walk(instance, schema.if, path, ifErrors, root);
    if (ifErrors.length === 0) walk(instance, schema.then, path, errors, root);
  }
}

export function validateRegisterSchema(instance, schema) {
  const errors = [];
  walk(instance, schema, "$", errors, schema);
  return errors;
}

export function parseRegisterEdges(register) {
  return (register?.edges ?? []).map((edge) => ({ from: edge.from, to: edge.to }));
}

export function parseRejectedEdges(markdown) {
  const sectionStart = markdown.indexOf("### Explicitly NOT registered");
  if (sectionStart === -1) return [];

  const section = markdown
    .slice(sectionStart)
    .split(/\r?\n/)
    .filter((line) => line.startsWith("|"));
  const rejected = [];

  for (const line of section) {
    const cells = line.match(/`[^`]+`/g) ?? [];
    for (const cell of cells) {
      const edge = cell.slice(1, -1).match(/^([a-z0-9-]+)\s*→\s*(.+)$/);
      if (!edge) continue;
      const to = edge[2].trim();
      rejected.push({
        from: `@comity/${edge[1]}`,
        to: to.startsWith("<") ? null : `@comity/${to}`,
      });
    }
  }

  return rejected;
}

export function validate(context) {
  const { graph, register, schema, rejectedEdges, registerEdges, registerSchemaErrors } =
    context;
  const violations = [];

  if (registerSchemaErrors.length > 0) {
    violations.push({
      code: "ARCH-REGISTER-001",
      message: `Register schema validation failed: ${registerSchemaErrors.join("; ")}`,
      source:
        "ADR-009 (docs/standards/decisions/data/adr-008-core-exception-register.schema.json)",
      remediation: "Fix the register so it validates against the ADR-009 schema.",
    });
  }

  const graphEdges = new Set(graph.edges.map((edge) => `${edge.from} -> ${edge.to}`));

  for (const edge of registerEdges) {
    if (!graphEdges.has(`${edge.from} -> ${edge.to}`)) {
      violations.push({
        code: "ARCH-REGISTER-002",
        message: "Stale register entry",
        edge,
        source: REGISTER_SOURCE,
        remediation: "Remove the entry from the register or restore the dependency it describes.",
      });
    }
  }

  for (const edge of registerEdges) {
    const rejected = rejectedEdges.find(
      (rejected) =>
        rejected.from === edge.from &&
        (rejected.to === null ? graph.adapters.has(edge.to) : rejected.to === edge.to)
    );
    if (rejected) {
      violations.push({
        code: "ARCH-REGISTER-003",
        message: "Rejected exception registered as approved",
        edge,
        source: REGISTER_SOURCE,
        remediation: "Remove the entry; it was explicitly rejected by ADR-008.",
      });
    }
  }

  return violations;
}

export const validateRegister = validate;
