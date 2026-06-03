-- Direct Primary Care Directory Schema
-- Supabase project: fbuqrnzofktepkzyfmhy
-- Tables use dpc_ prefix per directory convention

-- Drop bootstrap generic tables (safe: empty at build time)
DROP TABLE IF EXISTS direct_primary_care_reviews CASCADE;
DROP TABLE IF EXISTS direct_primary_care_payments CASCADE;
DROP TABLE IF EXISTS direct_primary_care_claims CASCADE;
DROP TABLE IF EXISTS direct_primary_care_listings CASCADE;

-- ─── dpc_listings ─────────────────────────────────────────────────────────────
CREATE TABLE dpc_listings (
  id                       UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                     TEXT        UNIQUE NOT NULL,
  full_name                TEXT        NOT NULL,
  practice_name            TEXT,
  bio                      TEXT,
  photo_url                TEXT,
  phone                    TEXT,
  email                    TEXT,
  website                  TEXT,
  address_line1            TEXT,
  city                     TEXT        NOT NULL,
  state                    TEXT        NOT NULL,
  zip                      TEXT,
  latitude                 DOUBLE PRECISION,
  longitude                DOUBLE PRECISION,
  monthly_fee_min          INTEGER,
  monthly_fee_max          INTEGER,
  family_fee_min           INTEGER,
  family_fee_max           INTEGER,
  accepts_children         BOOLEAN     DEFAULT false,
  min_age                  INTEGER,
  max_age                  INTEGER,
  accepts_insurance_patients BOOLEAN   DEFAULT false,
  telehealth_available     BOOLEAN     DEFAULT false,
  accepting_new_patients   BOOLEAN     DEFAULT true,
  hsa_eligible             BOOLEAN     DEFAULT true,
  specialties              TEXT[]      DEFAULT '{}',
  services_included        TEXT[]      DEFAULT '{}',
  board_certifications     TEXT[]      DEFAULT '{}',
  ehr_system               TEXT,
  listing_tier             TEXT        DEFAULT 'free' CHECK (listing_tier IN ('free','verified','featured')),
  is_active                BOOLEAN     DEFAULT true,
  is_approved              BOOLEAN     DEFAULT true,
  stripe_customer_id       TEXT,
  stripe_subscription_id   TEXT,
  subscription_expires_at  TIMESTAMPTZ,
  claimed_at               TIMESTAMPTZ,
  claimed_by               TEXT,
  source                   TEXT,
  do_not_email             BOOLEAN     DEFAULT false,
  email_source             TEXT,
  outreach_step            INTEGER     NOT NULL DEFAULT 0,
  outreach_sent_at         TIMESTAMPTZ,
  search_vector            TSVECTOR,
  created_at               TIMESTAMPTZ DEFAULT now(),
  updated_at               TIMESTAMPTZ DEFAULT now()
);

-- Full-text search trigger
CREATE OR REPLACE FUNCTION dpc_listings_search_vector_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.full_name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.practice_name, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.city, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(NEW.state, '')), 'C') ||
    setweight(to_tsvector('english', array_to_string(NEW.specialties, ' ')), 'D');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS dpc_listings_tsvector_update ON dpc_listings;
CREATE TRIGGER dpc_listings_tsvector_update
  BEFORE INSERT OR UPDATE ON dpc_listings
  FOR EACH ROW EXECUTE FUNCTION dpc_listings_search_vector_update();

-- Indexes
CREATE INDEX IF NOT EXISTS dpc_listings_state_idx           ON dpc_listings(state);
CREATE INDEX IF NOT EXISTS dpc_listings_city_idx            ON dpc_listings(city);
CREATE INDEX IF NOT EXISTS dpc_listings_tier_idx            ON dpc_listings(listing_tier);
CREATE INDEX IF NOT EXISTS dpc_listings_active_approved_idx ON dpc_listings(is_active, is_approved);
CREATE INDEX IF NOT EXISTS dpc_listings_search_vector_idx   ON dpc_listings USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS dpc_listings_slug_idx            ON dpc_listings(slug);
CREATE INDEX IF NOT EXISTS dpc_listings_specialties_idx     ON dpc_listings USING GIN(specialties);
CREATE INDEX IF NOT EXISTS dpc_listings_outreach_idx        ON dpc_listings(outreach_step, outreach_sent_at) WHERE do_not_email = false;


-- ─── dpc_claims ───────────────────────────────────────────────────────────────
CREATE TABLE dpc_claims (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id    UUID        REFERENCES dpc_listings(id),
  email         TEXT        NOT NULL,
  token         TEXT        NOT NULL UNIQUE,
  verified      BOOLEAN     DEFAULT false,
  verified_at   TIMESTAMPTZ,
  expires_at    TIMESTAMPTZ NOT NULL,
  status        TEXT        DEFAULT 'pending',
  nudge_sent_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS dpc_claims_listing_id_idx ON dpc_claims(listing_id);
CREATE INDEX IF NOT EXISTS dpc_claims_token_idx      ON dpc_claims(token);


-- ─── dpc_payments ─────────────────────────────────────────────────────────────
CREATE TABLE dpc_payments (
  id                       UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id               UUID        REFERENCES dpc_listings(id),
  stripe_session_id        TEXT,
  stripe_payment_intent_id TEXT,
  amount                   INTEGER,
  tier                     TEXT,
  status                   TEXT,
  created_at               TIMESTAMPTZ DEFAULT now()
);


-- ─── dpc_leads ────────────────────────────────────────────────────────────────
CREATE TABLE dpc_leads (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name         TEXT,
  patient_email        TEXT,
  patient_phone        TEXT,
  zip                  TEXT,
  insurance_status     TEXT,
  health_goals         TEXT,
  preferred_listing_id UUID        REFERENCES dpc_listings(id),
  state                TEXT,
  status               TEXT        DEFAULT 'new',
  created_at           TIMESTAMPTZ DEFAULT now()
);


-- ─── admin_users (shared) ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  id         UUID PRIMARY KEY REFERENCES auth.users(id),
  role       TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT now()
);


-- ─── Row-Level Security ───────────────────────────────────────────────────────
ALTER TABLE dpc_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE dpc_claims   ENABLE ROW LEVEL SECURITY;
ALTER TABLE dpc_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE dpc_leads    ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active dpc listings"
  ON dpc_listings FOR SELECT
  USING (is_active = true AND is_approved = true);

CREATE POLICY "Service role full access dpc_listings"
  ON dpc_listings FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access dpc_claims"
  ON dpc_claims FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access dpc_payments"
  ON dpc_payments FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access dpc_leads"
  ON dpc_leads FOR ALL
  USING (auth.role() = 'service_role');
