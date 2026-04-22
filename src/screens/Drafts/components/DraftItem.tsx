import { Card } from "@components/ui/Card";
import { Typography } from "@components/ui/Typography";
import { useColors } from "@hooks/useColors";
import { type DraftTransaction } from "@stores/useDraftStore";
import { formatCurrency } from "@utils/formatCurrency";
import { ArrowDownLeft, ArrowUpRight, Check, X } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";

interface DraftItemProps {
  item: DraftTransaction;
  onConfirm: (draft: DraftTransaction) => void;
  onDismiss: (id: string) => void;
  onEdit: (draft: DraftTransaction) => void;
}

export function DraftItem({
  item,
  onConfirm,
  onDismiss,
  onEdit
}: DraftItemProps) {
  const { t } = useTranslation();
  const colors = useColors();

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={() => onEdit(item)}>
      <Card className="mb-4 p-4">
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-row items-center">
            <View
              className="p-2 rounded-full mr-3"
              style={{
                backgroundColor: item.type === "expense" ? "#FEE2E2" : "#D1FAE5"
              }}
            >
              {item.type === "expense" ? (
                <ArrowUpRight size={20} color={colors.error} />
              ) : (
                <ArrowDownLeft size={20} color={colors.success} />
              )}
            </View>
            <View>
              <Typography variant="body" weight="bold">
                {item.source}
              </Typography>
              <Typography variant="caption" color={colors.textSecondary}>
                {new Date(item.date).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </Typography>
            </View>
          </View>
          <Typography
            variant="h3"
            weight="bold"
            color={item.type === "expense" ? colors.error : colors.success}
          >
            {item.type === "expense" ? "-" : "+"}
            {formatCurrency(item.amount, item.currency)}
          </Typography>
        </View>

        <Typography variant="body" weight="medium" color={colors.textSecondary}>
          {item.description.includes(".")
            ? t(item.description, item.descriptionParams)
            : item.description}
        </Typography>

        <View className="flex-row gap-x-3 mt-4">
          <TouchableOpacity
            onPress={() => onConfirm(item)}
            className="flex-1 flex-row items-center justify-center py-2 rounded-lg bg-primary"
          >
            <Check size={18} color="#FFFFFF" className="mr-2" />
            <Typography color="#FFFFFF" weight="bold">
              {t("drafts.confirm")}
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onDismiss(item.id)}
            className="flex-row items-center justify-center px-4 py-2 rounded-lg border border-gray-200"
          >
            <X size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </Card>
    </TouchableOpacity>
  );
}
