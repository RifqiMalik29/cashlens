import { useColors } from "@hooks/useColors";
import { type Category } from "@types";
import { formatCurrency } from "@utils/formatCurrency";
import { TouchableOpacity, View } from "react-native";

import { Card } from "../ui/Card";
import { Typography } from "../ui/Typography";
import { ProgressBar } from "./ProgressBar";

interface BudgetCardProps {
  category: Category;
  budgetAmount: number;
  spentAmount: number;
  currency: string;
  period: string;
  onPress?: () => void;
}

export function BudgetCard({
  category,
  budgetAmount,
  spentAmount,
  currency,
  period,
  onPress
}: BudgetCardProps) {
  const colors = useColors();
  const progress = budgetAmount > 0 ? (spentAmount / budgetAmount) * 100 : 0;
  const remaining = budgetAmount - spentAmount;
  const isExceeded = remaining < 0;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card className="mx-4 mb-3">
        <View className="flex-row items-center mb-3">
          <View
            className="w-12 h-12 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: category.color }}
          >
            <Typography variant="body" weight="bold" color="#FFFFFF">
              {category.name.charAt(0)}
            </Typography>
          </View>

          <View className="flex-1">
            <Typography variant="body" weight="semibold" numberOfLines={1}>
              {category.name}
            </Typography>
            <Typography variant="caption" color={colors.textSecondary}>
              {period}
            </Typography>
          </View>

          {isExceeded && (
            <View className="bg-red-100 px-2 py-1 rounded-full">
              <Typography variant="caption" weight="semibold" color="#EF4444">
                Lewat
              </Typography>
            </View>
          )}
        </View>

        <ProgressBar progress={progress} />

        <View className="flex-row justify-between mt-3">
          <View>
            <Typography variant="caption" color={colors.textSecondary}>
              Terpakai
            </Typography>
            <Typography
              variant="body"
              weight="semibold"
              color={isExceeded ? "#EF4444" : colors.textPrimary}
            >
              {formatCurrency(spentAmount, currency)}
            </Typography>
          </View>

          <View className="items-end">
            <Typography variant="caption" color={colors.textSecondary}>
              Sisa
            </Typography>
            <Typography
              variant="body"
              weight="semibold"
              color={isExceeded ? "#EF4444" : "#10B981"}
            >
              {remaining >= 0
                ? formatCurrency(remaining, currency)
                : formatCurrency(Math.abs(remaining), currency)}
            </Typography>
          </View>
        </View>

        <View className="flex-row justify-between mt-2">
          <Typography variant="caption" color={colors.textSecondary}>
            {formatCurrency(budgetAmount, currency)}
          </Typography>
          <Typography variant="caption" color={colors.textSecondary}>
            {Math.round(progress)}%
          </Typography>
        </View>
      </Card>
    </TouchableOpacity>
  );
}
