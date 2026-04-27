import { CustomHeader } from "@components/ui";
import { heights, spacing } from "@constants/theme";
import { useColors } from "@hooks/useColors";
import type { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { Tabs, useRouter } from "expo-router";
import {
  ArrowLeftRight,
  Home,
  PieChart,
  ScanLine,
  Settings
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native";

export default function TabsLayout() {
  const colors = useColors();
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: heights.tabBar,
          paddingBottom: spacing[2]
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500"
        },
        header: ({ options, navigation }) => (
          <CustomHeader
            title={options.title}
            showBack={false}
            onBack={navigation.goBack}
            rightElement={options.headerRight?.({ canGoBack: false })}
          />
        )
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: t("tabs.home"),
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          headerShown: false,
          tabBarLabel: t("tabs.transactions"),
          tabBarIcon: ({ color, size }) => (
            <ArrowLeftRight size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="scanner"
        options={{
          headerShown: false,
          tabBarLabel: t("tabs.scan"),
          tabBarIcon: ({ color, size }) => (
            <ScanLine size={size} color={color} />
          ),
          tabBarButton: ({
            onPress: _onPress,
            ...props
          }: BottomTabBarButtonProps) => (
            <TouchableOpacity
              {...(props as React.ComponentProps<typeof TouchableOpacity>)}
              onPress={() => router.push("/(scanner)")}
            />
          )
        }}
      />
      <Tabs.Screen
        name="budget"
        options={{
          headerShown: false,
          tabBarLabel: t("tabs.budget"),
          tabBarIcon: ({ color, size }) => (
            <PieChart size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          headerShown: false,
          tabBarLabel: t("tabs.settings"),
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} />
          )
        }}
      />
    </Tabs>
  );
}
