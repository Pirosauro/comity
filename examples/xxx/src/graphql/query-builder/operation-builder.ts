import { FieldBuilder } from "./field-builder";
import type { Directive, FieldNode, FragmentDefinition } from "./types";

/**
 *
 */
export type OperationType = "query" | "mutation" | "subscription";

/**
 *
 */
export class OperationBuilder<T = any> extends FieldBuilder<T> {
  private operationType: OperationType;
  private operationName: string | undefined;
  private _variables: {
    [key: string]: {
      /**
       *
       */
      type: string; /**
       *
       */
      defaultValue?: string;
    };
  } = {};
  private _fragments: { [name: string]: FragmentDefinition } = {};
  private _operationDirectives: Directive[] = [];
  private _operations: FieldNode[] = [];

  constructor(operationType: OperationType, operationName?: string) {
    super();
    this.operationType = operationType;
    this.operationName = operationName;
  }

  /**
   *
   * @param operationName
   */
  public name(operationName: string): this {
    this.operationName = operationName;
    return this;
  }

  /**
   *
   */
  public variables(vars: {
    [key: string]:
      | string
      | {
          /**
           *
           */
          type: string; /**
           *
           */
          defaultValue?: string;
        };
  }): this {
    const processedVars: {
      [key: string]: {
        /**
         *
         */
        type: string; /**
         *
         */
        defaultValue?: string;
      };
    } = {};
    for (const [key, value] of Object.entries(vars)) {
      if (typeof value === "string") {
        processedVars[key] = { type: value };
      } else {
        processedVars[key] = value;
      }
    }
    this._variables = processedVars;
    return this;
  }

  /**
   *
   * @param name
   */
  public operationDirective(name: string, args?: { [key: string]: string }): this {
    this._operationDirectives.push({ name, args });
    return this;
  }

  /**
   * Adds an operation to the GraphQL query/mutation/subscription with type support.
   *
   * Overload 1 (without alias, with args):
   *    .operation<Metaobject>("createMetaobject", { input: "$input" }, metaobject => { metaobject.fields("id") })
   * Overload 2 (without alias, without args):
   *    .operation<Metaobject>("createMetaobject", metaobject => { metaobject.fields("id") })
   * Overload 3 (with alias, with args):
   *    .operation<Metaobject>({ createMetaobject: "aliasedName" }, { input: "$input" }, metaobject => { metaobject.fields("id") })
   * Overload 4 (with alias, without args):
   *    .operation<Metaobject>({ createMetaobject: "aliasedName" }, metaobject => { metaobject.fields("id") })
   */
  public operation<TResponse = any, K extends keyof T = keyof T>(
    name: K | string,
    args: { [key: string]: any },
    callback: (builder: FieldBuilder<TResponse>) => void
  ): this;
  /**
   *
   */
  public operation<TResponse = any, K extends keyof T = keyof T>(
    name: K | string,
    callback: (builder: FieldBuilder<TResponse>) => void
  ): this;
  /**
   *
   */
  public operation<TResponse = any, K extends keyof T = keyof T>(
    nameMapping: Partial<Record<K | string, string>>,
    args: { [key: string]: any },
    callback: (builder: FieldBuilder<TResponse>) => void
  ): this;
  /**
   *
   */
  public operation<TResponse = any, K extends keyof T = keyof T>(
    nameMapping: Partial<Record<K | string, string>>,
    callback: (builder: FieldBuilder<TResponse>) => void
  ): this;
  /**
   *
   * @param nameOrMapping
   * @param argsOrCallback
   * @param callbackOrNothing
   */
  public operation<TResponse = any, K extends keyof T = keyof T>(
    nameOrMapping: K | string | Partial<Record<K | string, string>>,
    argsOrCallback: { [key: string]: any } | ((builder: FieldBuilder<TResponse>) => void),
    callbackOrNothing?: (builder: FieldBuilder<TResponse>) => void
  ): this {
    let callback: (builder: FieldBuilder<TResponse>) => void;
    let args: { [key: string]: any } | undefined;

    const { name, alias } = this.extractNameAndAlias(nameOrMapping as any);

    // Determine if we're using the callback-only version or the args+callback version
    if (typeof argsOrCallback === "function") {
      callback = argsOrCallback as (builder: FieldBuilder<TResponse>) => void;
      args = undefined;
    } else {
      args = argsOrCallback as { [key: string]: any };
      callback = callbackOrNothing as (builder: FieldBuilder<TResponse>) => void;

      if (!callback) {
        throw new Error("Callback function is required for operation");
      }
    }

    // Ensure arguments are strings if they exist
    const stringArgs = args
      ? Object.fromEntries(
          // Object.entries(args).map(([k, v]) => [k, String(v)])
          Object.entries(args).map(([k, v]) => [k, this.stringifyArgValue(v)])
        )
      : undefined;

    const builder = new FieldBuilder<TResponse>();
    callback(builder);

    const fieldNode: any = {
      kind: "object",
      name,
      args: stringArgs,
      fields: builder.getFields(),
    };

    if (alias) {
      fieldNode.alias = alias;
    }

    this._operations.push(fieldNode);
    return this;
  }

