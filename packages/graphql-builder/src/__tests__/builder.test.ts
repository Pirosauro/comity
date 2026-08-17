import { describe, expect, it } from "vitest";
import { buildQuery, graphqlVar } from "../index.js";
import { defaultSerializeValue } from "../serializers/index.js";

describe("buildQuery", () => {
  it("builds a query with type, name, variables and nested selection", () => {
    const query = buildQuery({
      $type: "query",
      $name: "Products",
      $vars: { id: "ID!" },
      products: {
        $args: { id: graphqlVar("id") },
        id: true,
        name: true,
      },
    });

    expect(query).toBe(
      'query Products(id: ID!) {\n  products(id: $id) {\n    id\n    name\n  }\n}'
    );
  });

  it("defaults the operation type to query", () => {
    const query = buildQuery({ viewer: { id: true } });

    expect(query).toBe("query {\n  viewer {\n    id\n  }\n}");
  });

  it("supports mutation and subscription operation types", () => {
    expect(buildQuery({ $type: "mutation", add: { id: true } })).toBe(
      "mutation {\n  add {\n    id\n  }\n}"
    );
    expect(buildQuery({ $type: "subscription", feed: { id: true } })).toBe(
      "subscription {\n  feed {\n    id\n  }\n}"
    );
  });

  it("omits variables when absent or empty", () => {
    expect(buildQuery({ $name: "A", viewer: { id: true } })).toBe(
      "query A {\n  viewer {\n    id\n  }\n}"
    );
    expect(buildQuery({ $vars: {}, viewer: { id: true } })).toBe(
      "query {\n  viewer {\n    id\n  }\n}"
    );
  });

  it("emits a leaf node with only arguments", () => {
    expect(buildQuery({ viewer: { $args: { id: "1" } } })).toBe(
      'query {\n  viewer(id: "1")\n}'
    );
  });

  it("skips falsy field values", () => {
    expect(buildQuery({ viewer: { id: true, active: false } })).toBe(
      "query {\n  viewer {\n    id\n  }\n}"
    );
  });

  it("skips truthy non-object, non-boolean field values", () => {
    expect(buildQuery({ ignored: "string" })).toBe("query {\n\n}");
  });

  it("emits no arguments when $args is an empty object", () => {
    expect(buildQuery({ viewer: { $args: {} } })).toBe("query {\n  viewer\n}");
  });

  it("renders single-line output when indent is false", () => {
    const query = buildQuery({ viewer: { id: true, name: true } }, { indent: false });

    expect(query).toBe("query { viewer { id name } }");
  });

  it("honors a custom indent size", () => {
    const query = buildQuery({ viewer: { id: true } }, { indent: 4 });

    expect(query).toBe("query {\n    viewer {\n        id\n    }\n}");
  });

  it("uses a custom serializer for argument values", () => {
    const query = buildQuery(
      { viewer: { $args: { id: "x" }, id: true } },
      { serializeValue: (v) => `serialized(${String(v)})` }
    );

    expect(query).toBe("query {\n  viewer(id: serialized(x)) {\n    id\n  }\n}");
  });

  it("serializes array and object argument values with the default serializer", () => {
    const query = buildQuery({
      products: {
        $args: { filter: { price: 10 }, tags: ["a", "b"] },
        id: true,
      },
    });

    expect(query).toBe(
      'query {\n  products(filter: { price: 10 }, tags: ["a", "b"]) {\n    id\n  }\n}'
    );
  });
});

describe("graphqlVar", () => {
  it("creates a variable reference", () => {
    expect(graphqlVar("id")).toEqual({ __var: "id" });
  });
});

describe("defaultSerializeValue", () => {
  it("serializes variable references", () => {
    expect(defaultSerializeValue(graphqlVar("id"))).toBe("$id");
  });

  it("serializes strings with JSON escaping", () => {
    expect(defaultSerializeValue("a\"b")).toBe('"a\\"b"');
  });

  it("serializes numbers and booleans as-is", () => {
    expect(defaultSerializeValue(42)).toBe("42");
    expect(defaultSerializeValue(true)).toBe("true");
    expect(defaultSerializeValue(false)).toBe("false");
  });

  it("serializes null and undefined as null", () => {
    expect(defaultSerializeValue(null)).toBe("null");
    expect(defaultSerializeValue(undefined)).toBe("null");
  });

  it("serializes arrays recursively", () => {
    expect(defaultSerializeValue([1, "a", true, null])).toBe('[1, "a", true, null]');
  });

  it("serializes objects as key-value pairs", () => {
    expect(defaultSerializeValue({ a: 1, b: "x" })).toBe('{ a: 1, b: "x" }');
  });

  it("falls back to JSON stringify for other values", () => {
    expect(defaultSerializeValue(Symbol("k") as any)).toBe(undefined);
  });
});
