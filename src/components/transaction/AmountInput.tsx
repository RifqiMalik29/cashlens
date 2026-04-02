import { TouchableOpacity, View } from "react-native";

import { Typography } from "../ui/Typography";

interface AmountInputProps {
  amount: string;
  setAmount: (value: string) => void;
  type: "income" | "expense";
  baseCurrency: string;
}

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "⌫"];

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
      <View className="flex-row items-baseline mb-2">
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

      <View className="flex-row flex-wrap justify-center gap-2">
        {KEYS.map((key) => (
          <TouchableOpacity
            key={key}
            onPress={() => handlePress(key)}
            className="items-center justify-center bg-white rounded-lg border border-border"
            style={{ width: 64, height: 52 }}
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
    </View>
  );
}
