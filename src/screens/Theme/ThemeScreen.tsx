import { SettingsItem, SettingsSection } from "@components/settings";
import { spacing } from "@constants/theme";
import { useColors } from "@hooks/useColors";
import { Check, Monitor, Moon, Sun } from "lucide-react-native";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useThemeScreen } from "./useThemeScreen";

export default function ThemeScreen() {
  const colors = useColors();
  const { t, themes, currentTheme, handleThemeSelect } = useThemeScreen();

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
      edges={["bottom"]}
    >
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
                icon={
                  theme.id === "light" ? (
                    <Sun size={20} color={colors.primary} />
                  ) : theme.id === "dark" ? (
                    <Moon size={20} color={colors.primary} />
                  ) : (
                    <Monitor size={20} color={colors.primary} />
                  )
                }
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
