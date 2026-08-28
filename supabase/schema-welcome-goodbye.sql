-- ============================================
-- Supabase Schema: Welcome & Goodbye Messages
-- Run this in your Supabase SQL editor
-- ============================================

CREATE TABLE IF NOT EXISTS welcome_goodbye_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guild_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('welcome', 'goodbye')),

  -- General settings
  enabled BOOLEAN DEFAULT false,
  channel_id TEXT,

  -- Embed customization
  embed_title TEXT DEFAULT '',
  embed_description TEXT DEFAULT '',
  embed_color TEXT DEFAULT '#5865F2',
  embed_image_url TEXT DEFAULT '',
  embed_thumbnail_url TEXT DEFAULT '',
  embed_footer_text TEXT DEFAULT '',

  -- DM settings
  dm_enabled BOOLEAN DEFAULT false,
  dm_message TEXT DEFAULT '',

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- One config per guild per type
  UNIQUE(guild_id, type)
);

CREATE INDEX IF NOT EXISTS idx_welcome_goodbye_guild_id
  ON welcome_goodbye_config(guild_id);

CREATE INDEX IF NOT EXISTS idx_welcome_goodbye_guild_type
  ON welcome_goodbye_config(guild_id, type);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_welcome_goodbye_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_welcome_goodbye_updated_at
  BEFORE UPDATE ON welcome_goodbye_config
  FOR EACH ROW
  EXECUTE FUNCTION update_welcome_goodbye_updated_at();

-- RLS
ALTER TABLE welcome_goodbye_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON welcome_goodbye_config
  FOR ALL USING (true) WITH CHECK (true);
