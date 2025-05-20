-- Add verification and reset token columns to users table
ALTER TABLE users
ADD COLUMN verification_token TEXT,
ADD COLUMN reset_token TEXT; 