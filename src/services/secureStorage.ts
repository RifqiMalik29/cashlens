import { logger } from "@utils/logger";
import * as Keychain from "react-native-keychain";

const TOKEN_KEY = "cashlens.auth.tokens";
const USER_KEY = "cashlens.user.data";

/**
 * Secure storage service using react-native-keychain for sensitive data.
 * This provides encrypted storage for auth tokens and user credentials.
 */

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserData {
  userId: string;
  userEmail: string;
  subscriptionTier: "free" | "premium";
}

/**
 * Save auth tokens to secure storage
 */
export async function saveAuthTokens(tokens: AuthTokens): Promise<void> {
  try {
    const credentials = JSON.stringify(tokens);
    await Keychain.setGenericPassword(TOKEN_KEY, credentials, {
      service: TOKEN_KEY,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY
    });
    logger.debug("SecureStorage", "Auth tokens saved successfully");
  } catch (error) {
    logger.error("SecureStorage", "Failed to save auth tokens", error as Error);
    throw error;
  }
}

/**
 * Retrieve auth tokens from secure storage
 * @returns AuthTokens or null if not found
 */
export async function getAuthTokens(): Promise<AuthTokens | null> {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: TOKEN_KEY
    });
    if (!credentials) {
      return null;
    }
    return JSON.parse(credentials.password) as AuthTokens;
  } catch (error) {
    logger.error(
      "SecureStorage",
      "Failed to retrieve auth tokens",
      error as Error
    );
    return null;
  }
}

/**
 * Delete auth tokens from secure storage
 */
export async function deleteAuthTokens(): Promise<void> {
  try {
    await Keychain.resetGenericPassword({ service: TOKEN_KEY });
    logger.debug("SecureStorage", "Auth tokens deleted successfully");
  } catch (error) {
    logger.error(
      "SecureStorage",
      "Failed to delete auth tokens",
      error as Error
    );
    throw error;
  }
}

/**
 * Save user data to secure storage
 */
export async function saveUserData(data: UserData): Promise<void> {
  try {
    const userData = JSON.stringify(data);
    await Keychain.setGenericPassword(USER_KEY, userData, {
      service: USER_KEY,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY
    });
    logger.debug("SecureStorage", "User data saved successfully");
  } catch (error) {
    logger.error("SecureStorage", "Failed to save user data", error as Error);
    throw error;
  }
}

/**
 * Retrieve user data from secure storage
 * @returns UserData or null if not found
 */
export async function getUserData(): Promise<UserData | null> {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: USER_KEY
    });
    if (!credentials) {
      return null;
    }
    return JSON.parse(credentials.password) as UserData;
  } catch (error) {
    logger.error(
      "SecureStorage",
      "Failed to retrieve user data",
      error as Error
    );
    return null;
  }
}

/**
 * Delete user data from secure storage
 */
export async function deleteUserData(): Promise<void> {
  try {
    await Keychain.resetGenericPassword({ service: USER_KEY });
    logger.debug("SecureStorage", "User data deleted successfully");
  } catch (error) {
    logger.error("SecureStorage", "Failed to delete user data", error as Error);
    throw error;
  }
}

/**
 * Clear all secure storage data
 */
export async function clearAllSecureData(): Promise<void> {
  try {
    await Promise.all([deleteAuthTokens(), deleteUserData()]);
    logger.debug("SecureStorage", "All secure data cleared successfully");
  } catch (error) {
    logger.error(
      "SecureStorage",
      "Failed to clear all secure data",
      error as Error
    );
    throw error;
  }
}
