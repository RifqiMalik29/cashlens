import { CustomHeader } from "@components/ui";
import { colors, heights, spacing } from "@constants/theme";
import { Tabs } from "expo-router";
import {
  ArrowLeftRight,
  Home,
  PieChart,
  ScanLine,
  Settings
} from "lucide-react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.white,
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
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          headerShown: false,
          tabBarLabel: "Transactions",
          tabBarIcon: ({ color, size }) => (
            <ArrowLeftRight size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="scanner"
        options={{
          headerShown: false,
          tabBarLabel: "Scan",
          tabBarIcon: ({ color, size }) => (
            <ScanLine size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="budget"
        options={{
          headerShown: false,
          tabBarLabel: "Budget",
          tabBarIcon: ({ color, size }) => (
            <PieChart size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          headerShown: false,
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} />
          )
        }}
      />
    </Tabs>
  );
}
