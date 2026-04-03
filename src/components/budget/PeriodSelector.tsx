import { TouchableOpacity, View } from "react-native";

import { Typography } from "@/components/ui/Typography";
import { spacing } from "@/constants/theme";

type Period = "weekly" | "monthly" | "yearly";

interface PeriodOption {
  value: Period;
  label: string;
}

interface PeriodSelectorProps {
  selectedPeriod: Period;
  onSelectPeriod: (period: Period) => void;
}

const PERIOD_OPTIONS: PeriodOption[] = [
  { value: "weekly", label: "Mingguan" },
  { value: "monthly", label: "Bulanan" },
  { value: "yearly", label: "Tahunan" }
];

export function PeriodSelector({
  selectedPeriod,
  onSelectPeriod
}: PeriodSelectorProps) {
  return (
    <View style={{ marginTop: spacing[5] }}>
      <Typography
        variant="label"
        weight="medium"
        color="#6B7280"
        style={{ marginBottom: spacing[2] }}
      >
        Periode
      </Typography>
      <View className="flex-row rounded-lg bg-surface-secondary p-1">
        {PERIOD_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            onPress={() => onSelectPeriod(option.value)}
            className={`flex-1 items-center justify-center py-3 rounded-md ${
              selectedPeriod === option.value ? "bg-white" : ""
            }`}
          >
            <Typography
              variant="caption"
              weight={selectedPeriod === option.value ? "semibold" : "regular"}
              color={selectedPeriod === option.value ? "#4CAF82" : "#6B7280"}
            >
              {option.label}
            </Typography>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
