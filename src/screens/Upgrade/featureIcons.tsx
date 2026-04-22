import {
  BadgeCheck,
  Bell,
  FolderOpen,
  Headphones,
  ScanLine
} from "lucide-react-native";
import type { ReactNode } from "react";

export const getFeatureIcons = (primaryColor: string): ReactNode[] => [
  <BadgeCheck key="badge-check" size={18} color={primaryColor} />,
  <ScanLine key="scan-line" size={18} color={primaryColor} />,
  <Bell key="bell" size={18} color={primaryColor} />,
  <FolderOpen key="folder-open" size={18} color={primaryColor} />,
  <Headphones key="headphones" size={18} color={primaryColor} />
];
