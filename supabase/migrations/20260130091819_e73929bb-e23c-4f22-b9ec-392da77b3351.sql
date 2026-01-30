-- Create contact_submissions table
CREATE TABLE public.contact_submissions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    page_id UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT,
    phone TEXT,
    message TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a contact form (public)
CREATE POLICY "Anyone can submit contact form"
ON public.contact_submissions
FOR INSERT
WITH CHECK (true);

-- Page owners can view their submissions
CREATE POLICY "Page owners can view submissions"
ON public.contact_submissions
FOR SELECT
USING (public.is_page_owner(page_id) OR public.is_admin());

-- Page owners can delete submissions
CREATE POLICY "Page owners can delete submissions"
ON public.contact_submissions
FOR DELETE
USING (public.is_page_owner(page_id) OR public.is_admin());

-- Add index for faster queries
CREATE INDEX idx_contact_submissions_page_id ON public.contact_submissions(page_id);
CREATE INDEX idx_contact_submissions_created_at ON public.contact_submissions(created_at DESC);