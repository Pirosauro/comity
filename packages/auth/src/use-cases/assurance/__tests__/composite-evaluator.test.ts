import { describe, expect, it, vi } from "vitest";
import type {
  AuthSessionAssuranceEvaluator,
  AuthSessionAssuranceInput,
} from "../../../contracts/session-assurance-evaluator.js";
import { CompositeAssuranceEvaluator } from "../composite-evaluator.js";

describe("CompositeAssuranceEvaluator", () => {
  describe("evaluate", () => {
    it("should return default values when no evaluators are provided", () => {
      const evaluator = new CompositeAssuranceEvaluator([]);
      const input: AuthSessionAssuranceInput = { version: 1, methods: [] };
      const now = Date.now();

      const result = evaluator.evaluate(input, now);

      expect(result).toEqual({
        score: 0,
        evaluatedAt: now,
        version: 1,
        methods: [],
      });
    });

    it("should aggregate scores from multiple evaluators", () => {
      const mockEvaluator1: AuthSessionAssuranceEvaluator = {
        evaluate: vi.fn().mockReturnValue({
          score: 10,
          evaluatedAt: 0,
          version: 1,
          methods: ["method1"],
        }),
      };
      const mockEvaluator2: AuthSessionAssuranceEvaluator = {
        evaluate: vi.fn().mockReturnValue({
          score: 20,
          evaluatedAt: 0,
          version: 1,
          methods: ["method2"],
        }),
      };
      const evaluator = new CompositeAssuranceEvaluator([mockEvaluator1, mockEvaluator2]);
      const input: AuthSessionAssuranceInput = { version: 1, methods: [] };
      const now = Date.now();

      const result = evaluator.evaluate(input, now);

      expect(result.score).toBe(30);
      expect(result.methods).toEqual(["method1", "method2"]);
      expect(mockEvaluator1.evaluate).toHaveBeenCalledWith(input, now);
      expect(mockEvaluator2.evaluate).toHaveBeenCalledWith(input, now);
    });

    it("should merge methods uniquely", () => {
      const mockEvaluator1: AuthSessionAssuranceEvaluator = {
        evaluate: vi.fn().mockReturnValue({
          score: 5,
          evaluatedAt: 0,
          version: 1,
          methods: ["method1", "method2"],
        }),
      };
      const mockEvaluator2: AuthSessionAssuranceEvaluator = {
        evaluate: vi.fn().mockReturnValue({
          score: 5,
          evaluatedAt: 0,
          version: 1,
          methods: ["method2", "method3"],
        }),
      };
      const evaluator = new CompositeAssuranceEvaluator([mockEvaluator1, mockEvaluator2]);
      const input: AuthSessionAssuranceInput = { version: 1, methods: [] };
      const now = Date.now();

      const result = evaluator.evaluate(input, now);

      expect(result.methods).toEqual(["method1", "method2", "method3"]);
    });

    it("should merge context without overwriting existing keys", () => {
      const mockEvaluator1: AuthSessionAssuranceEvaluator = {
        evaluate: vi.fn().mockReturnValue({
          score: 5,
          evaluatedAt: 0,
          version: 1,
          methods: [],
          context: { key1: "value1", key2: "value2" },
        }),
      };
      const mockEvaluator2: AuthSessionAssuranceEvaluator = {
        evaluate: vi.fn().mockReturnValue({
          score: 5,
          evaluatedAt: 0,
          version: 1,
          methods: [],
          context: { key2: "newValue", key3: "value3" },
        }),
      };
      const evaluator = new CompositeAssuranceEvaluator([mockEvaluator1, mockEvaluator2]);
      const input: AuthSessionAssuranceInput = { version: 1, methods: [] };
      const now = Date.now();

      const result = evaluator.evaluate(input, now);

      expect(result.context).toEqual({
        key1: "value1",
        key2: "value2", // Should not be overwritten
        key3: "value3",
      });
    });

    it("should omit context if no evaluators provide it", () => {
      const mockEvaluator: AuthSessionAssuranceEvaluator = {
        evaluate: vi.fn().mockReturnValue({
          score: 5,
          evaluatedAt: 0,
          version: 1,
          methods: ["method1"],
        }),
      };
      const evaluator = new CompositeAssuranceEvaluator([mockEvaluator]);
      const input: AuthSessionAssuranceInput = { version: 1, methods: [] };
      const now = Date.now();

      const result = evaluator.evaluate(input, now);

      expect(result).not.toHaveProperty("context");
    });

    it("should include context if at least one evaluator provides it", () => {
      const mockEvaluator1: AuthSessionAssuranceEvaluator = {
        evaluate: vi.fn().mockReturnValue({
          score: 5,
          evaluatedAt: 0,
          version: 1,
          methods: [],
        }),
      };
      const mockEvaluator2: AuthSessionAssuranceEvaluator = {
        evaluate: vi.fn().mockReturnValue({
          score: 5,
          evaluatedAt: 0,
          version: 1,
          methods: [],
          context: { key: "value" },
        }),
      };
      const evaluator = new CompositeAssuranceEvaluator([mockEvaluator1, mockEvaluator2]);
      const input: AuthSessionAssuranceInput = { version: 1, methods: [] };
      const now = Date.now();

      const result = evaluator.evaluate(input, now);

      expect(result.context).toEqual({ key: "value" });
    });
  });
});
