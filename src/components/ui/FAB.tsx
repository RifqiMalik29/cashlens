import { useColors } from "@hooks/useColors";
import { Plus } from "lucide-react-native";
import { TouchableOpacity } from "react-native";

interface FABProps {
  onPress: () => void;
}

export function FAB({ onPress }: FABProps) {
  const colors = useColors();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        position: "absolute",
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4
      }}
    >
      <Plus size={24} color="#FFFFFF" />
    </TouchableOpacity>
  );
}
