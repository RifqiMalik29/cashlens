import { useProtectedRouter } from "@hooks/useProtectedRouter";
import { authService } from "@services/api/authService";
import { useState } from "react";

export function useCheckEmailConfirmation(email?: string) {
  const router = useProtectedRouter();

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleVerifyOtp = async () => {
    if (!email) {
      setError("Email not provided");
      return;
    }

    if (otp.length !== 6) {
      setError("Masukkan kode 6 digit");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await authService.confirmEmail(email, otp);
      router.replace("/(auth)/login");
    } catch (err) {
      setError(
        (err as Error).message || "Kode tidak valid atau sudah kadaluarsa"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) return;

    setIsResending(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await authService.resendConfirmation(email);
      setSuccessMessage("Kode baru telah dikirim ke email kamu.");
    } catch (err) {
      setError((err as Error).message || "Gagal mengirim ulang kode");
    } finally {
      setIsResending(false);
    }
  };

  const handleGoToLogin = () => {
    router.replace("/(auth)/login");
  };

  return {
    otp,
    setOtp,
    isLoading,
    isResending,
    error,
    successMessage,
    handleVerifyOtp,
    handleResendOtp,
    handleGoToLogin
  };
}
