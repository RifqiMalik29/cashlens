import { useColors } from "@hooks/useColors";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, TouchableOpacity, View } from "react-native";

import { PickerColumn } from "./PickerColumn";
import { Typography } from "./Typography";

interface DatePickerProps {
  visible: boolean;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onClose: () => void;
  minDate?: Date;
  maxDate?: Date;
}

export function DatePicker({
  visible,
  selectedDate,
  onDateSelect,
  onClose,
  minDate,
  maxDate
}: DatePickerProps) {
  const { t } = useTranslation();
  const colors = useColors();
  const today = useMemo(() => new Date(), []);
  const [year, setYear] = useState(selectedDate.getFullYear());
  const [month, setMonth] = useState(selectedDate.getMonth());
  const [day, setDay] = useState(selectedDate.getDate());

  const months = t("datePicker.months", { returnObjects: true }) as string[];

  const years = useMemo(() => {
    const start = minDate ? minDate.getFullYear() : today.getFullYear() - 10;
    const end = maxDate ? maxDate.getFullYear() : today.getFullYear() + 5;
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [minDate, maxDate, today]);

  const days = useMemo(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const list = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    if (
      minDate &&
      year === minDate.getFullYear() &&
      month === minDate.getMonth()
    )
      return list.filter((d) => d >= minDate.getDate());
    if (
      maxDate &&
      year === maxDate.getFullYear() &&
      month === maxDate.getMonth()
    )
      return list.filter((d) => d <= maxDate.getDate());
    return list;
  }, [year, month, minDate, maxDate]);

  const handleConfirm = () => {
    onDateSelect(new Date(year, month, day, 12, 0, 0));
  };

  const handleReset = () => {
    setYear(selectedDate.getFullYear());
    setMonth(selectedDate.getMonth());
    setDay(selectedDate.getDate());
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity
        className="flex-1 bg-black/40 justify-center items-center px-6"
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          className="rounded-2xl p-6 w-full"
          style={{ backgroundColor: colors.surface, maxHeight: 400 }}
        >
          <View className="flex-row justify-between items-center mb-4">
            <Typography variant="h3" weight="semibold">
              {t("datePicker.title")}
            </Typography>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <Typography
                variant="body"
                weight="medium"
                color={colors.textSecondary}
              >
                {t("datePicker.close")}
              </Typography>
            </TouchableOpacity>
          </View>

          <View className="flex-row gap-4 mb-6">
            <PickerColumn
              data={years}
              value={year}
              onChange={setYear}
              renderLabel={String}
              colors={colors}
            />
            <PickerColumn<string>
              data={months}
              value={months[month]}
              onChange={(m) => setMonth(months.indexOf(m))}
              renderLabel={(m) => m}
              colors={colors}
            />
            <PickerColumn
              data={days}
              value={day}
              onChange={setDay}
              renderLabel={String}
              colors={colors}
            />
          </View>

          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 py-3 rounded-xl items-center border"
              style={{ borderColor: colors.primary }}
              onPress={handleReset}
              activeOpacity={0.8}
            >
              <Typography
                variant="body"
                weight="semibold"
                color={colors.primary}
              >
                {t("datePicker.reset")}
              </Typography>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 py-3 rounded-xl items-center"
              style={{ backgroundColor: colors.primary }}
              onPress={handleConfirm}
              activeOpacity={0.8}
            >
              <Typography variant="body" weight="semibold" color="#FFFFFF">
                {t("datePicker.confirm")}
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
