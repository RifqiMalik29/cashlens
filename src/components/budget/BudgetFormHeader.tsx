import { Typography } from "@components/ui/Typography";
import { colors } from "@constants/theme";
import { View } from "react-native";

interface BudgetFormHeaderProps {
  isEditMode: boolean;
}

export function BudgetFormHeader({ isEditMode }: BudgetFormHeaderProps) {
  return (
    <View
      className="px-6 pt-[46px] pb-4 flex-row items-center justify-between"
      style={{ backgroundColor: colors.primary }}
    >
      <View>
        <Typography variant="h2" weight="bold" color="#FFFFFF">
          {isEditMode ? "Ubah Anggaran" : "Tambah Anggaran"}
        </Typography>
        <Typography variant="body" color="#FFFFFF">
          {isEditMode
            ? "Perbarui detail anggaranmu"
            : "Buat anggaran baru untuk kategori tertentu"}
        </Typography>
      </View>
    </View>
  );
}
