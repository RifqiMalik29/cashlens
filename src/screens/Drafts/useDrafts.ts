import { colors } from "@constants/theme";
import { useHeader } from "@hooks/useHeader";
import { draftService } from "@services/api/draftService";
import { useCategoryStore } from "@stores/useCategoryStore";
import { type DraftTransaction, useDraftStore } from "@stores/useDraftStore";
import { useTransactionStore } from "@stores/useTransactionStore";
import { generateId } from "@utils/generateId";
import { logger } from "@utils/logger";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export function useDrafts() {
  const { t } = useTranslation();
  const router = useRouter();
  const { drafts, confirmDraft, dismissDraft } = useDraftStore();
  const { addTransaction } = useTransactionStore();
  const { categories } = useCategoryStore();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  useHeader({
    title: t("drafts.title"),
    statusBarColor: colors.primary,
    statusBarStyle: "light"
  });

  const pendingDrafts = useMemo(
    () => drafts.filter((d) => d.status === "pending"),
    [drafts]
  );

  const handleConfirm = (draft: DraftTransaction) => {
    logger.debug("Drafts", `Confirming draft: ${draft.id}`);
    const defaultCategory =
      categories.find((c) => c.type === draft.type) || categories[0];

    const translatedNote = draft.description.includes(".")
      ? t(draft.description, draft.descriptionParams)
      : draft.description;

    addTransaction({
      id: generateId(),
      amount: draft.amount,
      categoryId: defaultCategory.id,
      date: draft.date,
      note: translatedNote,
      type: draft.type,
      currency: draft.currency,
      amountInBaseCurrency: draft.amount,
      exchangeRate: 1,
      isFromScan: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    confirmDraft(draft.id);
    setShowSuccessDialog(true);

    if (draft.backendId) {
      draftService
        .confirmDraft(draft.backendId, {
          category_id: defaultCategory.id,
          amount: draft.amount,
          currency: draft.currency,
          description: translatedNote,
          transaction_date: draft.date
        })
        .catch((err) => {
          logger.warn(
            "Drafts",
            `Failed to confirm draft on backend: ${(err as Error).message}`
          );
        });
    }
  };

  const handleDismiss = (id: string) => {
    logger.debug("Drafts", `Dismissing draft: ${id}`);
    const draft = useDraftStore.getState().drafts.find((d) => d.id === id);
    dismissDraft(id);

    if (draft?.backendId) {
      draftService.deleteDraft(draft.backendId).catch((err) => {
        logger.warn(
          "Drafts",
          `Failed to delete draft on backend: ${(err as Error).message}`
        );
      });
    }
  };

  const handleEdit = (draft: DraftTransaction) => {
    logger.debug("Drafts", `Editing draft: ${draft.id}`);

    const translatedNote = draft.description.includes(".")
      ? t(draft.description, draft.descriptionParams)
      : draft.description;

    router.push({
      pathname: "/(tabs)/transactions/add",
      params: {
        draftId: draft.id,
        note: translatedNote
      }
    });
  };

  return {
    t,
    pendingDrafts,
    handleConfirm,
    handleDismiss,
    handleEdit,
    showSuccessDialog,
    setShowSuccessDialog
  };
}
