import { Button, Card, Typography } from "@components/ui";
import { usePaymentVerification } from "@screens/Payment/usePaymentVerification";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CheckCircle2, XCircle } from "lucide-react-native";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PaymentSuccessScreen() {
  const router = useRouter();
  const { invoice_id } = useLocalSearchParams<{ invoice_id?: string }>();
  const { verificationState, errorMessage, verifyPayment, resetVerification } =
    usePaymentVerification();

  React.useEffect(() => {
    verifyPayment(invoice_id);
  }, [invoice_id, verifyPayment]);

  return (
    <SafeAreaView className="flex-1 bg-background justify-center px-6">
      <Card className="items-center py-8">
        {verificationState === "loading" && (
          <>
            <ActivityIndicator size="large" color="#4CAF82" />
            <Typography variant="h3" weight="bold" className="text-center mb-2 mt-6">
              Memverifikasi Pembayaran...
            </Typography>
            <Typography
              variant="body"
              color="secondary"
              className="text-center"
            >
              Mohon tunggu sebentar, kami sedang mengkonfirmasi pembayaran Anda.
            </Typography>
          </>
        )}

        {verificationState === "success" && (
          <>
            <View className="w-20 h-20 rounded-full bg-green-100 items-center justify-center mb-6">
              <CheckCircle2 size={40} color="#16a34a" />
            </View>
            <Typography variant="h3" weight="bold" className="text-center mb-2">
              Pembayaran Berhasil!
            </Typography>
            <Typography
              variant="body"
              color="secondary"
              className="text-center mb-8"
            >
              Selamat! Kamu sekarang adalah pengguna Premium. Nikmati akses tanpa
              batas ke semua fitur CashLens.
            </Typography>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onPress={() => router.replace("/(tabs)")}
            >
              Kembali ke Dashboard
            </Button>
          </>
        )}

        {verificationState === "error" && (
          <>
            <View className="w-20 h-20 rounded-full bg-red-100 items-center justify-center mb-6">
              <XCircle size={40} color="#dc2626" />
            </View>
            <Typography variant="h3" weight="bold" className="text-center mb-2">
              Verifikasi Gagal
            </Typography>
            <Typography
              variant="body"
              color="secondary"
              className="text-center mb-4"
            >
              Terjadi masalah saat memverifikasi pembayaran Anda.
            </Typography>
            {errorMessage && (
              <View className="bg-red-50 p-4 rounded-lg mb-6">
                <Typography
                  variant="body"
                  color="error"
                  className="text-xs"
                >
                  {errorMessage}
                </Typography>
              </View>
            )}
            <View className="w-full gap-3">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onPress={() => router.replace("/(tabs)")}
              >
                Kembali ke Dashboard
              </Button>
              <Button
                variant="secondary"
                size="lg"
                fullWidth
                onPress={async () => {
                  resetVerification();
                  await verifyPayment(invoice_id);
                }}
              >
                Coba Lagi
              </Button>
            </View>
          </>
        )}
      </Card>
    </SafeAreaView>
  );
}
