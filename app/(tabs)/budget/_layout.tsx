import { Stack } from "expo-router";

export default function BudgetStack() {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: "#F7FAF8" }
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
