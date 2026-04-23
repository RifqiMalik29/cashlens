import { Typography } from "@components/ui/Typography";
import { spacing } from "@constants/theme";
import { useColors } from "@hooks/useColors";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";

type Period = "weekly" | "monthly" | "yearly";

interface PeriodSelectorProps {
  selectedPeriod: Period;
  onSelectPeriod: (period: Period) => void;
}

export function PeriodSelector({
  selectedPeriod,
  onSelectPeriod
}: PeriodSelectorProps) {
  const { t } = useTranslation();
  const colors = useColors();

  const periodOptions: { value: Period; label: string }[] = [
    { value: "weekly", label: t("budget.weekly") },
    { value: "monthly", label: t("budget.monthly") },
    { value: "yearly", label: t("budget.yearly") }
  ];

  return (
    <View style={{ marginTop: spacing[5] }}>
      <Typography
        variant="label"
        weight="medium"
        color={colors.textSecondary}
        style={{ marginBottom: spacing[2] }}
      >
        {t("budget.period")}
      </Typography>
      <View
        className="flex-row rounded-lg p-1"
        style={{ backgroundColor: colors.surfaceSecondary }}
      >
        {periodOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            onPress={() => onSelectPeriod(option.value)}
            className="flex-1 items-center justify-center py-3 rounded-md"
            style={
              selectedPeriod === option.value
                ? { backgroundColor: colors.surface }
                : undefined
            }
          >
            <Typography
              variant="caption"
              weight={selectedPeriod === option.value ? "semibold" : "regular"}
              color={
                selectedPeriod === option.value
                  ? "#4CAF82"
                  : colors.textSecondary
              }
            >
              {option.label}
            </Typography>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
