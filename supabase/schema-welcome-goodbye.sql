-- ============================================
-- Supabase Schema: Welcome & Goodbye Messages
-- ============================================
-- Run this in your Supabase SQL editor to create the required tables

-- Welcome/Goodbye message configurations per guild
CREATE TABLE IF NOT EXISTS welcome_goodbye_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guild_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('welcome', 'goodbye')),
  
  -- General settings
  enabled BOOLEAN DEFAULT false,
  channel_id TEXT,  -- Discord channel ID where the message is sent
  
  -- Embed customization
  embed_title TEXT DEFAULT '',
  embed_description TEXT DEFAULT '',
  embed_color TEXT DEFAULT '#5865F2',  -- Hex color code
  embed_image_url TEXT DEFAULT '',
  embed_thumbnail_url TEXT DEFAULT '',
  embed_footer_text TEXT DEFAULT '',
  
  -- DM settings
  dm_enabled BOOLEAN DEFAULT false,
  dm_message TEXT DEFAULT '',
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- One config per guild per type (welcome/goodbye)
  UNIQUE(guild_id, type)
);

-- Index for fast lookups by guild
CREATE INDEX IF NOT EXISTS idx_welcome_goodbye_guild_id 
  ON welcome_goodbye_config(guild_id);

-- Index for fast lookups by guild + type
CREATE INDEX IF NOT EXISTS idx_welcome_goodbye_guild_type 
  ON welcome_goodbye_config(guild_id, type);

-- Auto-update the updated_at timestamp
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

-- ============================================
-- Row Level Security (RLS)
-- ============================================

ALTER TABLE welcome_goodbye_config ENABLE ROW LEVEL SECURITY;

-- Policy: Allow the service role (bot/API) full access
CREATE POLICY "Service role full access" ON welcome_goodbye_config
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- Example: Insert default welcome config for a guild
-- ============================================
-- INSERT INTO welcome_goodbye_config (guild_id, type, enabled, channel_id, embed_title, embed_description, embed_color, embed_footer_text)
-- VALUES (
--   '123456789012345678',
--   'welcome',
--   true,
--   '987654321098765432',
--   'Welcome to {server}! 🎉',
--   'Hey {user}, welcome to **{server}**! You are member #{membercount}.\n\nMake sure to read the rules and have fun!',
--   '#5865F2',
--   'Enjoy your stay!'
-- );

-- ============================================
-- Example: Insert default goodbye config for a guild
-- ============================================
-- INSERT INTO welcome_goodbye_config (guild_id, type, enabled, channel_id, embed_title, embed_description, embed_color, embed_footer_text)
-- VALUES (
--   '123456789012345678',
--   'goodbye',
--   true,
--   '987654321098765432',
--   'Goodbye! 👋',
--   '{user} has left **{server}**. We now have {membercount} members.',
--   '#ED4245',
--   'We''ll miss you!'
-- );
