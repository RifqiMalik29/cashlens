import { colors, darkColors } from "@constants/theme";
import { useColorScheme } from "nativewind";

export function useColors() {
  const { colorScheme } = useColorScheme();
  return colorScheme === "dark" ? darkColors : colors;
}