  /**
   *
   * @param name
   * @param type
   * @param callback
   */
  public fragment<TFragment>(
    name: string,
    type: string,
    callback: (builder: FieldBuilder<TFragment>) => void
  ): this {
    const builder = new FieldBuilder<TFragment>();
    callback(builder);
    const fragDef: FragmentDefinition = {
      name,
      type,
      fields: builder.getFields(),
    };
    this._fragments[name] = fragDef;
    return this;
  }

  // Helper: Recursively stringify an argument value.
  /**
   *
   * @param value
   */
  protected stringifyArgValue(value: any): string {
    if (typeof value === "object" && value !== null) {
      if (Array.isArray(value)) {
        return "[" + value.map((v) => this.stringifyArgValue(v)).join(", ") + "]";
      } else {
        const inner = Object.entries(value)
          .map(([k, v]) => `${k}: ${this.stringifyArgValue(v)}`)
          .join(", ");
        return `{ ${inner} }`;
      }
    } else if (typeof value === "string") {
      const isVariable = /^\$[A-Za-z_][A-Za-z0-9_]*$/.test(value);

      if (!isNaN(Number(value)) || isVariable) {
        return value;
      } else {
        return `"${value}"`;
      }
    } else {
      return String(value);
    }
  }

  // Helper: Format arguments object to string.
  /**
   *
   */
  private formatArgs(args?: { [key: string]: any }): string {
    if (!args) return "";
    return (
      "(" +
      Object.entries(args)
        .map(([k, v]) => `${k}: ${this.stringifyArgValue(v)}`)
        .join(", ") +
      ")"
    );
  }

  // Helper: Format a single directive.
  /**
   *
   * @param directive
   */
  private formatDirective(directive: Directive): string {
    const argsStr = directive.args
      ? "(" +
        Object.entries(directive.args)
          .map(([k, v]) => `${k}: ${this.stringifyArgValue(v)}`)
          .join(", ") +
        ")"
      : "";
    return `@${directive.name}${argsStr}`;
  }

  // Helper: Build directives string.
  /**
   *
   * @param directives
   */
  protected buildDirectives(directives?: Directive[]): string {
    if (!directives || directives.length === 0) return "";
    return directives.map((dir) => this.formatDirective(dir)).join(" ");
  }

  // Render a single field node based on its kind.
  /**
   *
   * @param field
   * @param level
   * @param options
   * @param options.pretty
   * @param options.indent
   */
  private renderField(
    field: FieldNode,
    level: number,
    options: {
      /**
       *
       */
      pretty: boolean; /**
       *
       */
      indent: string;
    }
  ): string {
    const indentStr = options.pretty ? options.indent.repeat(level) : "";
    switch (field.kind) {
      case "field": {
        const argsStr = this.formatArgs(field.args);
        const directives = this.buildDirectives(field.directives);
        const base = field.alias ? `${field.alias}: ${field.name}` : field.name;
        return indentStr + `${base}${argsStr}${directives ? " " + directives : ""}`.trim();
      }
      case "object": {
        const argsStr = this.formatArgs(field.args);
        const directives = this.buildDirectives(field.directives);
        const base = field.alias ? `${field.alias}: ${field.name}` : field.name;
        const nested = this.buildFields(field.fields, level + 1, options);
        if (options.pretty) {
          return (
            indentStr +
            `${base}${argsStr}${directives ? " " + directives : ""}`.trim() +
            " {\n" +
            nested +
            "\n" +
            indentStr +
            "}"
          );
        } else {
          return (
            indentStr +
            `${base}${argsStr}${directives ? " " + directives : ""} { ${this.buildFields(field.fields)} }`.trim()
          );
        }
      }
      case "fragment": {
        const directives = this.buildDirectives(field.directives);
        return indentStr + `...${field.name}${directives ? " " + directives : ""}`.trim();
      }
      case "inlineFragment": {
        const directives = this.buildDirectives(field.directives);
        const nested = this.buildFields(field.fields, level + 1, options);
        if (options.pretty) {
          return (
            indentStr +
            `... on ${field.type}${directives ? " " + directives : ""}`.trim() +
            " {\n" +
            nested +
            "\n" +
            indentStr +
            "}"
          );
        } else {
          return (
            indentStr +
            `... on ${field.type}${directives ? " " + directives : ""} { ${this.buildFields(field.fields)} }`.trim()
          );
        }
      }
      default:
        return "";
    }
  }

