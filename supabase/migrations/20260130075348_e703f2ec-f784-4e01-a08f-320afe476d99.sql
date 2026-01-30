-- Create app_role enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create plan_type enum for subscription plans
CREATE TYPE public.plan_type AS ENUM ('free', 'pro', 'business');

-- Create template_type enum for page templates
CREATE TYPE public.template_type AS ENUM ('newsletter', 'waitlist', 'event', 'product_launch', 'free_resource');

-- Create profiles table (linked to auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    plan public.plan_type NOT NULL DEFAULT 'free',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role public.app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Create pages table
CREATE TABLE public.pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    slug TEXT NOT NULL UNIQUE,
    template public.template_type NOT NULL DEFAULT 'newsletter',
    button_text TEXT DEFAULT 'Subscribe',
    theme_settings JSONB DEFAULT '{"primaryColor": "#4F46E5", "backgroundColor": "#ffffff", "backgroundStyle": "solid", "fontStyle": "inter"}'::jsonb,
    logo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create subscribers table
CREATE TABLE public.subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID REFERENCES public.pages(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (page_id, email)
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = auth.uid()
        AND role = 'admin'
    )
$$;

-- Create function to check if user owns a page
CREATE OR REPLACE FUNCTION public.is_page_owner(page_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.pages
        WHERE id = page_uuid
        AND user_id = auth.uid()
    )
$$;

-- Create function to check if user owns the page associated with a subscriber
CREATE OR REPLACE FUNCTION public.owns_subscriber_page(subscriber_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.subscribers s
        JOIN public.pages p ON s.page_id = p.id
        WHERE s.id = subscriber_uuid
        AND p.user_id = auth.uid()
    )
$$;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pages_updated_at
    BEFORE UPDATE ON public.pages
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- RLS Policies for user_roles (only admins can manage roles)
CREATE POLICY "Admins can view all roles"
    ON public.user_roles FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Admins can insert roles"
    ON public.user_roles FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update roles"
    ON public.user_roles FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Admins can delete roles"
    ON public.user_roles FOR DELETE
    USING (public.is_admin());

-- RLS Policies for pages
CREATE POLICY "Users can view their own pages"
    ON public.pages FOR SELECT
    USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users can create pages"
    ON public.pages FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own pages"
    ON public.pages FOR UPDATE
    USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users can delete their own pages"
    ON public.pages FOR DELETE
    USING (user_id = auth.uid() OR public.is_admin());

-- Public policy to allow anyone to view active pages by slug (for public signup pages)
CREATE POLICY "Anyone can view active pages by slug"
    ON public.pages FOR SELECT
    USING (is_active = true);

-- RLS Policies for subscribers
CREATE POLICY "Page owners can view their subscribers"
    ON public.subscribers FOR SELECT
    USING (public.owns_subscriber_page(id) OR public.is_admin());

CREATE POLICY "Anyone can create subscribers"
    ON public.subscribers FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Page owners can update their subscribers"
    ON public.subscribers FOR UPDATE
    USING (public.owns_subscriber_page(id) OR public.is_admin());

CREATE POLICY "Page owners can delete their subscribers"
    ON public.subscribers FOR DELETE
    USING (public.owns_subscriber_page(id) OR public.is_admin());

-- Create function to handle new user signup (auto-create profile)
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

-- Create trigger to auto-create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_pages_user_id ON public.pages(user_id);
CREATE INDEX idx_pages_slug ON public.pages(slug);
CREATE INDEX idx_subscribers_page_id ON public.subscribers(page_id);
CREATE INDEX idx_subscribers_email ON public.subscribers(email);
CREATE INDEX idx_subscribers_created_at ON public.subscribers(created_at);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);