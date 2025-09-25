-- Drop the existing table if it exists and recreate it
DROP TABLE IF EXISTS public.weekly_intake_forms CASCADE;

-- Create the weekly_intake_forms table
CREATE TABLE public.weekly_intake_forms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  app_name TEXT NOT NULL,
  requestor TEXT NOT NULL,
  app_owner TEXT NOT NULL,
  l1_leadership TEXT NOT NULL,
  date_requested DATE NOT NULL,
  funding_available BOOLEAN NOT NULL DEFAULT false,
  fund_code TEXT,
  cost DECIMAL(12,2),
  cms_full_support BOOLEAN NOT NULL DEFAULT false,
  exceptions_to_cms TEXT,
  backup BOOLEAN NOT NULL DEFAULT false,
  dr BOOLEAN NOT NULL DEFAULT false,
  physical BOOLEAN NOT NULL DEFAULT false,
  reason_for_physical TEXT,
  on_prem BOOLEAN NOT NULL DEFAULT false,
  reason_for_on_prem TEXT,
  azure BOOLEAN NOT NULL DEFAULT false,
  location_on_prem BOOLEAN NOT NULL DEFAULT false,
  data_center_location TEXT,
  location_physical BOOLEAN NOT NULL DEFAULT false,
  location_reason_for_physical TEXT,
  sql BOOLEAN NOT NULL DEFAULT false,
  oracle BOOLEAN NOT NULL DEFAULT false,
  other_explain TEXT,
  prod_count INTEGER NOT NULL DEFAULT 0,
  non_prod_count INTEGER NOT NULL DEFAULT 0,
  dr_count INTEGER NOT NULL DEFAULT 0,
  env_prod BOOLEAN NOT NULL DEFAULT false,
  env_non_prod BOOLEAN NOT NULL DEFAULT false,
  env_dr BOOLEAN NOT NULL DEFAULT false,
  azure_type TEXT,
  azure_volume TEXT,
  storage_on_prem TEXT,
  on_prem_volume TEXT,
  other_notes TEXT,
  week_date TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.weekly_intake_forms ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (forms can be submitted by anyone)
CREATE POLICY "Anyone can insert weekly intake forms" 
ON public.weekly_intake_forms 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view weekly intake forms" 
ON public.weekly_intake_forms 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_weekly_intake_forms_updated_at
BEFORE UPDATE ON public.weekly_intake_forms
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();