import { Typography } from "@components/ui/Typography";
import { useColors } from "@hooks/useColors";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

interface BudgetFormHeaderProps {
  isEditMode: boolean;
}

export function BudgetFormHeader({ isEditMode }: BudgetFormHeaderProps) {
  const { t } = useTranslation();
  const colors = useColors();

  return (
    <View
      className="px-6 pt-[46px] pb-4 flex-row items-center justify-between"
      style={{ backgroundColor: colors.primary }}
    >
      <View>
        <Typography variant="h2" weight="bold" color="#FFFFFF">
          {isEditMode ? t("budget.editBudget") : t("budget.addNewBudget")}
        </Typography>
        <Typography variant="body" color="#FFFFFF">
          {isEditMode ? t("budget.editBudgetDesc") : t("budget.addBudgetDesc")}
        </Typography>
      </View>
    </View>
  );
}
