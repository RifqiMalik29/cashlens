import { SettingsItem, SettingsSection } from "@components/settings";
import { colors, spacing } from "@constants/theme";
import { Check, Monitor, Moon, Sun } from "lucide-react-native";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useThemeScreen } from "./useThemeScreen";

export default function ThemeScreen() {
  const { t, currentTheme, handleThemeSelect } = useThemeScreen();

  const themes = [
    {
      id: "light",
      label: t("settings.light"),
      icon: <Sun size={20} color={colors.primary} />
    },
    {
      id: "dark",
      label: t("settings.dark"),
      icon: <Moon size={20} color={colors.primary} />
    },
    {
      id: "system",
      label: t("settings.system"),
      icon: <Monitor size={20} color={colors.primary} />
    }
  ] as const;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: spacing[8] }}
      >
        <SettingsSection title={t("settings.preferences")}>
          {themes.map((theme, index) => (
            <View
              key={theme.id}
              style={{ marginTop: index > 0 ? spacing[3] : 0 }}
            >
              <SettingsItem
                icon={theme.icon}
                label={theme.label}
                onPress={() => handleThemeSelect(theme.id)}
                value={
                  currentTheme === theme.id ? (
                    <Check size={20} color={colors.primary} />
                  ) : undefined
                }
              />
            </View>
          ))}
        </SettingsSection>
      </ScrollView>
    </SafeAreaView>
  );
}
