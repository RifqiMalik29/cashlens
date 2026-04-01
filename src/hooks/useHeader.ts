import { useNavigation } from "expo-router";
import { setStatusBarStyle } from "expo-status-bar";
import type React from "react";
import { useLayoutEffect } from "react";

interface HeaderOptions {
  title?: string;
  rightElement?: React.ReactNode;
  statusBarStyle?: "light" | "dark" | "auto";
}

export function useHeader({
  title,
  rightElement,
  statusBarStyle = "dark"
}: HeaderOptions) {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    setStatusBarStyle(statusBarStyle);
    navigation.setOptions({
      title,
      headerRight: rightElement !== undefined ? () => rightElement : undefined
    });
  }, [navigation, title, rightElement, statusBarStyle]);
}
