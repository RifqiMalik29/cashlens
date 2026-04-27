import { Typography } from "@components/ui/Typography";
import { useColors } from "@hooks/useColors";
import { useProtectedRouter } from "@hooks/useProtectedRouter";
import { ChevronLeft } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";

interface BudgetFormHeaderProps {
  isEditMode: boolean;
}

export function BudgetFormHeader({ isEditMode }: BudgetFormHeaderProps) {
  const { t } = useTranslation();
  const colors = useColors();
  const router = useProtectedRouter();

  return (
    <View
      className="px-6 pt-[46px] pb-4 flex-row items-center"
      style={{ backgroundColor: colors.primary }}
    >
      <TouchableOpacity
        onPress={() => router.back()}
        className="w-10 h-10 items-center justify-center -ml-2 mr-2"
        activeOpacity={0.7}
      >
        <ChevronLeft size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <View className="flex-1">
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
