import { useNavigation } from "expo-router";
import {
  setStatusBarBackgroundColor,
  setStatusBarStyle
} from "expo-status-bar";
import type React from "react";
import { useLayoutEffect } from "react";
import { type ColorValue } from "react-native";

interface HeaderOptions {
  title?: string;
  rightElement?: React.ReactNode;
  statusBarStyle?: "light" | "dark" | "auto";
  statusBarColor?: ColorValue;
  showHeader?: boolean;
}

export function useHeader({
  title,
  rightElement,
  statusBarStyle = "dark",
  statusBarColor,
  showHeader = true
}: HeaderOptions) {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    setStatusBarStyle(statusBarStyle);
    if (statusBarColor) {
      setStatusBarBackgroundColor(statusBarColor);
    }
    navigation.setOptions({
      title: showHeader ? title : "",
      headerShown: showHeader,
      headerRight:
        showHeader && rightElement !== undefined
          ? () => rightElement
          : undefined
    });
  }, [
    navigation,
    title,
    rightElement,
    statusBarStyle,
    statusBarColor,
    showHeader
  ]);
}
