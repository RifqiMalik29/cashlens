import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import { spacing } from "@constants/theme";
import { Text, View } from "react-native";

interface CheckEmailFormProps {
  otp: string;
  onOtpChange: (value: string) => void;
  isLoading: boolean;
  isResending: boolean;
  error: string | null;
  successMessage: string | null;
  onVerify: () => void;
  onResend: () => void;
}

export function CheckEmailForm({
  otp,
  onOtpChange,
  isLoading,
  isResending,
  error,
  successMessage,
  onVerify,
  onResend
}: CheckEmailFormProps) {
  return (
    <View className="gap-4">
      {error && (
        <View className="bg-red-50 border border-red-200 rounded-lg p-3">
          <Text className="text-red-700 text-sm text-center">{error}</Text>
        </View>
      )}
      {successMessage && (
        <View className="bg-green-50 border border-green-200 rounded-lg p-3">
          <Text className="text-green-700 text-sm text-center">
            {successMessage}
          </Text>
        </View>
      )}

      <Input
        label="Kode Verifikasi"
        placeholder="123456"
        value={otp}
        onChangeText={(text) =>
          onOtpChange(text.replace(/[^0-9]/g, "").slice(0, 6))
        }
        keyboardType="numeric"
        autoCapitalize="none"
      />

      <Button onPress={onVerify} loading={isLoading}>
        Verifikasi Email
      </Button>

      <View
        className="flex-row justify-center items-center"
        style={{ gap: spacing[1] }}
      >
        <Text className="text-sm text-muted-foreground">
          Belum terima kode?
        </Text>
        <Button variant="ghost" onPress={onResend} loading={isResending}>
          Kirim ulang
        </Button>
      </View>
    </View>
  );
}
