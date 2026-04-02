import { Stack } from "expo-router";

export default function BudgetStack() {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: "#F7FAF8" }
      }}
    >
      <Stack.Screen
        name="add"
        options={{
          title: "Tambah Anggaran",
          headerShown: true
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          title: "Edit Anggaran",
          headerShown: true
        }}
      />
    </Stack>
  );
}
