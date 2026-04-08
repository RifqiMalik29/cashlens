import { Typography } from "@components/ui/Typography";
import { colors } from "@constants/theme";
import { CreditCard } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

export function DraftEmptyState() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center mt-20 px-10">
      <CreditCard size={64} color={colors.border} />
      <Typography variant="h3" weight="bold" className="mt-4 text-center">
        {t("drafts.emptyTitle")}
      </Typography>
      <Typography color={colors.textSecondary} className="text-center mt-2">
        {t("drafts.emptyDesc")}
      </Typography>
    </View>
  );
}
