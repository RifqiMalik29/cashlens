import { spacing } from "@constants/theme";
import { useColors } from "@hooks/useColors";
import { Calendar } from "lucide-react-native";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { DatePicker } from "../ui/DatePicker";
import { Typography } from "../ui/Typography";

interface DateInputProps {
  date: string;
  setDate: (value: string) => void;
}

export function DateInput({ date, setDate }: DateInputProps) {
  const colors = useColors();
  const [showPicker, setShowPicker] = useState(false);

  const dateObj = new Date(date);
  const displayDate = dateObj.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const handleOpenPicker = () => {
    setShowPicker(true);
  };

  const handleClosePicker = () => {
    setShowPicker(false);
  };

  const handleDateSelect = (newDate: Date) => {
    const timeStr = dateObj.toTimeString().split(" ")[0].slice(0, 5);
    setDate(newDate.toISOString().split("T")[0] + "T" + timeStr);
    setShowPicker(false);
  };

  return (
    <View>
      <DatePicker
        visible={showPicker}
        selectedDate={dateObj}
        onDateSelect={handleDateSelect}
        onClose={handleClosePicker}
      />
      <TouchableOpacity
        className="flex-row items-center justify-between border border-border rounded-lg px-4 py-3"
        style={{ backgroundColor: colors.surface }}
        activeOpacity={0.7}
        onPress={handleOpenPicker}
      >
        <View className="flex-row items-center">
          <Calendar
            size={20}
            color={colors.textSecondary}
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
    </View>
  );
}
