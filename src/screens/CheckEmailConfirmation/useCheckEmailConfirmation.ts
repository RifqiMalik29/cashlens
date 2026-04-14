import { authService } from "@services/api/authService";
import { useRouter } from "expo-router";
import { useState } from "react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useCheckEmailConfirmation(email?: string) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleResendConfirmation = async () => {
    if (!email) {
      setError("Email not provided");
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      setError("Invalid email format");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await authService.resendConfirmation(email);
      setSuccessMessage("Confirmation email resent successfully. Please check your inbox.");
    } catch (err) {
      setError((err as Error).message || "Failed to resend confirmation email");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToLogin = () => {
    router.push("/(auth)/login");
  };

  return {
    isLoading,
    error,
    successMessage,
    handleResendConfirmation,
    handleGoToLogin
  };
}
