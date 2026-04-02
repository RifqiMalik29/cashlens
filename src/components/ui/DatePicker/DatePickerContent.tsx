import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useCallback, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { colors, spacing } from "@/constants/theme";

import { Typography } from "../Typography";
import { DatePickerGrid } from "./DatePickerGrid";

interface DatePickerContentProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function DatePickerContent({
  selectedDate,
  onDateSelect
}: DatePickerContentProps) {
  const [currentMonth, setCurrentMonth] = useState(
    new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  );

  const handlePrevMonth = useCallback(() => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  }, [currentMonth]);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  }, [currentMonth]);

  const handleJumpToToday = useCallback(() => {
    const today = new Date();
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    onDateSelect(today);
  }, [onDateSelect]);

  const monthYear = currentMonth.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric"
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
          <ChevronLeft size={24} color={colors.primary} />
        </TouchableOpacity>

        <Typography variant="h3" weight="bold" color={colors.textPrimary}>
          {monthYear}
        </Typography>

        <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
          <ChevronRight size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleJumpToToday} style={styles.todayButton}>
        <Typography variant="caption" weight="semibold" color={colors.primary}>
          Hari Ini
        </Typography>
      </TouchableOpacity>

      <View style={styles.weekdays}>
        {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
          <View key={day} style={styles.weekdayCell}>
            <Typography
              variant="caption"
              weight="medium"
              color={colors.textSecondary}
            >
              {day}
            </Typography>
          </View>
        ))}
      </View>

      <DatePickerGrid
        currentMonth={currentMonth}
        selectedDate={selectedDate}
        onDateSelect={onDateSelect}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing[6],
    paddingTop: spacing[4]
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing[4]
  },
  navButton: {
    padding: spacing[2]
  },
  todayButton: {
    alignSelf: "center",
    marginBottom: spacing[4],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    backgroundColor: colors.primaryLight,
    borderRadius: 16
  },
  weekdays: {
    flexDirection: "row",
    marginBottom: spacing[2]
  },
  weekdayCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: spacing[2]
  }
});
