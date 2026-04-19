const IS_DEV = process.env.APP_VARIANT === 'development';

export default {
  expo: {
    name: IS_DEV ? "CashLens (Dev)" : "CashLens",
    slug: "cashlens",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: IS_DEV ? "cashlens-dev" : "cashlens",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: IS_DEV ? "com.cashlens.app.dev" : "com.cashlens.app"
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#4CAF82",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: IS_DEV ? "com.cashlens.app.dev" : "com.cashlens.app",
      permissions: [
        "android.permission.CAMERA",
        "android.permission.RECORD_AUDIO"
      ],
      intentFilters: [
        {
          action: "VIEW",
          autoVerify: true,
          data: [
            {
              scheme: IS_DEV ? "cashlens-dev" : "cashlens",
              pathPrefix: "/auth/confirm"
            }
          ],
          category: [
            "BROWSABLE",
            "DEFAULT"
          ]
        }
      ]
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-camera",
        {
          cameraPermission: "Allow CashLens to access your camera to scan receipts.",
          microphonePermission: "Allow CashLens to access your microphone."
        }
      ],
      [
        "expo-image-picker",
        {
          photosPermission: "Allow CashLens to access your photos to select receipt images."
        }
      ],
      [
        "expo-splash-screen",
        {
          image: "./assets/images/icon.png",
          resizeMode: "cover",
          backgroundColor: "#4CAF82",
          dark: {
            backgroundColor: "#4CAF82"
          }
        }
      ],
      "expo-localization",
      "@sentry/react-native"
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true
    },
    extra: {
      router: {},
      eas: {
        projectId: "e4180a4c-ac51-48b2-971a-1c41d22ddf57"
      },
      baseUrl: IS_DEV
        ? "http://localhost:8080"
        : "https://cashlens-backend-552315397645.us-central1.run.app"
    }
  }
};
