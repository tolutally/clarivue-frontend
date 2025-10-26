INSERT INTO admins (email, password_hash, first_name, last_name, role)
VALUES (
  'admin@clarivue.dev',
  'dev_salt:8d2c3f23cf0e4f8cb3c4c7e9e4f8c4d7b6a5f4e3d2c1b0a9f8e7d6c5b4a3d2e1f0c9b8a7d6e5f4c3b2a1d0e9f8c7b6a5d4e3f2c1b0a9f8e7d6c5b4a3d2e1',
  'Dev',
  'Admin',
  'admin'
) ON CONFLICT (email) DO NOTHING;
