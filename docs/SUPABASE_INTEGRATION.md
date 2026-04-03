# Supabase Integration Guide for CashLens

This document provides a step-by-step guide to setting up and integrating Supabase with the CashLens project for Authentication and Cloud Synchronization.

---

## 1. Supabase Project Setup

1.  **Create Account**: Go to [supabase.com](https://supabase.com/) and sign in or create an account.
2.  **New Project**: Click on "New Project".
    - **Name**: `CashLens`
    - **Database Password**: Securely store this password.
    - **Region**: Choose the one closest to your target users (e.g., Singapore for SE Asia).
3.  **Wait for Provisioning**: It may take a minute for your database to be ready.

## 2. Database Schema Setup

Once the project is ready, you need to create the tables and security policies.

1.  Open the **SQL Editor** from the left sidebar in the Supabase Dashboard.
2.  Click **"New Query"**.
3.  Copy the entire content of the `supabase-schema.sql` file located in the root of this project.
4.  Paste it into the SQL Editor and click **"Run"**.
5.  **Verify**: Check the **Table Editor** to ensure `transactions`, `budgets`, and `categories` tables exist.

**Note:** You will only see 3 tables (`transactions`, `budgets`, `categories`). The `auth.users` table is **automatically created by Supabase** and won't appear in the Table Editor - it's managed by the Authentication service.

## 3. Authentication Configuration

**Important:** Supabase Auth is built-in. The `auth.users` table and `auth.uid()` function are automatically available - you don't need to create them.

1.  Go to **Authentication** -> **Providers**.
2.  Ensure **Email** is enabled (usually enabled by default).
3.  (Optional) Disable "Confirm Email" if you want users to be able to log in immediately without verifying their email address (convenient for development).
4.  Go to **Authentication** -> **URL Configuration**:
    - Set **Site URL** to `cashlens://` (or your Expo development URL).
5.  **Verify**: Go to **Authentication** -> **Users** - you should see an empty list (no users yet, which is normal).

## 4. Connect to the Mobile App

### Environment Variables

1.  In Supabase Dashboard, go to **Project Settings** -> **API**.
2.  Copy the **Project URL** and the **anon public** key.
3.  Create a file named `.env.local` in the root of your project:
    ```bash
    EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
    EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
    ```

### Initialization ✅ CONFIGURED

The app is already configured to use these variables in `src/services/supabase.ts`:

```typescript
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});
```

**Features:**

- ✅ Sessions persist across app restarts (AsyncStorage)
- ✅ Auth tokens auto-refresh
- ✅ Ready for authentication flows

## 5. Security & Row Level Security (RLS)

The `supabase-schema.sql` script automatically enables RLS. This ensures:

- Users can **only read/write their own data**.
- The `user_id` column is automatically checked against the authenticated user's ID (`auth.uid()`).

## 6. Testing the Integration

1.  **Run the App**: `pnpm start` and open on your device/emulator.
2.  **Register**: Create a new account on the Register screen.
3.  **Check Supabase**: Go to the **Authentication** tab in Supabase to see the new user.
4.  **Add Transaction**: Add a transaction in the app.
5.  **Check Database**: Go to the **Table Editor** -> `transactions` to see the data synced to the cloud.

---

## Troubleshooting

- **Network Error**: Ensure your mobile device can reach the internet.
- **Missing Variables**: If the app crashes on start, double-check that `.env.local` contains the correct keys and that you have restarted the Expo dev server (`pnpm start --clear`).
- **Permission Denied**: This usually means RLS is enabled but the user is not authenticated or the policy is incorrect. Ensure the `user_id` matches the logged-in user.
- **"Where is the auth table?"**: The `auth.users` table is a **system table** managed by Supabase. You won't see it in the Table Editor. It's accessed via the Authentication dashboard and automatically referenced by your `user_id` foreign keys.

---

## FAQ

**Q: Why do I only see 3 tables (transactions, budgets, categories)?**
A: That's correct! The `auth.users` table is built-in to Supabase and managed by the Authentication service. You don't create it manually.

**Q: Do I need to run additional SQL for authentication?**
A: No. Just enable Email authentication in the dashboard. The auth system is ready to use.

**Q: How do I test if auth is working?**
A:

1. Implement a signup screen in your app using `supabase.auth.signUp()`
2. Register a test user
3. Go to **Authentication** → **Users** in Supabase dashboard
4. You should see the new user listed there

**Q: What's the difference between the 3 tables I created and auth.users?**
A:

- `transactions`, `budgets`, `categories` = Your app data (you created these)
- `auth.users` = User accounts (Supabase manages this automatically)
- Your tables reference `auth.users` via the `user_id` column
