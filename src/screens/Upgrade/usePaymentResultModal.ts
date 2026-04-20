import { useRouter } from "expo-router";
import { useEffect } from "react";

export function usePaymentResultModal(
  status: "success" | "failed" | "idle",
  onDismiss: () => void
) {
  const router = useRouter();

  useEffect(() => {
    if (status !== "success") return;
    const timer = setTimeout(() => {
      onDismiss();
      router.back();
    }, 2500);
    return () => clearTimeout(timer);
  }, [status, onDismiss, router]);
}
