import {
  BookOpen,
  Briefcase,
  Car,
  FileText,
  Gift,
  Heart,
  Home,
  Laptop,
  MoreHorizontal,
  Music,
  PiggyBank,
  Plane,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  UtensilsCrossed,
  Wallet
} from "lucide-react-native";
import { type ComponentType } from "react";

export const ICON_MAP: Record<
  string,
  ComponentType<{ size: number; color: string }>
> = {
  UtensilsCrossed,
  Car,
  ShoppingBag,
  FileText,
  Heart,
  Music,
  BookOpen,
  Plane,
  Home,
  Sparkles,
  Gift,
  TrendingUp,
  PiggyBank,
  Briefcase,
  MoreHorizontal,
  Wallet,
  Laptop,
  "briefcase-outline": Briefcase,
  "laptop-outline": Laptop,
  "trending-up-outline": TrendingUp,
  "restaurant-outline": UtensilsCrossed,
  "car-outline": Car,
  "bag-handle-outline": ShoppingBag,
  "game-controller-outline": Music,
  "receipt-outline": FileText,
  "medkit-outline": Heart,
  "school-outline": BookOpen
};
