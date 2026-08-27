-- ============================================
-- Wembo Security Schema
-- Run this in your Supabase SQL Editor:
-- Dashboard → SQL Editor → New Query → Paste → Run
-- ============================================

-- Security events logged by the bot
CREATE TABLE IF NOT EXISTS security_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guild_id TEXT NOT NULL,
  event_type TEXT NOT NULL,        -- 'raid', 'spam', 'phishing', 'impersonation', 'suspicious_join'
  severity TEXT NOT NULL,           -- 'high', 'medium', 'low'
  description TEXT NOT NULL,
  user_id TEXT,                     -- Discord user ID who triggered it (if applicable)
  user_tag TEXT,                    -- e.g. 'spammer#0001'
  action_taken TEXT,                -- 'banned', 'kicked', 'muted', 'message_deleted', 'blocked'
  metadata JSONB DEFAULT '{}',     -- extra data (message content, link URL, join count, etc.)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast queries by guild and time
CREATE INDEX IF NOT EXISTS idx_security_events_guild_time ON security_events(guild_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_events_type ON security_events(guild_id, event_type);

-- Security module settings per guild
CREATE TABLE IF NOT EXISTS security_modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guild_id TEXT NOT NULL,
  module_id TEXT NOT NULL,          -- 'antiraid', 'antispam', 'phishing', 'impersonation'
  enabled BOOLEAN DEFAULT true,
  config JSONB DEFAULT '{}',       -- module-specific settings (thresholds, etc.)
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(guild_id, module_id)
);

-- Server-level security settings
CREATE TABLE IF NOT EXISTS server_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guild_id TEXT NOT NULL UNIQUE,
  lockdown_active BOOLEAN DEFAULT false,
  lockdown_activated_at TIMESTAMPTZ,
  log_channel_id TEXT,              -- channel to send security alerts to
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Aggregate stats (updated periodically by bot for fast dashboard reads)
CREATE TABLE IF NOT EXISTS security_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guild_id TEXT NOT NULL UNIQUE,
  threats_blocked_week INT DEFAULT 0,
  threats_blocked_month INT DEFAULT 0,
  raids_prevented_month INT DEFAULT 0,
  links_scanned_total INT DEFAULT 0,
  accounts_flagged INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Default module entries (run after tables exist)
-- These will be created per-guild when bot joins
-- ============================================


-- ============================================
-- RPC function to increment threat counts
-- ============================================

CREATE OR REPLACE FUNCTION increment_threat_count(p_guild_id TEXT)
RETURNS void AS $$
BEGIN
  INSERT INTO security_stats (guild_id, threats_blocked_week, threats_blocked_month)
  VALUES (p_guild_id, 1, 1)
  ON CONFLICT (guild_id)
  DO UPDATE SET
    threats_blocked_week = security_stats.threats_blocked_week + 1,
    threats_blocked_month = security_stats.threats_blocked_month + 1,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to increment raid count
CREATE OR REPLACE FUNCTION increment_raid_count(p_guild_id TEXT)
RETURNS void AS $$
BEGIN
  UPDATE security_stats
  SET raids_prevented_month = raids_prevented_month + 1, updated_at = NOW()
  WHERE guild_id = p_guild_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment links scanned
CREATE OR REPLACE FUNCTION increment_links_scanned(p_guild_id TEXT, p_count INT DEFAULT 1)
RETURNS void AS $$
BEGIN
  INSERT INTO security_stats (guild_id, links_scanned_total)
  VALUES (p_guild_id, p_count)
  ON CONFLICT (guild_id)
  DO UPDATE SET
    links_scanned_total = security_stats.links_scanned_total + p_count,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;
