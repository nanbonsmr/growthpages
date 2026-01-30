-- Create subscription status enum
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'trialing', 'paused');

-- Create subscriptions table to track user subscriptions
CREATE TABLE public.subscriptions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    dodo_customer_id TEXT,
    dodo_subscription_id TEXT UNIQUE,
    plan_id TEXT NOT NULL, -- 'free', 'pro', 'business'
    status subscription_status NOT NULL DEFAULT 'active',
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_dodo_subscription_id ON public.subscriptions(dodo_subscription_id);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscription
CREATE POLICY "Users can view their own subscription"
ON public.subscriptions
FOR SELECT
USING (auth.uid() = user_id);

-- Only service role (webhooks) can insert/update subscriptions
CREATE POLICY "Service role can manage subscriptions"
ON public.subscriptions
FOR ALL
USING (auth.uid() = user_id OR is_admin());

-- Create trigger for updated_at
CREATE TRIGGER update_subscriptions_updated_at
BEFORE UPDATE ON public.subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update profiles table to sync plan from subscriptions
CREATE OR REPLACE FUNCTION public.sync_subscription_plan()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the user's plan in profiles based on subscription status
    IF NEW.status = 'active' OR NEW.status = 'trialing' THEN
        UPDATE public.profiles
        SET plan = NEW.plan_id::plan_type,
            updated_at = now()
        WHERE id = NEW.user_id;
    ELSIF NEW.status IN ('canceled', 'past_due') THEN
        -- Downgrade to free if subscription is canceled or past due
        UPDATE public.profiles
        SET plan = 'free',
            updated_at = now()
        WHERE id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER sync_subscription_to_profile
AFTER INSERT OR UPDATE ON public.subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.sync_subscription_plan();