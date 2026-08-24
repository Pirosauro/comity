/**
 * Historical contact method associated with an order purchaser.
 *
 * A plain, owned representation of a customer contact at purchase time. It
 * mirrors the shape of the customer module's contact concept without
 * importing any customer type: `@comity/order` stays independent of
 * `@comity/customer`.
 */
export interface OrderContact {
  /** The type of contact, e.g. "email" or "phone". */
  readonly type: string;

  /** The contact value. */
  readonly value: string;
}
