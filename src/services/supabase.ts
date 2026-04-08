import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { logger } from "@utils/logger";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  logger.warn(
    "Supabase",
    "WARNING: Supabase environment variables are missing!"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});

export const signInWithEmail = async (email: string, password: string) => {
  logger.debug("Supabase", `Login: ${email} -> ${supabaseUrl}`);

  try {
    const result = await supabase.auth.signInWithPassword({ email, password });
    if (result.error) {
      logger.error("Supabase", `Auth Error: ${result.error.message}`);
    }
    return result;
  } catch (err) {
    const error = err as Error;
    logger.error("Supabase", `Fetch Error: ${error.message}`);
    return {
      data: { user: null, session: null },
      error: { message: error.message, status: 500 } as {
        message: string;
        status: number;
      }
    };
  }
};

export const signUpWithEmail = async (email: string, password: string) => {
  return supabase.auth.signUp({ email, password });
};

export const signOut = async () => {
  return supabase.auth.signOut();
};

export const getSession = async () => {
  return supabase.auth.getSession();
};
