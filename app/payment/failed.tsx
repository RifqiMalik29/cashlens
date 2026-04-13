import { Button, Card, Typography } from "@components/ui";
import { useRouter } from "expo-router";
import { CircleX } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PaymentFailedScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background justify-center px-6">
      <Card className="items-center py-8">
        <View className="w-20 h-20 rounded-full bg-red-100 items-center justify-center mb-6">
          <CircleX size={40} color="#dc2626" />
        </View>
        <Typography variant="h2" weight="bold" className="text-center mb-2">
          Pembayaran Gagal
        </Typography>
        <Typography
          variant="bodyLarge"
          color="secondary"
          className="text-center mb-8"
        >
          Pembayaran tidak dapat diproses. Silakan coba lagi atau gunakan metode
          pembayaran lain.
        </Typography>

        <View className="w-full gap-3">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={() => router.replace("/upgrade")}
          >
            Coba Lagi
          </Button>
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onPress={() => router.replace("/(tabs)")}
          >
            Kembali ke Dashboard
          </Button>
        </View>
      </Card>
    </SafeAreaView>
  );
}
