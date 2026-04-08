import { Typography } from "@components/ui/Typography";
import { X } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";

interface ErrorMessageProps {
  error: string | null;
  onDismiss: () => void;
}

export function ErrorMessage({ error, onDismiss }: ErrorMessageProps) {
  if (!error) return null;

  return (
    <View className="absolute top-16 left-6 right-6 z-50">
      <View className="bg-red-500/90 rounded-2xl p-4 shadow-xl flex-row items-center justify-between border border-red-400/50">
        <View className="flex-1 mr-3">
          <Typography variant="body" weight="bold" color="#FFFFFF">
            {error}
          </Typography>
        </View>
        <TouchableOpacity
          onPress={onDismiss}
          className="bg-white/20 p-2 rounded-full"
        >
          <X size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
