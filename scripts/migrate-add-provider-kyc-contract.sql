-- Migration: Add KYC and contract fields to users table for provider onboarding

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS kyc_document_type VARCHAR(50),
  ADD COLUMN IF NOT EXISTS kyc_document_url VARCHAR(255),
  ADD COLUMN IF NOT EXISTS kyc_status VARCHAR(20) DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS contract_url VARCHAR(255),
  ADD COLUMN IF NOT EXISTS contract_status VARCHAR(20) DEFAULT 'pending'; 