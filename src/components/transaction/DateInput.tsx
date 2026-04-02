import { Calendar } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";

import { spacing } from "@/constants/theme";

import { Typography } from "../ui/Typography";

interface DateInputProps {
  date: string;
  setDate: (value: string) => void;
}

export function DateInput({ date, setDate }: DateInputProps) {
  const dateObj = new Date(date);
  const displayDate = dateObj.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const handlePress = () => {
    const now = new Date();
    const newDate = new Date(dateObj);
    newDate.setDate(dateObj.getDate() + 1);
    if (newDate > now) {
      setDate(
        now.toISOString().split("T")[0] +
          "T" +
          now.toTimeString().split(" ")[0].slice(0, 5)
      );
    } else {
      setDate(
        newDate.toISOString().split("T")[0] +
          "T" +
          dateObj.toTimeString().split(" ")[0].slice(0, 5)
      );
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="flex-row items-center justify-between bg-white border border-border rounded-lg px-4 py-3"
      activeOpacity={0.7}
    >
      <View className="flex-row items-center">
        <Calendar
          size={20}
          color="#6B7280"
          style={{ marginRight: spacing[3] }}
        />
        <Typography variant="body" weight="medium">
          {displayDate}
        </Typography>
      </View>
      <Typography variant="caption" color="#4CAF82" weight="medium">
        Ubah
      </Typography>
    </TouchableOpacity>
  );
}
