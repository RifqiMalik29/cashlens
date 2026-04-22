import { useColors } from "@hooks/useColors";
import { Stack } from "expo-router";

export default function BudgetStack() {
  const colors = useColors();
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: colors.background }
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Anggaran",
          headerShown: false
        }}
      />
    </Stack>
  );
}
