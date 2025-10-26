INSERT INTO admins (email, password_hash, first_name, last_name, role)
VALUES (
  'admin@clarivue.dev',
  'dev_salt:6cf16bd85a21b1855efc8d64ba75d80414ff6e2f5ae37517301df579178d8dde89e95576a26af904ed9864245790f2da42ed84d2d02d09858e8e8a2356c12f59',
  'Dev',
  'Admin',
  'admin'
) ON CONFLICT (email) DO NOTHING;
