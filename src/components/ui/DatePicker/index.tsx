import { DatePickerModal } from "./DatePickerModal";

interface DatePickerProps {
  visible: boolean;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onClose: () => void;
}

export function DatePicker({
  visible,
  selectedDate,
  onDateSelect,
  onClose
}: DatePickerProps) {
  return (
    <DatePickerModal
      visible={visible}
      selectedDate={selectedDate}
      onDateSelect={onDateSelect}
      onClose={onClose}
    />
  );
}

export { DatePickerContent } from "./DatePickerContent";
export { DatePickerDay } from "./DatePickerDay";
export { DatePickerGrid } from "./DatePickerGrid";
export { DatePickerModal } from "./DatePickerModal";
