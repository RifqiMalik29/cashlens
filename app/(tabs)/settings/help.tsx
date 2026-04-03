import { Typography } from "@components/ui/Typography";
import { spacing } from "@constants/theme";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HelpScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-6">
        <Typography
          variant="h3"
          weight="bold"
          style={{ marginBottom: spacing[4] }}
        >
          Pusat Bantuan
        </Typography>
        <Typography
          variant="body"
          color="#6B7280"
          style={{ textAlign: "center" }}
        >
          Dokumentasi dan FAQ akan segera hadir.
        </Typography>
      </View>
    </SafeAreaView>
  );
}
