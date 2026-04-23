import { heights } from "@constants/theme";
import { useColors } from "@hooks/useColors";
import {
  ActivityIndicator,
  TouchableOpacity,
  type ViewStyle
} from "react-native";

import { Typography } from "../ui/Typography";

interface GoogleSignInButtonProps {
  onPress: () => void;
  isLoading?: boolean;
  label: string;
  style?: ViewStyle;
}

export function GoogleSignInButton({
  onPress,
  isLoading = false,
  label,
  style
}: GoogleSignInButtonProps) {
  const colors = useColors();
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLoading}
      activeOpacity={0.7}
      style={[
        {
          height: heights.buttonMd,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 6,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          opacity: isLoading ? 0.6 : 1
        },
        style
      ]}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.textSecondary} />
      ) : (
        <>
          <Typography
            variant="body"
            weight="bold"
            color="#4285F4"
            style={{ fontSize: 16, lineHeight: 18 }}
          >
            G
          </Typography>
          <Typography
            variant="body"
            weight="semibold"
            color={colors.textPrimary}
          >
            {label}
          </Typography>
        </>
      )}
    </TouchableOpacity>
  );
}
