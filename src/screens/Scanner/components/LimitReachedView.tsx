import { Button, Typography } from "@components/ui";
import { useColors } from "@hooks/useColors";
import { ShieldAlert } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface LimitReachedViewProps {
  onUpgrade: () => void;
}

export function LimitReachedView({ onUpgrade }: LimitReachedViewProps) {
  const colors = useColors();
  const { t } = useTranslation();
  return (
    <SafeAreaView
      className="flex-1 justify-center items-center p-8"
      style={{ backgroundColor: colors.background }}
    >
      <View className="w-full items-center">
        <ShieldAlert size={48} color="#F59E0B" />
        <Typography variant="h3" weight="bold" className="mt-4 text-center">
          {t("paywall.title")}
        </Typography>
        <Typography variant="body" className="mt-2 text-center text-gray-500">
          {t("paywall.message")}
        </Typography>
        <View className="mt-8 w-full">
          <Button fullWidth variant="primary" onPress={onUpgrade}>
            {t("paywall.upgrade")}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
