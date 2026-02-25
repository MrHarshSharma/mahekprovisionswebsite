# MK Provisions - Supabase Table Creation

## 1. Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);
```

## 2. Product Table

```sql
CREATE TABLE product (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC,
  categories JSONB DEFAULT '[]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  product_type TEXT DEFAULT 'simple' CHECK (product_type IN ('simple', 'variable')),
  variations JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 3. Orders Table

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  "order" JSONB NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'delivered', 'cancelled')),
  payment_status TEXT CHECK (payment_status IN ('completed', 'store payment')),
  is_delivery BOOLEAN DEFAULT true,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);
```

## 4. Coupons Table

```sql
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  valid_from DATE,
  valid_till DATE,
  off_percent NUMERIC NOT NULL,
  min_cost NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```
