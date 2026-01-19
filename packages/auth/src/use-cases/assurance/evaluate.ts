import type { AuthSessionAssurance } from "../../contracts/session-assurance.js";
import type { CreateSessionInput } from "../session-create.js";

/**
 * Evaluate session assurance
 *
 * @param input The session creation input
 * @param now Current timestamp
 * @returns The evaluated session assurance
 */
export function evaluateAssurance(input: CreateSessionInput, now: number): AuthSessionAssurance {
  const assurance: AuthSessionAssurance = {
    methods: input.methods,
    proof: input.transport,
    score: 0,
    evaluatedAt: now,
    version: 0,
    ...(input.context ? { context: input.context } : {}),
  };

  return assurance;
}
