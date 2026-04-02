import { TouchableOpacity, View } from "react-native";

import { Typography } from "@/components/ui/Typography";

interface ErrorMessageProps {
  message: string;
  onDismiss: () => void;
}

export function ErrorMessage({ message, onDismiss }: ErrorMessageProps) {
  return (
    <View className="bg-error/90 rounded-lg p-3 mb-4">
      <Typography variant="body" weight="medium" color="#FFFFFF">
        {message}
      </Typography>
      <TouchableOpacity onPress={onDismiss} className="mt-2">
        <Typography variant="caption" weight="semibold" color="#FFFFFF">
          Tutup
        </Typography>
      </TouchableOpacity>
    </View>
  );
}
