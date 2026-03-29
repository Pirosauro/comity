/**
 *
 */
export interface Locale {
  /** locale code */
  readonly code: string;

  /** text direction */
  readonly direction: "ltr" | "rtl";
}
