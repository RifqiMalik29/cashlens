import { Button } from "@components/ui/Button";
import { spacing } from "@constants/theme";
import { Text, View } from "react-native";

interface CheckEmailFormProps {
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
  onResendConfirmation: () => void;
}

export function CheckEmailForm({
  isLoading,
  error,
  successMessage,
  onResendConfirmation
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

      <View
        className="bg-card rounded-lg p-4"
        style={{ gap: spacing[4] }}
      >
        <Text className="text-sm text-muted-foreground text-center">
          Click the link in the email to confirm your account. The link will open
          in your browser and confirm your email automatically.
        </Text>

        <Text className="text-xs text-muted-foreground text-center">
          Didn&apos;t receive the email? Check your spam folder or click the button
          below to resend.
        </Text>
      </View>

      <Button
        onPress={onResendConfirmation}
        loading={isLoading}
        variant="secondary"
      >
        Resend Confirmation Email
      </Button>
    </View>
  );
}
