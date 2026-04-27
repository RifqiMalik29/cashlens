import {
  BottomSheet,
  type BottomSheetHandle
} from "@components/ui/BottomSheet";
import { Button } from "@components/ui/Button";
import { ColorPicker } from "@components/ui/ColorPicker";
import { IconPicker } from "@components/ui/IconPicker";
import { Typography } from "@components/ui/Typography";
import { fontSizes, heights, spacing } from "@constants/theme";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { useColors } from "@hooks/useColors";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";

interface AddCategorySheetProps {
  isVisible: boolean;
  name: string;
  type: "expense" | "income";
  color: string;
  icon: string;
  isLoading: boolean;
  error: string | null;
  onNameChange: (value: string) => void;
  onTypeChange: (value: "expense" | "income") => void;
  onColorChange: (value: string) => void;
  onIconChange: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export function AddCategorySheet({
  isVisible,
  name,
  type,
  color,
  icon,
  isLoading,
  error,
  onNameChange,
  onTypeChange,
  onColorChange,
  onIconChange,
  onSubmit,
  onClose
}: AddCategorySheetProps) {
  const { t } = useTranslation();
  const colors = useColors();
  const sheetRef = useRef<BottomSheetHandle>(null);

  useEffect(() => {
    if (isVisible) {
      sheetRef.current?.open();
    } else {
      sheetRef.current?.close();
    }
  }, [isVisible]);

  return (
    <BottomSheet ref={sheetRef} onClose={onClose}>
      <Typography
        variant="h3"
        weight="bold"
        color={colors.textPrimary}
        style={{ marginBottom: spacing[5] }}
      >
        {t("categories.newCategory")}
      </Typography>

      <View className="gap-1" style={{ marginBottom: spacing[4] }}>
        <Typography
          variant="label"
          weight="medium"
          color={colors.textSecondary}
        >
          {t("form.category")}
        </Typography>
        <View
          className="flex-row items-center px-3 rounded-md border border-border"
          style={{ backgroundColor: colors.surface, height: heights.input }}
        >
          <BottomSheetTextInput
            placeholder={t("categories.addCustom")}
            placeholderTextColor={colors.textSecondary}
            value={name}
            onChangeText={onNameChange}
            autoCapitalize="words"
            style={{
              flex: 1,
              fontSize: fontSizes.base,
              color: colors.textPrimary,
              paddingVertical: 0
            }}
          />
        </View>
      </View>

      <View style={{ marginBottom: spacing[4] }}>
        <Typography
          variant="label"
          weight="medium"
          color={colors.textSecondary}
          style={{ marginBottom: spacing[2] }}
        >
          {t("form.type")}
        </Typography>
        <View
          className="flex-row rounded-lg p-1"
          style={{ backgroundColor: colors.surfaceSecondary }}
        >
          <TouchableOpacity
            onPress={() => onTypeChange("expense")}
            className="flex-1 items-center justify-center py-2 rounded-md"
            style={
              type === "expense"
                ? { backgroundColor: colors.surface }
                : undefined
            }
          >
            <Typography
              variant="caption"
              weight={type === "expense" ? "semibold" : "regular"}
              color={type === "expense" ? colors.error : colors.textSecondary}
            >
              {t("categories.expense")}
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onTypeChange("income")}
            className="flex-1 items-center justify-center py-2 rounded-md"
            style={
              type === "income"
                ? { backgroundColor: colors.surface }
                : undefined
            }
          >
            <Typography
              variant="caption"
              weight={type === "income" ? "semibold" : "regular"}
              color={type === "income" ? colors.success : colors.textSecondary}
            >
              {t("categories.income")}
            </Typography>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ marginBottom: spacing[4] }}>
        <Typography
          variant="label"
          weight="medium"
          color={colors.textSecondary}
          style={{ marginBottom: spacing[2] }}
        >
          Warna
        </Typography>
        <ColorPicker value={color} onChange={onColorChange} />
      </View>

      <View style={{ marginBottom: spacing[4] }}>
        <Typography
          variant="label"
          weight="medium"
          color={colors.textSecondary}
          style={{ marginBottom: spacing[2] }}
        >
          Ikon
        </Typography>
        <IconPicker value={icon} color={color} onChange={onIconChange} />
      </View>

      {error && (
        <Typography
          variant="caption"
          color={colors.error}
          style={{ marginTop: spacing[2] }}
        >
          {error}
        </Typography>
      )}

      <View style={{ marginTop: spacing[5], gap: spacing[3] }}>
        <Button onPress={onSubmit} loading={isLoading} fullWidth>
          {t("common.save")}
        </Button>
        <Button onPress={onClose} variant="secondary" fullWidth>
          {t("common.cancel")}
        </Button>
      </View>
    </BottomSheet>
  );
}
