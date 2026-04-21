import { Typography } from "@components/ui/Typography";
import { colors } from "@constants/theme";
import { TouchableOpacity, View } from "react-native";

export type PlanCardProps = {
  plan: "annual" | "monthly";
  selected: boolean;
  onPress: () => void;
  price: string | undefined;
  label: string;
  sublabel: string;
  badge?: string | null;
  perMonth?: string | null;
};

export const PlanCard = ({
  plan,
  selected,
  onPress,
  price,
  label,
  sublabel,
  badge,
  perMonth
}: PlanCardProps) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    className="flex-1 rounded-xl p-4"
    style={{
      backgroundColor: colors.surface,
      borderWidth: 2,
      borderColor: selected ? colors.primary : colors.border
    }}
  >
    {badge != null ? (
      <View
        className="rounded-full px-2 py-0.5 mb-2 self-start"
        style={{ backgroundColor: colors.primaryLight }}
      >
        <Typography variant="caption" weight="bold" color={colors.primary}>
          {badge}
        </Typography>
      </View>
    ) : (
      <View style={{ height: 24, marginBottom: 2 }} />
    )}
    <Typography variant="body" weight="semibold" color={colors.textPrimary}>
      {label}
    </Typography>
    <Typography
      variant="h4"
      weight="bold"
      color={plan === "annual" ? colors.primary : colors.textPrimary}
    >
      {price}
    </Typography>
    <Typography variant="caption" color={colors.textSecondary}>
      {sublabel}
    </Typography>
    {perMonth && (
      <Typography
        variant="caption"
        color={colors.textSecondary}
        style={{ marginTop: 2 }}
      >
        {perMonth}
      </Typography>
    )}
  </TouchableOpacity>
);
