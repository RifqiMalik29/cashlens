import { useColors } from "@hooks/useColors";
import { type TransactionType } from "@types";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";

import { Typography } from "../ui/Typography";

interface TypeSelectorProps {
  type: TransactionType;
  onTypeChange: (type: TransactionType) => void;
}

export function TypeSelector({ type, onTypeChange }: TypeSelectorProps) {
  const { t } = useTranslation();
  const colors = useColors();

  return (
    <View
      className="flex-row rounded-lg p-1 mb-6"
      style={{ backgroundColor: colors.surfaceSecondary }}
    >
      <TouchableOpacity
        onPress={() => onTypeChange("expense")}
        className="flex-1 items-center justify-center py-3 rounded-md"
        style={
          type === "expense" ? { backgroundColor: colors.surface } : undefined
        }
        activeOpacity={0.7}
      >
        <Typography
          variant="body"
          weight="semibold"
          color={type === "expense" ? "#EF4444" : colors.textSecondary}
        >
          {t("form.expense")}
        </Typography>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onTypeChange("income")}
        className="flex-1 items-center justify-center py-3 rounded-md"
        style={
          type === "income" ? { backgroundColor: colors.surface } : undefined
        }
        activeOpacity={0.7}
      >
        <Typography
          variant="body"
          weight="semibold"
          color={type === "income" ? "#10B981" : colors.textSecondary}
        >
          {t("form.income")}
        </Typography>
      </TouchableOpacity>
    </View>
  );
}
