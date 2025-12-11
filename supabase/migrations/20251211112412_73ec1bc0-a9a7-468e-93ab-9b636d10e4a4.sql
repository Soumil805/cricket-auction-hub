-- Add new roles to the app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'umpire';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'ground_owner';