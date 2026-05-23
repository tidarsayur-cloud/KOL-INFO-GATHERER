-- ============================================
-- KOL INFO GATHERER - PostgreSQL Schema
-- ============================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Creators table (core)
CREATE TABLE IF NOT EXISTS creators (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id        VARCHAR(100) UNIQUE NOT NULL,
  source            VARCHAR(20) NOT NULL DEFAULT 'kalodata', -- 'kalodata' | 'kolid'
  username          VARCHAR(150),
  display_name      VARCHAR(200),
  platform          VARCHAR(20) NOT NULL DEFAULT 'tiktok', -- tiktok | instagram | youtube
  avatar_url        TEXT,
  profile_url       TEXT,
  bio               TEXT,
  followers         BIGINT DEFAULT 0,
  following         BIGINT DEFAULT 0,
  total_posts       INTEGER DEFAULT 0,
  engagement_rate   DECIMAL(6,2) DEFAULT 0,
  avg_views         BIGINT DEFAULT 0,
  avg_likes         BIGINT DEFAULT 0,
  avg_comments      BIGINT DEFAULT 0,
  avg_shares        BIGINT DEFAULT 0,
  total_likes       BIGINT DEFAULT 0,
  total_views       BIGINT DEFAULT 0,
  rate_card         DECIMAL(15,2),
  tier              VARCHAR(20) GENERATED ALWAYS AS (
    CASE
      WHEN followers < 10000 THEN 'nano'
      WHEN followers < 100000 THEN 'micro'
      WHEN followers < 500000 THEN 'mid-tier'
      ELSE 'macro'
    END
  ) STORED,
  niche             VARCHAR(100),
  category          VARCHAR(100),
  region            VARCHAR(10) DEFAULT 'ID',
  country           VARCHAR(60),
  language          VARCHAR(20),
  is_verified       BOOLEAN DEFAULT FALSE,
  audience_quality  DECIMAL(4,1),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Historical snapshots for trend charts
CREATE TABLE IF NOT EXISTS creator_snapshots (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id      VARCHAR(100) NOT NULL REFERENCES creators(creator_id) ON DELETE CASCADE,
  followers       BIGINT,
  engagement_rate DECIMAL(6,2),
  avg_views       BIGINT,
  avg_likes       BIGINT,
  snapshot_date   DATE NOT NULL,
  UNIQUE(creator_id, snapshot_date)
);

-- Content/Videos table
CREATE TABLE IF NOT EXISTS content (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id    VARCHAR(100) NOT NULL REFERENCES creators(creator_id) ON DELETE CASCADE,
  video_id      VARCHAR(200) UNIQUE NOT NULL,
  platform      VARCHAR(20) NOT NULL,
  title         TEXT,
  description   TEXT,
  video_url     TEXT NOT NULL,
  embed_url     TEXT,
  thumbnail_url TEXT,
  views         BIGINT DEFAULT 0,
  likes         BIGINT DEFAULT 0,
  comments      BIGINT DEFAULT 0,
  shares        BIGINT DEFAULT 0,
  duration      INTEGER, -- seconds
  content_type  VARCHAR(30), -- video | reel | short | livestream | post
  published_at  TIMESTAMPTZ,
  fetched_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Audience demographics
CREATE TABLE IF NOT EXISTS audience_demographics (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id    VARCHAR(100) NOT NULL REFERENCES creators(creator_id) ON DELETE CASCADE,
  age_13_17     DECIMAL(5,2) DEFAULT 0,
  age_18_24     DECIMAL(5,2) DEFAULT 0,
  age_25_34     DECIMAL(5,2) DEFAULT 0,
  age_35_44     DECIMAL(5,2) DEFAULT 0,
  age_45_plus   DECIMAL(5,2) DEFAULT 0,
  gender_male   DECIMAL(5,2) DEFAULT 0,
  gender_female DECIMAL(5,2) DEFAULT 0,
  top_countries JSONB DEFAULT '[]',
  top_cities    JSONB DEFAULT '[]',
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(creator_id)
);

-- User favorites
CREATE TABLE IF NOT EXISTS user_favorites (
  user_id       UUID NOT NULL,
  creator_id    VARCHAR(100) NOT NULL REFERENCES creators(creator_id) ON DELETE CASCADE,
  added_at      TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY(user_id, creator_id)
);

-- Sync log
CREATE TABLE IF NOT EXISTS sync_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sync_type   VARCHAR(50),
  status      VARCHAR(20) DEFAULT 'running',
  records     INTEGER DEFAULT 0,
  errors      INTEGER DEFAULT 0,
  started_at  TIMESTAMPTZ DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  notes       TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_creators_tier ON creators(tier);
CREATE INDEX IF NOT EXISTS idx_creators_platform ON creators(platform);
CREATE INDEX IF NOT EXISTS idx_creators_engagement ON creators(engagement_rate DESC);
CREATE INDEX IF NOT EXISTS idx_creators_followers ON creators(followers DESC);
CREATE INDEX IF NOT EXISTS idx_creators_region ON creators(region);
CREATE INDEX IF NOT EXISTS idx_creators_niche ON creators(niche);
CREATE INDEX IF NOT EXISTS idx_creators_updated ON creators(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_creator ON content(creator_id);
CREATE INDEX IF NOT EXISTS idx_content_views ON content(views DESC);
CREATE INDEX IF NOT EXISTS idx_snapshots_creator_date ON creator_snapshots(creator_id, snapshot_date DESC);
CREATE INDEX IF NOT EXISTS idx_creators_search ON creators USING gin(to_tsvector('simple', coalesce(username,'') || ' ' || coalesce(display_name,'') || ' ' || coalesce(niche,'')));
