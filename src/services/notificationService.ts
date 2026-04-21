import { logger } from "@utils/logger";
import { DeviceEventEmitter, NativeModules, Platform } from "react-native";

const { NotificationModule } = NativeModules;

export interface RawNotification {
  packageName: string;
  title: string;
  text: string;
  subText: string;
  postTime: number;
}

class NotificationService {
  async isPermissionGranted(): Promise<boolean> {
    if (Platform.OS !== "android" || !NotificationModule) return false;
    return await NotificationModule.isPermissionGranted();
  }

  openNotificationSettings() {
    if (Platform.OS === "android" && NotificationModule) {
      NotificationModule.openNotificationSettings();
    }
  }

  sendTestNotification(
    title: string,
    text: string,
    packageName: string = "com.bca.mobile"
  ) {
    if (Platform.OS === "android" && NotificationModule) {
      NotificationModule.sendTestNotification(title, text, packageName);
    }
  }

  subscribe(callback: (notification: RawNotification) => void) {
    if (Platform.OS !== "android" || !NotificationModule) return () => {};

    logger.debug(
      "Notification",
      "Setting up DeviceEventEmitter listener for onNotificationReceived"
    );

    NotificationModule.addListener("onNotificationReceived");

    const subscription = DeviceEventEmitter.addListener(
      "onNotificationReceived",
      (data) => {
        logger.debug(
          "Notification",
          `DeviceEventEmitter caught event: ${JSON.stringify(data)}`
        );
        callback(data);
      }
    );

    return () => {
      subscription.remove();
      NotificationModule.removeListeners(1);
    };
  }
}

export const notificationService = new NotificationService();
