import { Calendar } from "lucide-react-native";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { DatePicker } from "../ui/DatePicker";
import { Typography } from "../ui/Typography";

interface BudgetDateInputProps {
  startDate: string;
  setStartDate: (value: string) => void;
}

export function BudgetDateInput({
  startDate,
  setStartDate
}: BudgetDateInputProps) {
  const [showPicker, setShowPicker] = useState(false);

  const dateObj = new Date(startDate);
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
    setStartDate(newDate.toISOString().split("T")[0]);
    setShowPicker(false);
  };

  // Calculate min/max based on period
  const minDate = new Date();
  minDate.setHours(0, 0, 0, 0);

  return (
    <View>
      <DatePicker
        visible={showPicker}
        selectedDate={dateObj}
        onDateSelect={handleDateSelect}
        onClose={handleClosePicker}
        minDate={minDate}
      />
      <TouchableOpacity
        className="flex-row items-center justify-between bg-white border border-border rounded-lg px-4 py-3"
        activeOpacity={0.7}
        onPress={handleOpenPicker}
      >
        <View className="flex-row items-center">
          <Calendar size={20} color="#6B7280" style={{ marginRight: 12 }} />
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
