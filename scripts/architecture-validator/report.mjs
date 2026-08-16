export function formatReport(violations) {
  const lines = ["Architecture Validation", ""];

  if (violations.length === 0) {
    lines.push("PASS  Register schema");
    lines.push("PASS  Core dependency graph");
    lines.push("PASS  Kernel layer");
    lines.push("PASS  Adapter layer");
    lines.push("PASS  Package metadata");
    lines.push("PASS  README documentation contract");
    lines.push("");
    lines.push("All architectural checks passed.");
    return lines.join("\n");
  }

  lines.push(`FAIL  ${violations.length} violation(s)`);
  lines.push("");

  for (const violation of violations) {
    lines.push(`FAIL ${violation.code}`);
    lines.push("");
    lines.push(violation.message);
    if (violation.edge) {
      lines.push("");
      lines.push(violation.edge.from);
      lines.push("  →");
      lines.push(violation.edge.to);
    }
    if (violation.package) {
      lines.push("");
      lines.push(violation.package);
    }
    if (violation.readmePath) {
      lines.push("");
      lines.push("README:");
      lines.push(violation.readmePath);
    }
    if (violation.expected) {
      lines.push("");
      lines.push("Expected:");
      lines.push(violation.expected);
    }
    lines.push("");
    lines.push("Source:");
    lines.push(violation.source);
    lines.push("");
    lines.push("Remediation:");
    lines.push(violation.remediation);
    lines.push("");
  }

  return lines.join("\n").trimEnd();
}