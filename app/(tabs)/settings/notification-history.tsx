import { Card } from "@components/ui/Card";
import { Typography } from "@components/ui/Typography";
import { colors } from "@constants/theme";
import { useHeader } from "@hooks/useHeader";
import { useNotificationLogStore } from "@stores/useNotificationLogStore";
import { format } from "date-fns";
import * as Clipboard from "expo-clipboard";
import { Copy, Trash2 } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Alert, FlatList, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificationHistoryScreen() {
  const { t } = useTranslation();
  const { logs, clearAll } = useNotificationLogStore();

  useHeader({
    title: t("notificationSettings.history"),
    rightElement:
      logs.length > 0 ? (
        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              t("common.confirm"),
              t("notificationSettings.clearHistory") + "?",
              [
                { text: t("common.cancel"), style: "cancel" },
                {
                  text: t("common.delete"),
                  style: "destructive",
                  onPress: clearAll
                }
              ]
            )
          }
        >
          <Trash2 size={24} color="#FFFFFF" />
        </TouchableOpacity>
      ) : undefined
  });

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert(t("common.success"), t("notificationSettings.textCopied"));
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center pt-20">
            <Typography color={colors.textSecondary}>
              {t("notificationSettings.noHistory")}
            </Typography>
          </View>
        }
        renderItem={({ item }) => (
          <Card className="p-4 mb-3">
            <View className="flex-row justify-between items-start mb-2">
              <View>
                <Typography variant="body" weight="bold">
                  {item.appName}
                </Typography>
                <Typography variant="caption" color={colors.textSecondary}>
                  {format(new Date(item.timestamp), "MMM d, HH:mm")}
                </Typography>
              </View>
              <View
                className={`px-2 py-1 rounded-full ${item.isParsed ? "bg-green-100" : "bg-gray-100"}`}
              >
                <Typography
                  variant="caption"
                  color={item.isParsed ? "#059669" : colors.textSecondary}
                >
                  {item.isParsed
                    ? t("notificationSettings.parsed")
                    : t("notificationSettings.ignored")}
                </Typography>
              </View>
            </View>

            <Typography variant="body" className="mb-3">
              {item.text}
            </Typography>

            <TouchableOpacity
              onPress={() => copyToClipboard(item.text)}
              className="flex-row items-center pt-2 border-t border-gray-100"
            >
              <Copy size={14} color={colors.primary} />
              <Typography
                variant="caption"
                color={colors.primary}
                className="ml-2"
              >
                {t("notificationSettings.copyText")}
              </Typography>
            </TouchableOpacity>
          </Card>
        )}
      />
    </SafeAreaView>
  );
}
