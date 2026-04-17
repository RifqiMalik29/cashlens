import { subscriptionService } from "@services/api/subscriptionService";
import { useSubscriptionStore } from "@stores/useSubscriptionStore";
import { createLogger } from "@utils/logger";
import { useCallback, useEffect, useState } from "react";

const logger = createLogger("[PaymentVerification]");

type VerificationState = "loading" | "success" | "error";

interface UsePaymentVerificationResult {
  verificationState: VerificationState;
  errorMessage: string | null;
  verifyPayment: (invoiceId?: string) => Promise<void>;
  resetVerification: () => void;
}

export function usePaymentVerification(): UsePaymentVerificationResult {
  const fetchSubscription = useSubscriptionStore(
    (state) => state.fetchSubscription
  );
  const [verificationState, setVerificationState] =
    useState<VerificationState>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const verifyPayment = useCallback(
    async (invoiceId?: string) => {
      if (!invoiceId) {
        setErrorMessage("Invoice ID tidak ditemukan");
        setVerificationState("error");
        return;
      }

      try {
        await subscriptionService.verifySubscription(invoiceId);
        await fetchSubscription();
        setVerificationState("success");
      } catch (err) {
        const message = (err as Error).message || "Verifikasi pembayaran gagal";
        logger.error(
          "PaymentVerification",
          "Verification failed:",
          err as Error
        );
        setErrorMessage(message);
        setVerificationState("error");
      }
    },
    [fetchSubscription]
  );

  const resetVerification = useCallback(() => {
    setVerificationState("loading");
    setErrorMessage(null);
  }, []);

  useEffect(() => {
    // Auto-verify on mount - invoice_id should be passed via params
    // The component will call verifyPayment with the actual invoice_id
  }, []);

  return {
    verificationState,
    errorMessage,
    verifyPayment,
    resetVerification
  };
}
