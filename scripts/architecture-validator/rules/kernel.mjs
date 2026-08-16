import { KERNEL_PACKAGES, KERNEL_SOURCE } from "../context.mjs";

export function validate(context) {
  const { graph } = context;
  const violations = [];

  for (const [kernelPackage, rule] of Object.entries(KERNEL_PACKAGES)) {
    const allowed = new Set(rule.allowed);

    for (const edge of graph.edges) {
      if (edge.from !== kernelPackage) continue;
      if (allowed.has(edge.to)) continue;

      violations.push({
        code: rule.code,
        message: rule.message,
        edge,
        source: KERNEL_SOURCE,
        remediation: "Remove the dependency to restore the Kernel dependency boundary.",
      });
    }
  }

  return violations;
}

export const validateKernel = validate;
