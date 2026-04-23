import { Button, Card, Typography } from "@components/ui";
import { useColors } from "@hooks/useColors";
import * as Sentry from "@sentry/react-native";
import { AlertTriangle } from "lucide-react-native";
import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ErrorBackground = ({ children }: { children: ReactNode }) => {
  const colors = useColors();
  return (
    <SafeAreaView
      className="flex-1 justify-center px-6"
      style={{ backgroundColor: colors.background }}
    >
      {children}
    </SafeAreaView>
  );
};

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to Sentry for production monitoring
    Sentry.captureException(error, {
      extra: {
        componentStack: errorInfo.componentStack
      }
    });

    // Log to console in development
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Render custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Render default error UI
      return (
        <ErrorBackground>
          <Card className="items-center py-8">
            <View
              className="w-20 h-20 rounded-full items-center justify-center mb-6"
              style={{ backgroundColor: "#FED7AA" }}
            >
              <AlertTriangle size={40} color="#f97316" />
            </View>
            <Typography variant="h3" weight="bold" className="text-center mb-2">
              Oops! Terjadi Kesalahan
            </Typography>
            <Typography
              variant="body"
              color="#9CA3AF"
              className="text-center mb-6"
            >
              Maaf, terjadi masalah yang tidak terduga. Jangan khawatir, data
              Anda aman.
            </Typography>

            {__DEV__ && this.state.error && (
              <View
                className="p-4 rounded-lg mb-6 w-full"
                style={{ backgroundColor: "#FEE2E2" }}
              >
                <Typography
                  variant="body"
                  color="#EF4444"
                  className="font-mono text-xs"
                >
                  {this.state.error.message}
                </Typography>
              </View>
            )}

            <View className="w-full gap-3">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onPress={this.handleReset}
              >
                Coba Lagi
              </Button>
              <Button
                variant="secondary"
                size="lg"
                fullWidth
                onPress={() => {
                  // Reload the app
                  if (typeof window !== "undefined" && "location" in window) {
                    window.location.reload();
                  }
                }}
              >
                Muat Ulang Aplikasi
              </Button>
            </View>

            <Typography
              variant="body"
              color="#9CA3AF"
              className="text-center mt-6 text-xs"
            >
              Jika masalah terus berlanjut, hubungi dukungan pelanggan.
            </Typography>
          </Card>
        </ErrorBackground>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
