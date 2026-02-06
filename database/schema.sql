-- ChartFlow User Management Database Schema
-- SQLite compatible schema for user accounts, projects, and subscription management

-- Users table - Core user account data
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT UNIQUE NOT NULL, -- Public UUID for API references
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    company TEXT,
    password_hash TEXT, -- For email/password auth
    email_verified BOOLEAN DEFAULT FALSE,
    avatar_url TEXT,
    
    -- Subscription data
    stripe_customer_id TEXT UNIQUE,
    stripe_subscription_id TEXT,
    subscription_status TEXT DEFAULT 'trial', -- trial, active, canceled, past_due
    subscription_plan TEXT DEFAULT 'pro', -- pro, team
    trial_end_date INTEGER, -- Unix timestamp
    billing_cycle_anchor INTEGER, -- Unix timestamp
    
    -- Usage tracking
    projects_created INTEGER DEFAULT 0,
    projects_limit INTEGER DEFAULT 10, -- Based on plan
    storage_used INTEGER DEFAULT 0, -- Bytes
    storage_limit INTEGER DEFAULT 104857600, -- 100MB default
    
    -- Timestamps
    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    last_login_at INTEGER,
    
    -- Preferences
    timezone TEXT DEFAULT 'UTC',
    notification_settings TEXT DEFAULT '{}', -- JSON
    onboarding_completed BOOLEAN DEFAULT FALSE
);

-- Projects table - User dashboard projects
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT UNIQUE NOT NULL,
    user_id INTEGER NOT NULL,
    
    -- Project metadata
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active', -- active, archived, deleted
    
    -- File information
    csv_filename TEXT,
    csv_size INTEGER,
    csv_upload_date INTEGER,
    csv_s3_key TEXT, -- For cloud storage
    
    -- Dashboard configuration
    dashboard_config TEXT, -- JSON configuration
    chart_types TEXT, -- JSON array of chart types used
    custom_theme TEXT, -- JSON theme configuration
    
    -- Sharing and access
    is_public BOOLEAN DEFAULT FALSE,
    public_slug TEXT UNIQUE, -- For public sharing
    password_protected BOOLEAN DEFAULT FALSE,
    access_password_hash TEXT,
    
    -- Usage statistics
    view_count INTEGER DEFAULT 0,
    last_viewed_at INTEGER,
    export_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Sessions table - User authentication sessions
CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    session_token TEXT UNIQUE NOT NULL,
    device_info TEXT, -- JSON with browser, OS, etc.
    ip_address TEXT,
    expires_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    last_used_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Password reset tokens
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at INTEGER NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Email verification tokens
CREATE TABLE IF NOT EXISTS email_verification_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at INTEGER NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Subscription events log
CREATE TABLE IF NOT EXISTS subscription_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    event_type TEXT NOT NULL, -- trial_started, trial_ended, subscription_created, payment_succeeded, etc.
    stripe_event_id TEXT UNIQUE,
    event_data TEXT, -- JSON event data
    processed_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Usage analytics
CREATE TABLE IF NOT EXISTS usage_analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    project_id INTEGER,
    action TEXT NOT NULL, -- login, create_project, upload_csv, export_chart, etc.
    metadata TEXT, -- JSON additional data
    ip_address TEXT,
    user_agent TEXT,
    recorded_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL,
    FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE SET NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users(subscription_status);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_public_slug ON projects(public_slug);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_expires ON sessions(user_id, expires_at);
CREATE INDEX IF NOT EXISTS idx_usage_analytics_user_date ON usage_analytics(user_id, recorded_at);

-- Triggers to update timestamps
CREATE TRIGGER IF NOT EXISTS update_users_timestamp 
    AFTER UPDATE ON users
BEGIN
    UPDATE users SET updated_at = strftime('%s', 'now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_projects_timestamp 
    AFTER UPDATE ON projects
BEGIN
    UPDATE projects SET updated_at = strftime('%s', 'now') WHERE id = NEW.id;
END;

-- Generate UUIDs for new records (using random string as SQLite doesn't have UUID)
CREATE TRIGGER IF NOT EXISTS generate_user_uuid 
    AFTER INSERT ON users
    WHEN NEW.uuid IS NULL
BEGIN
    UPDATE users SET uuid = (
        hex(randomblob(4)) || '-' || 
        hex(randomblob(2)) || '-' || 
        '4' || substr(hex(randomblob(2)), 2) || '-' ||
        'a' || substr(hex(randomblob(2)), 2) || '-' ||
        hex(randomblob(6))
    ) WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS generate_project_uuid 
    AFTER INSERT ON projects
    WHEN NEW.uuid IS NULL
BEGIN
    UPDATE projects SET uuid = (
        hex(randomblob(4)) || '-' || 
        hex(randomblob(2)) || '-' || 
        '4' || substr(hex(randomblob(2)), 2) || '-' ||
        'a' || substr(hex(randomblob(2)), 2) || '-' ||
        hex(randomblob(6))
    ) WHERE id = NEW.id;
END;