  // Recursively build fields using renderField.
  /**
   *
   * @param fields
   * @param level
   * @param options
   * @param options.pretty
   * @param options.indent
   */
  protected buildFields(
    fields: FieldNode[],
    level: number = 0,
    options?: {
      /**
       *
       */
      pretty: boolean; /**
       *
       */
      indent: string;
    }
  ): string {
    const opts = options || { pretty: false, indent: "" };
    return fields
      .map((field) => this.renderField(field, level, opts))
      .join(opts.pretty ? "\n" : " ");
  }

  // Build a fragment definition.
  /**
   *
   * @param fragment
   * @param level
   * @param options
   * @param options.pretty
   * @param options.indent
   */
  private buildFragment(
    fragment: FragmentDefinition,
    level: number = 0,
    options?: {
      /**
       *
       */
      pretty: boolean; /**
       *
       */
      indent: string;
    }
  ): string {
    const opts = options || { pretty: false, indent: "" };
    if (opts.pretty) {
      const indentStr = opts.indent.repeat(level);
      const fieldsStr = this.buildFields(fragment.fields, level + 1, opts);
      return `${indentStr}fragment ${fragment.name} on ${fragment.type} {\n${fieldsStr}\n${indentStr}}`;
    } else {
      const fieldsStr = this.buildFields(fragment.fields);
      return `fragment ${fragment.name} on ${fragment.type} { ${fieldsStr} }`;
    }
  }

  // Build operation header including type, name, variables, and directives.
  /**
   *
   * @param pretty
   * @param indent
   */
  private buildOperationHeader(pretty: boolean, indent: string): string {
    let opStr = `${this.operationType}`;
    if (this.operationName) {
      opStr += ` ${this.operationName}`;
    }
    const varsStr = this.buildVariablesString();
    if (varsStr) {
      opStr += varsStr;
    }
    const directivesStr = this.buildOperationDirectivesString();
    if (directivesStr) {
      opStr += ` ${directivesStr}`;
    }
    return opStr;
  }

  // Build variables string.
  /**
   *
   */
  private buildVariablesString(): string {
    const varEntries = Object.entries(this._variables);
    if (varEntries.length > 0) {
      const varStr = varEntries
        .map(([key, varInfo]) => {
          let varDef = `$${key}: ${varInfo.type}`;
          if (varInfo.defaultValue !== undefined) {
            varDef += ` = ${varInfo.defaultValue}`;
          }
          return varDef;
        })
        .join(", ");
      return `(${varStr})`;
    }
    return "";
  }

  // Build operation directives string.
  /**
   *
   */
  private buildOperationDirectivesString(): string {
    return this.buildDirectives(this._operationDirectives);
  }

  // Build selection set - now combines regular fields and operation fields
  /**
   *
   * @param level
   * @param options
   * @param options.pretty
   * @param options.indent
   */
  private buildSelectionSet(
    level: number,
    options: {
      /**
       *
       */
      pretty: boolean; /**
       *
       */
      indent: string;
    }
  ): string {
    const regularFields = this.getFields();
    const allFields = [...regularFields, ...this._operations];
    return this.buildFields(allFields, level, options);
  }

  // Build fragments string.
  /**
   *
   * @param pretty
   * @param indent
   */
  private buildFragmentsString(pretty: boolean, indent: string): string {
    const fragments = Object.values(this._fragments);
    if (fragments.length > 0) {
      return fragments
        .map((frag) => "\n" + this.buildFragment(frag, 0, { pretty, indent }))
        .join("");
    }
    return "";
  }

  /**
   * Build the complete GraphQL operation string.
   * @param options
   * @param options.pretty
   * @param options.indent
   */
  public build(options?: {
    /**
     *
     */
    pretty?: boolean; /**
     *
     */
    indent?: string;
  }): string {
    const pretty = options?.pretty ?? false;
    const indent = options?.indent ?? "  ";

    const header = this.buildOperationHeader(pretty, indent);
    const selectionSet = pretty
      ? "\n" + this.buildSelectionSet(1, { pretty, indent }) + "\n"
      : " " + this.buildSelectionSet(0, { pretty, indent });
    const opBody = pretty
      ? header + " {" + selectionSet + "}"
      : header + " {" + selectionSet + " }";
    const fragmentsStr = this.buildFragmentsString(pretty, indent);
    return opBody + fragmentsStr;
  }
}
