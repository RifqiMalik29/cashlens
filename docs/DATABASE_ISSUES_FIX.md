# Database Issues & Fixes

This document details the root causes and step-by-step SQL fixes for Supabase database errors encountered in the CashLens project.

## Issue 1: "new row violates row-level security policy for table 'transactions'"

### Symptoms

When the app attempts to sync (push) new transactions to Supabase, it fails with:
`[SyncService] ✗ Failed to push transactions: new row violates row-level security policy for table "transactions"`

### Root Cause

This error occurs when an `INSERT` or `UPDATE` operation is blocked by the Row-Level Security (RLS) `WITH CHECK` expression on the `transactions` table.

Common reasons for this include:

1. **Missing INSERT/UPDATE Policies**: The table might only have a `SELECT` policy configured, so the `upsert` operation (which requires `INSERT` and `UPDATE` permissions) is denied by default.
2. **Wrong Column Checked**: The policy might accidentally check `id = auth.uid()` instead of `user_id = auth.uid()`. Since transaction `id`s are random UUIDs, they will never match the user's ID.

### The Fix

You need to drop the existing policies on the `transactions` table and explicitly grant `ALL` privileges for rows where `user_id = auth.uid()`.

1. Go to the **SQL Editor** in your Supabase Dashboard.
2. Run the following SQL snippet to recreate the correct RLS policies for `transactions`, `categories`, and `profiles`:

```sql
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can only see their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can manage their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.transactions;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.transactions;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.transactions;

CREATE POLICY "Users can manage their own transactions"
  ON public.transactions FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can only see their own categories" ON public.categories;
DROP POLICY IF EXISTS "Users can manage their own categories" ON public.categories;

CREATE POLICY "Users can manage their own categories"
  ON public.categories FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can only see their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage their own profile" ON public.profiles;

CREATE POLICY "Users can manage their own profile"
  ON public.profiles FOR ALL
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());
```

---

## Issue 2: "Failed to push categories: new row violates row-level security policy"

### Symptoms

When switching users (logging out of User A and into User B), the `SyncService` fails with a `new row violates row-level security policy (USING expression)` for the `categories` table.

### Root Cause

This is a design conflict in the `categories` table schema. The table was initially created with `id` as the **sole primary key**. Since the default categories (like `cat_food`) have fixed ID strings, once User A syncs them to Supabase, no other user in the entire system can sync a category with those same IDs. When User B tries to `upsert` their own `cat_food`, Supabase tries to find the existing row. Because User B does not own User A's row, RLS blocks access, leading to a policy violation.

### The Fix

You must redefine the `categories` table to use a **composite primary key** consisting of `(id, user_id)`. This allows each user to have their own private record for `cat_food`.

1. Go to the **SQL Editor** in your Supabase Dashboard.
2. Run the following SQL snippet to reconstruct the `categories` table:

```sql
DROP TABLE IF EXISTS public.categories CASCADE;

CREATE TABLE public.categories (
  id VARCHAR(50),
  user_id UUID REFERENCES auth.users NOT NULL,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50) NOT NULL,
  color VARCHAR(7) NOT NULL,
  is_default BOOLEAN DEFAULT false,
  is_custom BOOLEAN DEFAULT true,
  type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense', 'both')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id, user_id)
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own categories"
  ON public.categories FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
```

---

## Final Verification Checklist

After running all the SQL fixes:

1. **Register a new account**: The process should complete smoothly.
2. **Add a transaction and go to the Dashboard**: All `[SyncService] ✗ Failed to push...` errors for transactions, categories, and profiles should disappear.
3. **Switch Users**: Log out and log in with a different user. You should only see data belonging to that user, and syncing should work correctly for both.
