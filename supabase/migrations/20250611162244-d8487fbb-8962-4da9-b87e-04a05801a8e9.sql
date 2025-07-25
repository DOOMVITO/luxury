
-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('admin', 'user');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  featured BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product_images table
CREATE TABLE public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bulk_upload_sessions table for bulk product creation
CREATE TABLE public.bulk_upload_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_name TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  default_price_text TEXT DEFAULT 'Consultar preço',
  total_images INTEGER DEFAULT 0,
  processed_images INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create bulk_upload_images table
CREATE TABLE public.bulk_upload_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.bulk_upload_sessions(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  product_name TEXT,
  processed BOOLEAN DEFAULT FALSE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulk_upload_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulk_upload_images ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.profiles WHERE id = user_id),
    FALSE
  );
$$;

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (public.is_admin(auth.uid()));

-- RLS Policies for categories (public read, admin write)
CREATE POLICY "Anyone can view categories" ON public.categories
  FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage categories" ON public.categories
  FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for products (public read, admin write)
CREATE POLICY "Anyone can view active products" ON public.products
  FOR SELECT USING (active = TRUE);

CREATE POLICY "Admins can view all products" ON public.products
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage products" ON public.products
  FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for product_images (public read, admin write)
CREATE POLICY "Anyone can view product images" ON public.product_images
  FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage product images" ON public.product_images
  FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for bulk upload (admin only)
CREATE POLICY "Admins can manage bulk upload sessions" ON public.bulk_upload_sessions
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage bulk upload images" ON public.bulk_upload_images
  FOR ALL USING (public.is_admin(auth.uid()));

-- Insert default categories
INSERT INTO public.categories (name, description, slug) VALUES
  ('Anéis', 'Anéis exclusivos em ouro, prata e pedras preciosas', 'aneis'),
  ('Colares', 'Colares elegantes para todas as ocasiões', 'colares'),
  ('Brincos', 'Brincos sofisticados e delicados', 'brincos'),
  ('Pulseiras', 'Pulseiras de diversos estilos e materiais', 'pulseiras'),
  ('Conjuntos', 'Conjuntos coordenados de joias', 'conjuntos');

-- Create function for bulk product creation
CREATE OR REPLACE FUNCTION public.create_bulk_products(
  session_id UUID,
  category_id UUID,
  default_name_prefix TEXT DEFAULT 'Produto'
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  image_record RECORD;
  new_product_id UUID;
  processed_count INTEGER := 0;
BEGIN
  -- Check if user is admin
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Acesso negado. Apenas administradores podem executar esta função.';
  END IF;

  -- Process each unprocessed image in the session
  FOR image_record IN 
    SELECT * FROM public.bulk_upload_images 
    WHERE session_id = create_bulk_products.session_id 
    AND processed = FALSE
  LOOP
    -- Create new product
    INSERT INTO public.products (name, description, category_id, price, created_by)
    VALUES (
      COALESCE(image_record.product_name, default_name_prefix || ' ' || (processed_count + 1)),
      'Produto criado via upload em massa',
      category_id,
      NULL, -- Price will be NULL for "Consultar preço"
      auth.uid()
    )
    RETURNING id INTO new_product_id;

    -- Create product image
    INSERT INTO public.product_images (product_id, image_url, display_order)
    VALUES (new_product_id, image_record.image_url, 0);

    -- Mark image as processed
    UPDATE public.bulk_upload_images 
    SET processed = TRUE, product_id = new_product_id
    WHERE id = image_record.id;

    processed_count := processed_count + 1;
  END LOOP;

  -- Update session status
  UPDATE public.bulk_upload_sessions 
  SET 
    processed_images = processed_count,
    status = CASE 
      WHEN processed_count = total_images THEN 'completed'
      ELSE 'processing'
    END,
    completed_at = CASE 
      WHEN processed_count = total_images THEN NOW()
      ELSE NULL
    END
  WHERE id = session_id;

  RETURN processed_count;
END;
$$;
