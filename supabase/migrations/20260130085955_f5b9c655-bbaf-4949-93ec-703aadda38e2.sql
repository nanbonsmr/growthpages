-- Add status and notes columns to subscribers table
ALTER TABLE public.subscribers 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
ADD COLUMN IF NOT EXISTS notes text;

-- Create index for faster status filtering
CREATE INDEX IF NOT EXISTS idx_subscribers_status ON public.subscribers(status);

-- Create index for faster date-based queries
CREATE INDEX IF NOT EXISTS idx_subscribers_created_at ON public.subscribers(created_at DESC);