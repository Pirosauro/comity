/**
 *
 */
export interface Locale {
  /** locale code */
  readonly locale: string;

  /** text direction */
  readonly direction: "ltr" | "rtl";
}
