import { useCallback, useState } from "react";

import { DatePickerModal } from "./DatePickerModal";

interface DatePickerProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function DatePicker({ selectedDate, onDateSelect }: DatePickerProps) {
  const [visible, setVisible] = useState(false);

  const handleClose = useCallback(() => {
    setVisible(false);
  }, []);

  const handleDateSelect = useCallback(
    (date: Date) => {
      onDateSelect(date);
      handleClose();
    },
    [onDateSelect, handleClose]
  );

  return (
    <DatePickerModal
      visible={visible}
      selectedDate={selectedDate}
      onDateSelect={handleDateSelect}
      onClose={handleClose}
    />
  );
}

export { DatePickerContent } from "./DatePickerContent";
export { DatePickerDay } from "./DatePickerDay";
export { DatePickerGrid } from "./DatePickerGrid";
export { DatePickerModal } from "./DatePickerModal";
