import type { DraftResponse } from "@services/draftService";
import { draftService } from "@services/draftService";
import { parseNotification } from "@services/notificationParser";
import { notificationService } from "@services/notificationService";
import { useDraftStore } from "@stores/useDraftStore";
import { useNotificationLogStore } from "@stores/useNotificationLogStore";
import { useNotificationStore } from "@stores/useNotificationStore";
import { logger } from "@utils/logger";
import { useEffect } from "react";

/**
 * Hook for managing real-time notification subscriptions and parsing.
 * Extracted from useDashboardScreen.ts to keep files under 200 lines.
 */
export function useNotificationSubscription() {
  const { addDraft } = useDraftStore();
  const { isFeatureEnabled, enabledPackages } = useNotificationStore();

  useEffect(() => {
    if (!isFeatureEnabled) return;

    logger.debug("Dashboard", "Subscribing to notifications...");
    const unsubscribe = notificationService.subscribe((raw) => {
      // Filter by enabled packages (ignoring the test package check which is handled in the parser)
      const isTestPackage = raw.packageName === "com.cashlens.app";
      if (!isTestPackage && !enabledPackages.includes(raw.packageName)) {
        logger.debug(
          "Dashboard",
          `Ignoring notification from disabled package: ${raw.packageName}`
        );
        return;
      }

      logger.debug("Dashboard", `Raw notification received: ${raw.text}`);
      const parsed = parseNotification(raw.text, raw.packageName);

      // Log the notification
      useNotificationLogStore.getState().addLog({
        appName: raw.packageName.split(".").pop()?.toUpperCase() || "Unknown",
        packageName: raw.packageName,
        title: raw.title,
        text: raw.text,
        isParsed: !!parsed
      });

      if (parsed) {
        logger.debug("Dashboard", `Parsed successfully: ${parsed.description}`);
        const localId = addDraft({
          source: parsed.source,
          amount: parsed.amount,
          currency: parsed.currency,
          description: parsed.description,
          descriptionParams: parsed.descriptionParams,
          type: parsed.type,
          date: parsed.date
        });

        draftService
          .createDraft({
            source: parsed.source,
            currency: parsed.currency,
            fields: {
              amount: parsed.amount,
              description: parsed.description,
              type: parsed.type,
              date: parsed.date
            }
          })
          .then((res: DraftResponse) => {
            useDraftStore.getState().setBackendId(localId, res.id);
          })
          .catch((err: Error) => {
            logger.warn(
              "Dashboard",
              `Failed to sync draft to backend: ${err.message}`
            );
          });
      } else {
        logger.warn("Dashboard", `Failed to parse: ${raw.text}`);
      }
    });

    return unsubscribe;
  }, [addDraft, isFeatureEnabled, enabledPackages]);
}
