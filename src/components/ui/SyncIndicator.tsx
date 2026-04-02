import { Cloud, CloudOff } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";

import { useSyncStatus } from "@/hooks/useSyncStatus";

import { Typography } from "./Typography";

interface SyncIndicatorProps {
  compact?: boolean;
}

export function SyncIndicator({ compact = false }: SyncIndicatorProps) {
  const { isSyncing, lastSyncedAt, error, getRelativeTime } = useSyncStatus();

  if (error) {
    return (
      <View className="flex-row items-center gap-2">
        <CloudOff size={16} color="#EF4444" />
        {!compact && (
          <Typography variant="caption" color="#EF4444">
            Sinkronisasi gagal
          </Typography>
        )}
      </View>
    );
  }

  if (isSyncing) {
    return (
      <View className="flex-row items-center gap-2">
        <View className="w-2 h-2 bg-primary rounded-full animate-pulse" />
        {!compact && (
          <Typography variant="caption" color="#4CAF82">
            Menyinkronkan...
          </Typography>
        )}
      </View>
    );
  }

  if (lastSyncedAt) {
    return (
      <View className="flex-row items-center gap-2">
        <Cloud size={16} color="#4CAF82" />
        {!compact && (
          <Typography variant="caption" color="#6B7280">
            Terakhir: {getRelativeTime(lastSyncedAt)}
          </Typography>
        )}
      </View>
    );
  }

  return (
    <View className="flex-row items-center gap-2">
      <CloudOff size={16} color="#9CA3AF" />
      {!compact && (
        <Typography variant="caption" color="#9CA3AF">
          Belum disinkronkan
        </Typography>
      )}
    </View>
  );
}

interface SyncStatusButtonProps {
  onPress?: () => void;
}

export function SyncStatusButton({ onPress }: SyncStatusButtonProps) {
  const { isSyncing, lastSyncedAt, error, getRelativeTime } = useSyncStatus();

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center gap-2 bg-surface-secondary px-4 py-3 rounded-lg"
      activeOpacity={0.7}
    >
      {error ? (
        <CloudOff size={20} color="#EF4444" />
      ) : isSyncing ? (
        <View className="w-2 h-2 bg-primary rounded-full" />
      ) : (
        <Cloud size={20} color="#4CAF82" />
      )}

      <View className="flex-1">
        <Typography variant="body" weight="medium" color="#1A1A2E">
          {error
            ? "Sinkronisasi Gagal"
            : isSyncing
              ? "Menyinkronkan..."
              : "Cloud Sync"}
        </Typography>
        <Typography variant="caption" color="#6B7280">
          {error
            ? "Ketuk untuk coba lagi"
            : isSyncing
              ? "Mohon tunggu..."
              : lastSyncedAt
                ? `Terakhir: ${getRelativeTime(lastSyncedAt)}`
                : "Belum disinkronkan"}
        </Typography>
      </View>

      {!isSyncing && (
        <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
          <Typography variant="caption" weight="bold" color="#FFFFFF">
            →
          </Typography>
        </View>
      )}
    </TouchableOpacity>
  );
}
