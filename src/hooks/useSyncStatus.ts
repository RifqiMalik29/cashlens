import { useCallback } from "react";

import { useSyncStore } from "@/stores/useSyncStore";

export function useSyncStatus() {
  const status = useSyncStore();

  const getRelativeTime = useCallback((dateString: string | null): string => {
    if (!dateString) return "Belum pernah";

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return `${diffMins}m yang lalu`;
    if (diffHours < 24) return `${diffHours}j yang lalu`;
    if (diffDays < 7) return `${diffDays}h yang lalu`;

    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short"
    });
  }, []);

  return {
    ...status,
    getRelativeTime
  };
}
