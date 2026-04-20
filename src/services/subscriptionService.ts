import { logger } from "@utils/logger";
import { Platform } from "react-native";
import type {
  CustomerInfo,
  PurchasesOffering,
  PurchasesPackage
} from "react-native-purchases";
import Purchases from "react-native-purchases";

export const ENTITLEMENT_ID = "CashLens Premium";

const REVENUECAT_API_KEYS = {
  apple: "",
  google: "test_UlHisLjyJbMNxkEBAniQgbGHiPO"
};

class RevenueCatService {
  isConfigured = false;

  public init = (userId: string | null): void => {
    if (this.isConfigured) {
      return;
    }

    if (__DEV__) {
      Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
    }

    const apiKey =
      Platform.OS === "ios"
        ? REVENUECAT_API_KEYS.apple
        : REVENUECAT_API_KEYS.google;

    Purchases.configure({ apiKey });

    this.isConfigured = true;

    if (userId) {
      this.login(userId);
    }
  };

  public login = async (userId: string): Promise<void> => {
    try {
      await Purchases.logIn(userId);
    } catch (error) {
      logger.error("RevenueCat login failed", error as Error);
    }
  };

  public logout = async (): Promise<void> => {
    try {
      await Purchases.logOut();
    } catch (error) {
      logger.error("RevenueCat logout failed", error as Error);
    }
  };

  public getCustomerInfo = async (): Promise<CustomerInfo> => {
    return Purchases.getCustomerInfo();
  };

  public isEntitlementActive = async (): Promise<boolean> => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
    } catch {
      return false;
    }
  };

  public getOfferings = async (): Promise<PurchasesOffering | null> => {
    try {
      const offerings = await Purchases.getOfferings();
      return offerings.current;
    } catch (error) {
      logger.error("Failed to get offerings", error as Error);
      return null;
    }
  };

  public purchasePackage = async (pack: PurchasesPackage) => {
    return Purchases.purchasePackage(pack);
  };

  public restorePurchases = async (): Promise<CustomerInfo> => {
    return Purchases.restorePurchases();
  };

  public addCustomerInfoUpdateListener = (
    listener: (customerInfo: CustomerInfo) => void
  ) => {
    Purchases.addCustomerInfoUpdateListener(listener);
  };
}

export const revenueCatService = new RevenueCatService();
