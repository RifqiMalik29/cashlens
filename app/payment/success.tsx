import { Button, Card, Typography } from "@components/ui";
import { subscriptionService } from "@services/api/subscriptionService";
import { useSubscriptionStore } from "@stores/useSubscriptionStore";
import { logger } from "@utils/logger";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CheckCircle2 } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PaymentSuccessScreen() {
  const router = useRouter();
  const { invoice_id } = useLocalSearchParams<{ invoice_id?: string }>();
  const fetchSubscription = useSubscriptionStore(
    (state) => state.fetchSubscription
  );
  const [isRefreshing, setIsRefreshing] = useState(true);

  useEffect(() => {
    const refreshStatus = async () => {
      if (invoice_id) {
        try {
          await subscriptionService.verifySubscription(invoice_id);
        } catch (err) {
          logger.warn(
            "PaymentSuccess",
            "Verify returned error, fetching subscription anyway:",
            err as Error
          );
        }
      }
      await fetchSubscription();
      setIsRefreshing(false);
    };
    refreshStatus();
  }, [fetchSubscription, invoice_id]);

  return (
    <SafeAreaView className="flex-1 bg-background justify-center px-6">
      <Card className="items-center py-8">
        <View className="w-20 h-20 rounded-full bg-green-100 items-center justify-center mb-6">
          <CheckCircle2 size={40} color="#16a34a" />
        </View>
        <Typography variant="h2" weight="bold" className="text-center mb-2">
          Pembayaran Berhasil!
        </Typography>
        <Typography
          variant="bodyLarge"
          color="secondary"
          className="text-center mb-8"
        >
          Selamat! Kamu sekarang adalah pengguna Premium. Nikmati akses tanpa
          batas ke semua fitur CashLens.
        </Typography>

        {isRefreshing ? (
          <ActivityIndicator size="large" color="#4CAF82" />
        ) : (
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={() => router.replace("/(tabs)")}
          >
            Kembali ke Dashboard
          </Button>
        )}
      </Card>
    </SafeAreaView>
  );
}
