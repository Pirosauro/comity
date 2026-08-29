export type {
  PaymentStatus,
  PaymentOutcome,
} from "./contracts/payment-outcome.js";
export type {
  PaymentProvider,
} from "./contracts/payment-provider.js";
export type {
  PaymentRequest,
} from "./contracts/payment-request.js";
export type {
  PaymentErrorMeta,
  PaymentErrorReason,
} from "./errors/index.js";
export type {
  PaymentModuleContext,
  PaymentModuleEvents,
  PaymentModuleHooks,
  PaymentModuleServices,
} from "./setup/types.js";

export { MemoryPaymentProvider } from "./providers/memory.js";
export { PAYMENT_PROVIDER_TOKEN } from "./setup/constants.js";
export { module };

export default module;