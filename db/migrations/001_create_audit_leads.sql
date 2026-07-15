CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE audit_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued','running','teaser_ready','pdf_ready','on_hold','delivered','opened','hot_lead','converted','dormant')),
  business_name TEXT NOT NULL,
  website_url TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  name TEXT,
  locale TEXT NOT NULL CHECK (locale IN ('en','fr')),
  source_cta TEXT,
  score_gbp SMALLINT,
  score_website SMALLINT,
  score_reviews SMALLINT,
  score_social SMALLINT,
  score_overall SMALLINT,
  gbp_data JSONB,
  website_data JSONB,
  social_data JSONB,
  llm_prose JSONB,
  drive_doc_url TEXT,
  drive_pdf_url TEXT,
  pdf_ready_at TIMESTAMPTZ,
  on_hold BOOLEAN NOT NULL DEFAULT FALSE,
  delivered_at TIMESTAMPTZ,
  hot_lead BOOLEAN NOT NULL DEFAULT FALSE,
  hot_lead_reason TEXT,
  nurture_step SMALLINT NOT NULL DEFAULT 0,
  nurture_halted_reason TEXT,
  converted_at TIMESTAMPTZ
);

CREATE INDEX idx_audit_leads_status ON audit_leads(status);
CREATE INDEX idx_audit_leads_pdf_ready_at ON audit_leads(pdf_ready_at) WHERE status = 'pdf_ready';
CREATE INDEX idx_audit_leads_nurture ON audit_leads(delivered_at, nurture_step) WHERE status = 'delivered' AND hot_lead = FALSE;
CREATE INDEX idx_audit_leads_created_at ON audit_leads(created_at DESC);
