import { spacing } from "@constants/theme";
import { View } from "react-native";

import { DatePickerDay } from "./DatePickerDay";

interface DatePickerGridProps {
  currentMonth: Date;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

function isToday(date: Date): boolean {
  const today = new Date();
  return isSameDay(date, today);
}

export function DatePickerGrid({
  currentMonth,
  selectedDate,
  onDateSelect
}: DatePickerGridProps) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const days: (number | null)[] = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  const rows: (number | null)[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    rows.push(days.slice(i, i + 7));
  }

  return (
    <View>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((day, dayIndex) => {
            if (day === null) {
              return <View key={dayIndex} style={styles.dayCell} />;
            }

            const date = new Date(year, month, day);
            const isSelected = isSameDay(date, selectedDate);
            const isTodayDate = isToday(date);

            return (
              <DatePickerDay
                key={dayIndex}
                day={day}
                date={date}
                isSelected={isSelected}
                isToday={isTodayDate}
                onPress={onDateSelect}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = {
  row: {
    flexDirection: "row" as const,
    marginBottom: spacing[1]
  },
  dayCell: {
    flex: 1,
    height: 44
  }
};
