import { Typography } from "@components/ui/Typography";
import { X } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";

interface ErrorMessageProps {
  error: string | null;
  onDismiss: () => void;
  onRetry?: () => void;
}

export function ErrorMessage({ error, onDismiss, onRetry }: ErrorMessageProps) {
  if (!error) return null;

  return (
    <View className="absolute top-16 left-6 right-6 z-50">
      <View className="bg-red-500/95 rounded-2xl p-4 shadow-xl border border-red-400/50">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-1 mr-3">
            <Typography variant="body" weight="bold" color="#FFFFFF">
              {error}
            </Typography>
          </View>
          <TouchableOpacity
            onPress={onDismiss}
            className="bg-white/20 p-2 rounded-full"
          >
            <X size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {onRetry && (
          <TouchableOpacity
            onPress={() => {
              onDismiss();
              onRetry();
            }}
            className="bg-white py-2.5 rounded-xl items-center"
          >
            <Typography variant="body" weight="bold" color="#EF4444">
              Coba Lagi
            </Typography>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
