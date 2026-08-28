export type {
  PaymentRequest,
} from "./contracts/payment-request.js";

export type {
  PaymentStatus,
  PaymentOutcome,
} from "./contracts/payment-outcome.js";

export type {
  PaymentProvider,
} from "./contracts/payment-provider.js";

export type {
  PaymentErrorMeta,
  PaymentErrorReason,
} from "./errors/index.js";

export { MemoryPaymentProvider } from "./providers/memory.js";

export { PAYMENT_PROVIDER_TOKEN } from "./setup/constants.js";

export type {
  PaymentModuleContext,
  PaymentModuleEvents,
  PaymentModuleHooks,
  PaymentModuleServices,
} from "./setup/types.js";

import module from "./setup/index.js";

export { module };

export default module;