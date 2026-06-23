/**
 * Checks whether a value is a non-null record object.
 *
 * @param value Value to inspect.
 *
 * @returns True when the value is an object record.
 */
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

/** Maps source fields into a partial target object. */
export class FieldMapper<G extends object, M extends object> {
  private mappings: Partial<{ [K in keyof M]: (fields: G) => M[K] | false }> = {};

  /**
   * Copies a value from a source key to a target key.
   *
   * @param from Source key.
   * @param to Target key.
   *
   * @returns The mapper instance.
   */
  copy<KG extends keyof G, KM extends keyof M>(from: KG, to: KM): this {
    /**
     * Computes the mapped value for the target key.
     *
     * @param f Source data.
     *
     * @returns Mapped value or false to skip.
     */
    this.mappings[to] = (f: G) => {
      const val = f[from];

      if (val === undefined || val === null || val === false) return false;

      return val as unknown as M[KM];
    };

    return this;
  }

  /**
   * Copies a value using the same key in source and target.
   *
   * @param key Shared key.
   *
   * @returns The mapper instance.
   */
  same<K extends keyof G & keyof M>(key: K): this {
    return this.copy(key, key);
  }

  /**
   * Maps a nested value using a sub-mapper.
   *
   * @param from Source key.
   * @param to Target key.
   * @param subMapper Mapper for nested data.
   *
   * @returns The mapper instance.
   */
  sub<KG extends keyof G, KM extends keyof M>(
    from: KG,
    to: KM,
    subMapper: (fields: NonNullable<G[KG]>) => M[KM]
  ): this {
    /**
     * Computes the mapped nested value.
     *
     * @param f Source data.
     *
     * @returns Mapped nested value or false to skip.
     */
    this.mappings[to] = (f: G) => {
      const val = f[from];

      if (val === undefined || val === null || val === false) return false;

      if (val === true) return subMapper({} as NonNullable<G[KG]>);

      if (typeof val === "object") return subMapper(val as NonNullable<G[KG]>);

      return false;
    };

    return this;
  }

  /**
   * Transforms a source value with separate handlers for true and object values.
   *
   * @param from Source key.
   * @param to Target key.
   * @param onTrue Handler for true.
   * @param onObject Handler for object values.
   *
   * @returns The mapper instance.
   */
  transform<KG extends keyof G, KM extends keyof M>(
    from: KG,
    to: KM,
    onTrue: () => M[KM],
    onObject: (obj: NonNullable<G[KG]>) => M[KM]
  ): this {
    /**
     * Computes the transformed value for the target key.
     *
     * @param f Source data.
     *
     * @returns Transformed value or false to skip.
     */
    this.mappings[to] = (f: G) => {
      const val = f[from];

      if (val === undefined || val === null || val === false) return false;

      if (val === true) return onTrue();

      if (typeof val === "object") return onObject(val as NonNullable<G[KG]>);

      return false;
    };
    return this;
  }

  /**
   * Adds a custom transform for a target key.
   *
   * @param key Target key.
   * @param transform Transform function.
   *
   * @returns The mapper instance.
   */
  add<KM extends keyof M>(key: KM, transform: (fields: G) => M[KM] | false): this {
    this.mappings[key] = transform;

    return this;
  }

  /**
   * Applies all mappings to the given source object.
   *
   * @param graphqlFields Source data.
   *
   * @returns A partial mapped target object.
   */
  map(graphqlFields: G): Partial<M> {
    const result: Partial<M> = {};

    for (const key in this.mappings) {
      const transform = this.mappings[key];

      if (transform) {
        const val = transform(graphqlFields);

        if (val !== false && val !== undefined && val !== null) {
          result[key] = val;
        }
      }
    }

    return result;
  }
}

/** Maps source data into a target object using value transforms. */
export class ValueMapper<G extends object, M extends object> {
  private mappings: Partial<{ [K in keyof M]: (data: G) => M[K] | undefined }> = {};

  /**
   * Copies a value from a source key to a target key.
   *
   * @param from Source key.
   * @param to Target key.
   *
   * @returns The mapper instance.
   */
  copy<KG extends keyof G, KM extends keyof M>(from: KG, to: KM): this {
    /**
     * Computes the mapped value for the target key.
     *
     * @param data Source data.
     *
     * @returns Mapped value.
     */
    this.mappings[to] = (data: G) => data[from] as unknown as M[KM];

    return this;
  }

  /**
   * Copies a value using the same key in source and target.
   *
   * @param key Shared key.
   *
   * @returns The mapper instance.
   */
  same<K extends keyof G & keyof M>(key: K): this {
    return this.copy(key, key);
  }

  /**
   * Transforms a source value and assigns it to a target key.
   *
   * @param from Source key.
   * @param to Target key.
   * @param transform Transform function.
   *
   * @returns The mapper instance.
   */
  transform<KG extends keyof G, KM extends keyof M>(
    from: KG,
    to: KM,
    transform: (value: G[KG]) => M[KM] | undefined
  ): this {
    /**
     * Computes the transformed value for the target key.
     *
     * @param data Source data.
     *
     * @returns Transformed value or undefined to skip.
     */
    this.mappings[to] = (data: G) => transform(data[from]);

    return this;
  }

  /**
   * Merges object fragments from multiple sources into one target key.
   *
   * @param to Target key.
   * @param sources Source extractors.
   *
   * @returns The mapper instance.
   */
  combine<KM extends keyof M>(
    to: KM,
    ...sources: Array<(data: G) => Record<string, unknown> | undefined | null>
  ): this {
    /**
     * Computes the merged value for the target key.
     *
     * @param data Source data.
     *
     * @returns Merged object or undefined to skip.
     */
    this.mappings[to] = (data: G) => {
      const result: Record<string, unknown> = {};

      for (const source of sources) {
        const val = source(data);

        if (isRecord(val)) {
          Object.assign(result, val);
        }
      }

      return Object.keys(result).length > 0 ? (result as unknown as M[KM]) : undefined;
    };

    return this;
  }

  /**
   * Maps a nested source value using a sub-mapper.
   *
   * @param from Source key.
   * @param to Target key.
   * @param subMapper Mapper for nested data.
   *
   * @returns The mapper instance.
   */
  sub<KG extends keyof G, KM extends keyof M>(
    from: KG,
    to: KM,
    subMapper: (data: NonNullable<G[KG]>) => M[KM] | undefined
  ): this {
    /**
     * Computes the mapped nested value.
     *
     * @param data Source data.
     *
     * @returns Mapped nested value or undefined to skip.
     */
    this.mappings[to] = (data: G) => {
      const val = data[from];

      if (val === undefined || val === null) return undefined;

      return subMapper(val as NonNullable<G[KG]>);
    };

    return this;
  }

  /**
   * Adds a custom transform for a target key.
   *
   * @param key Target key.
   * @param transform Transform function.
   *
   * @returns The mapper instance.
   */
  add<KM extends keyof M>(key: KM, transform: (data: G) => M[KM] | undefined): this {
    this.mappings[key] = transform;

    return this;
  }

  /**
   * Applies all mappings to the given source object.
   *
   * @param data Source data.
   *
   * @returns The mapped target object.
   */
  map(data: G): M {
    const result: Partial<M> = {};

    for (const key in this.mappings) {
      const transform = this.mappings[key];

      if (transform) {
        const val = transform(data);

        if (val !== undefined && val !== null) {
          result[key] = val;
        }
      }
    }

    return result as M;
  }
}
