import { Card } from "@components/ui/Card";
import { Typography } from "@components/ui/Typography";
import { colors } from "@constants/theme";
import { type SupportedApp } from "@stores/useNotificationStore";
import { Check, Smartphone } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";

interface AppSelectorListProps {
  supportedApps: SupportedApp[];
  enabledPackages: string[];
  onTogglePackage: (packageName: string) => void;
  selectAppsTitle: string;
  selectAppsDesc: string;
}

export function AppSelectorList({
  supportedApps,
  enabledPackages,
  onTogglePackage,
  selectAppsTitle,
  selectAppsDesc
}: AppSelectorListProps) {
  return (
    <View className="mb-8">
      <Typography
        variant="caption"
        weight="bold"
        color={colors.textSecondary}
        className="mb-2 uppercase tracking-wider"
      >
        {selectAppsTitle}
      </Typography>
      <Typography
        variant="caption"
        color={colors.textSecondary}
        className="mb-4"
      >
        {selectAppsDesc}
      </Typography>

      <View className="gap-y-3">
        {supportedApps.map((app: SupportedApp) => {
          const isEnabled = enabledPackages.includes(app.packageName);
          return (
            <TouchableOpacity
              key={app.id}
              onPress={() => onTogglePackage(app.packageName)}
              activeOpacity={0.7}
            >
              <Card className="p-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3">
                      <Smartphone size={20} color={colors.textPrimary} />
                    </View>
                    <Typography variant="body" weight="medium">
                      {app.name}
                    </Typography>
                  </View>
                  <View
                    className={`w-6 h-6 rounded-md items-center justify-center border ${
                      isEnabled
                        ? "bg-primary border-primary"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    {isEnabled && <Check size={16} color="#FFFFFF" />}
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
