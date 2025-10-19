-- Create categories table
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  color text NOT NULL DEFAULT '#6366f1',
  icon text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, name)
);

-- Create transactions table
CREATE TABLE public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  amount numeric(12, 2) NOT NULL,
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  description text,
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- RLS policies for categories
CREATE POLICY "Users can view their own categories"
  ON public.categories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own categories"
  ON public.categories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories"
  ON public.categories FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories"
  ON public.categories FOR DELETE
  USING (auth.uid() = user_id);

-- RLS policies for transactions
CREATE POLICY "Users can view their own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions"
  ON public.transactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions"
  ON public.transactions FOR DELETE
  USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to transactions
CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default categories function
CREATE OR REPLACE FUNCTION public.create_default_categories()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.categories (user_id, name, color, icon) VALUES
    (NEW.id, 'Salary', '#10b981', 'Briefcase'),
    (NEW.id, 'Freelance', '#3b82f6', 'Code'),
    (NEW.id, 'Food', '#ef4444', 'UtensilsCrossed'),
    (NEW.id, 'Transport', '#f59e0b', 'Car'),
    (NEW.id, 'Shopping', '#ec4899', 'ShoppingBag'),
    (NEW.id, 'Bills', '#8b5cf6', 'FileText'),
    (NEW.id, 'Entertainment', '#14b8a6', 'Tv'),
    (NEW.id, 'Healthcare', '#06b6d4', 'HeartPulse'),
    (NEW.id, 'Other', '#6b7280', 'MoreHorizontal');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create default categories on user signup
CREATE TRIGGER on_auth_user_created_categories
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_default_categories();