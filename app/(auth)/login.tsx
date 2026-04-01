import { StyleSheet, View } from "react-native";

import { Typography } from "@/components/ui";
import { colors } from "@/constants/theme";

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Typography variant="h2" weight="bold">
        Login
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center"
  }
});
