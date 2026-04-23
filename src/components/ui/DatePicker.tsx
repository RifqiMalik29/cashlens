import { useColors } from "@hooks/useColors";
import { useMemo, useState } from "react";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";

interface DatePickerProps {
  visible: boolean;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onClose: () => void;
  minDate?: Date;
  maxDate?: Date;
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des"
];

const ITEM_HEIGHT = 44;

function PickerColumn<T extends string | number>({
  data,
  value,
  onChange,
  renderLabel
}: {
  data: T[];
  value: T;
  onChange: (v: T) => void;
  renderLabel: (v: T) => string;
}) {
  const index = data.indexOf(value);
  return (
    <View className="flex-1">
      <View className="h-40">
        <FlatList
          data={data}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => onChange(item)}
              className="items-center py-3 rounded-lg"
              style={{
                backgroundColor: value === item ? "#E8F5EE" : "transparent"
              }}
            >
              <Text
                className="text-base"
                style={{
                  color: value === item ? "#4CAF82" : "#374151",
                  fontWeight: value === item ? "600" : "400"
                }}
              >
                {renderLabel(item)}
              </Text>
            </TouchableOpacity>
          )}
          getItemLayout={(_, i) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * i,
            index: i
          })}
          initialScrollIndex={Math.max(0, index)}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

export function DatePicker({
  visible,
  selectedDate,
  onDateSelect,
  onClose,
  minDate,
  maxDate
}: DatePickerProps) {
  const colors = useColors();
  const today = useMemo(() => new Date(), []);
  const [year, setYear] = useState(selectedDate.getFullYear());
  const [month, setMonth] = useState(selectedDate.getMonth());
  const [day, setDay] = useState(selectedDate.getDate());

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
            <Text className="text-lg font-semibold text-gray-900">
              Pilih Tanggal
            </Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <Text className="text-base text-gray-500 font-medium">Tutup</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row gap-4 mb-6">
            <PickerColumn
              data={years}
              value={year}
              onChange={setYear}
              renderLabel={String}
            />
            <PickerColumn<string>
              data={MONTHS}
              value={MONTHS[month]}
              onChange={(m) => setMonth(MONTHS.indexOf(m))}
              renderLabel={(m) => m}
            />
            <PickerColumn
              data={days}
              value={day}
              onChange={setDay}
              renderLabel={String}
            />
          </View>

          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 border border-primary py-3 rounded-xl items-center"
              onPress={handleReset}
              activeOpacity={0.8}
            >
              <Text className="text-primary font-semibold text-base">
                Reset
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-primary py-3 rounded-xl items-center"
              onPress={handleConfirm}
              activeOpacity={0.8}
            >
              <Text className="text-white font-semibold text-base">
                Konfirmasi
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
