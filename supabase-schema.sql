-- CashLens Supabase Database Schema
-- Run this in your Supabase SQL Editor to create the required tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  amount DECIMAL NOT NULL,
  currency VARCHAR(3) NOT NULL,
  amount_in_base_currency DECIMAL NOT NULL,
  exchange_rate DECIMAL NOT NULL DEFAULT 1,
  type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
  category_id VARCHAR(50) NOT NULL,
  note TEXT,
  date TIMESTAMP NOT NULL,
  receipt_image_uri TEXT,
  is_from_scan BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Budgets table
CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  category_id VARCHAR(50) NOT NULL,
  amount DECIMAL NOT NULL,
  currency VARCHAR(3) NOT NULL,
  period VARCHAR(20) NOT NULL CHECK (period IN ('weekly', 'monthly', 'yearly')),
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
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

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for transactions
DROP POLICY IF EXISTS "Users can only see their own transactions" ON transactions;
CREATE POLICY "Users can only see their own transactions"
  ON transactions FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for budgets
DROP POLICY IF EXISTS "Users can only see their own budgets" ON budgets;
CREATE POLICY "Users can only see their own budgets"
  ON budgets FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for categories
DROP POLICY IF EXISTS "Users can only see their own categories" ON categories;
CREATE POLICY "Users can only see their own categories"
  ON categories FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Insert default categories (optional - run once)
INSERT INTO categories (id, user_id, name, icon, color, is_default, is_custom, type)
SELECT 
  'cat_food',
  auth.uid(),
  'Food & Drink',
  'UtensilsCrossed',
  '#FF6B6B',
  true,
  false,
  'expense'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE id = 'cat_food');

-- Profiles table (User Preferences)
-- Note: id is the user's ID from auth.users (cleaner design - no separate user_id column)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  base_currency VARCHAR(3) DEFAULT 'IDR',
  theme VARCHAR(10) DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  language VARCHAR(2) DEFAULT 'id' CHECK (language IN ('id', 'en')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policy for profiles
DROP POLICY IF EXISTS "Users can only see their own profile" ON profiles;
CREATE POLICY "Users can only see their own profile"
  ON profiles FOR ALL
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());
