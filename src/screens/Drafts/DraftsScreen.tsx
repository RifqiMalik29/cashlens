import { BaseDialog } from "@components/ui/BaseDialog";
import { spacing } from "@constants/theme";
import { type DraftTransaction } from "@stores/useDraftStore";
import { Stack } from "expo-router";
import { FlatList, View } from "react-native";

import { DraftEmptyState, DraftItem } from "./components";
import { useDrafts } from "./useDrafts";

export default function DraftsScreen() {
  const {
    t,
    pendingDrafts,
    handleConfirm,
    handleDismiss,
    handleEdit,
    showSuccessDialog,
    setShowSuccessDialog
  } = useDrafts();

  const renderItem = ({ item }: { item: DraftTransaction }) => (
    <DraftItem
      item={item}
      onConfirm={handleConfirm}
      onDismiss={handleDismiss}
      onEdit={handleEdit}
    />
  );

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen
        options={{
          title: t("drafts.title"),
          headerShown: true
        }}
      />

      <FlatList
        data={pendingDrafts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: spacing[4] }}
        ListEmptyComponent={<DraftEmptyState />}
      />

      <BaseDialog
        isVisible={showSuccessDialog}
        title={t("drafts.successTitle")}
        message={t("drafts.successDesc")}
        type="success"
        primaryButtonText={t("common.done")}
        onPrimaryButtonPress={() => setShowSuccessDialog(false)}
        onClose={() => setShowSuccessDialog(false)}
      />
    </View>
  );
}
