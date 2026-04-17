-- Add password_change_required flag to users table for forcing password change on first login
ALTER TABLE "user" ADD COLUMN password_change_required BOOLEAN NOT NULL DEFAULT FALSE;