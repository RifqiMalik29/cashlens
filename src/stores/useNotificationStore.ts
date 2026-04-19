import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface SupportedApp {
  id: string;
  name: string;
  packageName: string;
  icon: string;
}

export const SUPPORTED_APPS: SupportedApp[] = [
  {
    id: "bca",
    name: "BCA Mobile",
    packageName: "com.bca.mobile",
    icon: "account-balance"
  },
  {
    id: "mybca",
    name: "myBCA",
    packageName: "com.bca.mybca",
    icon: "account-balance"
  },
  {
    id: "gopay",
    name: "GoPay / Gojek",
    packageName: "com.gojek.app",
    icon: "account-balance-wallet"
  },
  {
    id: "jago",
    name: "Bank Jago",
    packageName: "com.jago.digitalbanking",
    icon: "savings"
  },
  {
    id: "ovo",
    name: "OVO",
    packageName: "com.grb.ovo",
    icon: "account-balance-wallet"
  },
  {
    id: "dana",
    name: "DANA",
    packageName: "id.dana",
    icon: "account-balance-wallet"
  },
  {
    id: "mandiri",
    name: "Livin by Mandiri",
    packageName: "com.byond.btpn",
    icon: "account-balance"
  }, // Note: BTPN is placeholder for Livin if package differs
  {
    id: "shopeepay",
    name: "Shopee / ShopeePay",
    packageName: "com.shopee.id",
    icon: "shopping-cart"
  }
];

interface NotificationState {
  // Android Notification Listener
  isFeatureEnabled: boolean;
  enabledPackages: string[];
  setFeatureEnabled: (enabled: boolean) => void;
  togglePackage: (packageName: string) => void;
  isPackageEnabled: (packageName: string) => boolean;

  // Telegram Bot
  isTelegramEnabled: boolean;
  isTelegramLinked: boolean;
  telegramChatId: string | null;
  setTelegramEnabled: (enabled: boolean) => void;
  setTelegramLinked: (linked: boolean, chatId?: string) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      isFeatureEnabled: true,
      enabledPackages: SUPPORTED_APPS.map((app) => app.packageName),
      setFeatureEnabled: (enabled) => set({ isFeatureEnabled: enabled }),
      togglePackage: (packageName) =>
        set((state) => ({
          enabledPackages: state.enabledPackages.includes(packageName)
            ? state.enabledPackages.filter((p) => p !== packageName)
            : [...state.enabledPackages, packageName]
        })),
      isPackageEnabled: (packageName) =>
        get().enabledPackages.includes(packageName),

      isTelegramEnabled: true,
      isTelegramLinked: false,
      telegramChatId: null,
      setTelegramEnabled: (enabled) => set({ isTelegramEnabled: enabled }),
      setTelegramLinked: (linked, chatId) =>
        set({
          isTelegramLinked: linked,
          telegramChatId: chatId || null
        })
    }),
    {
      name: "cashlens-notification-settings",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
