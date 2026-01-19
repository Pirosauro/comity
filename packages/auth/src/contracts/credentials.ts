/**
 * Credentials used for authentication
 */
export type Credentials =
  | {
      /** Password credentials */
      type: "password";

      /** Username */
      username: string;

      /** Password */
      password: string;
    }
  | {
      /** Token credentials */
      type: "token";

      /** Token */
      token: string;
    };
