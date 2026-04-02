import { TouchableOpacity, View } from "react-native";

import { Typography } from "../ui/Typography";

interface AuthFooterProps {
  questionText: string;
  actionText: string;
  onActionPress: () => void;
}

export function AuthFooter({
  questionText,
  actionText,
  onActionPress
}: AuthFooterProps) {
  return (
    <View className="flex-row items-center justify-center mt-6">
      <Typography color="#6B7280">{questionText}</Typography>
      <TouchableOpacity onPress={onActionPress}>
        <Typography
          variant="body"
          weight="semibold"
          style={{ color: "#4CAF82" }}
        >
          {actionText}
        </Typography>
      </TouchableOpacity>
    </View>
  );
}
