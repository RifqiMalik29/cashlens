import AsyncStorage from "@react-native-async-storage/async-storage";

import { generateId } from "./generateId";

const DEVICE_ID_KEY = "cashlens_device_id";

let cached: string | null = null;

export async function getDeviceId(): Promise<string> {
  if (cached) return cached;

  const stored = await AsyncStorage.getItem(DEVICE_ID_KEY);
  if (stored) {
    cached = stored;
    return stored;
  }

  const id = generateId();
  await AsyncStorage.setItem(DEVICE_ID_KEY, id);
  cached = id;
  return id;
}
