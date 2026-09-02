import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const VALIDATOR_ROOT = resolve(__dirname, "..");
export const REPO_ROOT = resolve(__dirname, "../../..");
export const PACKAGES_DIR = join(REPO_ROOT, "packages");
export const REGISTER_PATH = join(
  REPO_ROOT,
  "docs/standards/decisions/data/adr-008-core-exception-register.json"
);
export const SCHEMA_PATH = join(
  REPO_ROOT,
  "docs/standards/decisions/data/adr-008-core-exception-register.schema.json"
);
export const ADR008_PATH = join(
  REPO_ROOT,
  "docs/standards/decisions/ADR-008-explicit-core-module-composition-exceptions.md"
);

export const PACKAGE_NAME_REGEX = /@comity\/[a-z0-9-]+/g;
