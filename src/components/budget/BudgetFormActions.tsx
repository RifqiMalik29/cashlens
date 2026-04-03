import { View } from "react-native";

import { Button } from "@/components/ui/Button";
import { spacing } from "@/constants/theme";

interface BudgetFormActionsProps {
  isEditMode: boolean;
  isLoading: boolean;
  error: string | null;
  onSave: () => void;
  onDelete?: () => void;
}

export function BudgetFormActions({
  isEditMode,
  isLoading,
  error,
  onSave,
  onDelete
}: BudgetFormActionsProps) {
  return (
    <>
      {error && (
        <View style={{ marginTop: spacing[4], marginBottom: spacing[4] }}>
          <Button onPress={() => {}} variant="danger" disabled>
            {error}
          </Button>
        </View>
      )}

      <View style={{ gap: spacing[3], marginTop: spacing[6] }}>
        <Button
          onPress={onSave}
          loading={isLoading}
          disabled={isLoading}
          fullWidth
          variant="primary"
          size="lg"
        >
          {isEditMode ? "Simpan Perubahan" : "Buat Anggaran"}
        </Button>

        {isEditMode && onDelete && (
          <Button
            onPress={onDelete}
            loading={isLoading}
            disabled={isLoading}
            fullWidth
            variant="danger"
            size="lg"
          >
            Hapus Anggaran
          </Button>
        )}
      </View>
    </>
  );
}
