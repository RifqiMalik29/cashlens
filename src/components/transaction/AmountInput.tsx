import { TouchableOpacity, View } from "react-native";

import { Typography } from "../ui/Typography";

interface AmountInputProps {
  amount: string;
  setAmount: (value: string) => void;
  type: "income" | "expense";
  baseCurrency: string;
}

export function AmountInput({
  amount,
  setAmount,
  type,
  baseCurrency
}: AmountInputProps) {
  const handlePress = (key: string) => {
    if (key === "⌫") {
      setAmount(amount.slice(0, -1));
    } else if (key === "." && amount.includes(".")) {
      return;
    } else {
      setAmount(amount + key);
    }
  };

  const formattedAmount = amount
    ? new Intl.NumberFormat("id-ID", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(parseFloat(amount || "0"))
    : "0";

  const amountColor = type === "expense" ? "#EF4444" : "#10B981";

  return (
    <View className="items-center mb-6">
      <View className="flex-row items-baseline mb-6">
        <Typography variant="h4" weight="medium" color="#6B7280">
          {baseCurrency === "IDR" ? "Rp" : baseCurrency}{" "}
        </Typography>
        <Typography
          variant="h1"
          weight="bold"
          color={amountColor}
          style={{ fontSize: 36 }}
        >
          {formattedAmount}
        </Typography>
      </View>

      <View className="w-full px-4">
        {[
          ["1", "2", "3"],
          ["4", "5", "6"],
          ["7", "8", "9"],
          [".", "0", "⌫"]
        ].map((row, rowIndex) => (
          <View key={rowIndex} className="flex-row justify-between mb-3 gap-3">
            {row.map((key) => (
              <TouchableOpacity
                key={key}
                onPress={() => handlePress(key)}
                className="flex-1 items-center justify-center bg-white rounded-xl border border-border"
                style={{ height: 60 }}
                activeOpacity={0.7}
              >
                <Typography
                  variant="h3"
                  weight="medium"
                  color={key === "⌫" ? "#EF4444" : "#1A1A2E"}
                >
                  {key}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}
