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

## 3. Authentication Configuration

1.  Go to **Authentication** -> **Providers**.
2.  Ensure **Email** is enabled.
3.  (Optional) Disable "Confirm Email" if you want users to be able to log in immediately without verifying their email address (convenient for development).
4.  Go to **Authentication** -> **URL Configuration**:
    - Set **Site URL** to `cashlens://` (or your Expo development URL).

## 4. Connect to the Mobile App

### Environment Variables

1.  In Supabase Dashboard, go to **Project Settings** -> **API**.
2.  Copy the **Project URL** and the **anon public** key.
3.  Create a file named `.env.local` in the root of your project:
    ```bash
    EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
    EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
    ```

### Initialization

The app is already configured to use these variables in `src/services/supabase.ts`:

```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

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
