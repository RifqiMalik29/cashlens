import { useColors } from "@hooks/useColors";
import { useHeader } from "@hooks/useHeader";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

const PRIVACY_POLICY_URL = "https://cashlensweb.vercel.app/privacy/";

export default function PrivacyPolicyScreen() {
  const { t } = useTranslation();
  const colors = useColors();

  useHeader({
    title: t("settings.help.privacyPolicy"),
    statusBarStyle: "dark"
  });

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
      edges={["bottom"]}
    >
      <WebView
        source={{ uri: PRIVACY_POLICY_URL }}
        style={{ flex: 1, backgroundColor: colors.background }}
        startInLoadingState={true}
        renderLoading={() => (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: colors.background,
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
            }}
          >
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}
