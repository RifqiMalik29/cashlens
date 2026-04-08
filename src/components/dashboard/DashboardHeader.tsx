import { colors } from "@constants/theme";
import { Bell, TestTube } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";

import { Typography } from "../ui/Typography";

interface DashboardHeaderProps {
  pendingCount: number;
  handleTestNotification: () => void;
  onPressBell: () => void;
}

export function DashboardHeader({
  pendingCount,
  handleTestNotification,
  onPressBell
}: DashboardHeaderProps) {
  const { t } = useTranslation();

  return (
    <View
      className="px-6 pt-6 pb-12 flex-row justify-between items-start"
      style={{ backgroundColor: colors.primary }}
    >
      <View>
        <Typography variant="h1" weight="bold" color="#FFFFFF">
          {t("dashboard.title")}
        </Typography>
        <Typography variant="body" color="#FFFFFF">
          {t("dashboard.subtitle")}
        </Typography>
      </View>

      <View className="flex-row items-center gap-x-4">
        <TouchableOpacity
          onPress={handleTestNotification}
          className="p-2 rounded-full bg-white/20"
        >
          <TestTube size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onPressBell}
          className="p-2 rounded-full bg-white/20"
        >
          <Bell size={24} color="#FFFFFF" />
          {pendingCount > 0 && (
            <View
              style={{
                position: "absolute",
                top: 4,
                right: 4,
                width: 18,
                height: 18,
                backgroundColor: colors.error,
                borderRadius: 9,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2,
                borderColor: colors.primary
              }}
            >
              <Typography
                variant="caption"
                weight="bold"
                color="#FFFFFF"
                style={{ fontSize: 9 }}
              >
                {pendingCount}
              </Typography>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
