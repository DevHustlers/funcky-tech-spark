-- 1. Set admin role in auth metadata (affects JWT and session)
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
      COALESCE(raw_user_meta_data, '{}'::jsonb),
      '{role}',
      '"admin"'
    ),
    raw_app_meta_data = jsonb_set(
      COALESCE(raw_app_meta_data, '{}'::jsonb),
      '{role}',
      '"admin"'
    )
WHERE email = 'o.ahmed3688@gmail.com';

-- 2. Sync with public.profiles (used for RLS and app logic)
-- Note: You might need to adjust the column names if your schema is different
INSERT INTO public.profiles (id, email, role, full_name, is_admin)
SELECT 
    id, 
    email, 
    'admin', 
    COALESCE(raw_user_meta_data->>'full_name', 'Admin User'),
    true
FROM auth.users
WHERE email = 'o.ahmed3688@gmail.com'
ON CONFLICT (id) DO UPDATE 
SET role = 'admin', is_admin = true;
