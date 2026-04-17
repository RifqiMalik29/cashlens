import { Typography } from "@components/ui/Typography";
import { colors } from "@constants/theme";
import { Brain, Cpu, Eye, Sparkles } from "lucide-react-native";
import React from "react";
import { ActivityIndicator, View } from "react-native";

interface AIProcessingIndicatorProps {
  status: string;
  method?: "local_ocr" | "gemini_text" | "gemini_vision";
}

export function AIProcessingIndicator({
  status,
  method
}: AIProcessingIndicatorProps) {
  const getIcon = () => {
    switch (method) {
      case "local_ocr":
        return <Cpu size={24} color={colors.primary} />;
      case "gemini_text":
        return <Brain size={24} color="#8B5CF6" />;
      case "gemini_vision":
        return <Eye size={24} color="#F59E0B" />;
      default:
        return <Sparkles size={24} color={colors.primary} />;
    }
  };

  return (
    <View className="absolute inset-0 items-center justify-center bg-black/60 z-50">
      <View className="bg-white p-6 rounded-2xl items-center shadow-lg w-[80%]">
        <View className="mb-4 p-3 rounded-full bg-gray-50">{getIcon()}</View>
        <ActivityIndicator
          color={colors.primary}
          size="large"
          className="mb-4"
        />
        <Typography variant="body" weight="bold" className="text-center">
          {status}
        </Typography>
        {method === "gemini_vision" && (
          <View className="mt-2 px-3 py-1 bg-amber-100 rounded-full">
            <Typography variant="caption" weight="bold" color="#D97706">
              VISION AI PRO
            </Typography>
          </View>
        )}
      </View>
    </View>
  );
}
