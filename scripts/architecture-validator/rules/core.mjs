const CORE_SOURCE =
  "ADR-008 (docs/standards/decisions/ADR-008-explicit-core-module-composition-exceptions.md)";

export function validate(context) {
  const { graph, registerEdges } = context;
  const violations = [];

  const registeredEdges = new Set(registerEdges.map((edge) => `${edge.from} -> ${edge.to}`));

  for (const edge of graph.coreToCore) {
    if (registeredEdges.has(`${edge.from} -> ${edge.to}`)) continue;
    violations.push({
      code: "ARCH-CORE-001",
      message: "Unregistered Core dependency",
      edge,
      source: CORE_SOURCE,
      remediation: "Remove dependency or update architecture through ADR process.",
    });
  }

  return violations;
}

export const validateCore = validate;
