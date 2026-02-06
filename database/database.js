// Database connection and helper functions for ChartFlow
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// Database file path
const DB_PATH = path.join(process.cwd(), 'database', 'chartflow.db');

// Ensure database directory exists
if (!fs.existsSync(path.dirname(DB_PATH))) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}

// Database connection singleton
let db = null;

function getDatabase() {
    if (!db) {
        db = new sqlite3.Database(DB_PATH, (err) => {
            if (err) {
                console.error('Error opening database:', err);
            } else {
                console.log('Connected to SQLite database');
            }
        });
        
        // Enable foreign keys
        db.run('PRAGMA foreign_keys = ON');
    }
    return db;
}

// Initialize database with schema
async function initializeDatabase() {
    return new Promise((resolve, reject) => {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        const db = getDatabase();
        db.exec(schema, (err) => {
            if (err) {
                console.error('Error initializing database:', err);
                reject(err);
            } else {
                console.log('Database initialized successfully');
                resolve();
            }
        });
    });
}

// Utility functions
const DatabaseUtils = {
    // Generate secure UUID
    generateUUID() {
        return crypto.randomUUID();
    },

    // Generate secure token
    generateToken(length = 32) {
        return crypto.randomBytes(length).toString('hex');
    },

    // Hash password
    async hashPassword(password) {
        return await bcrypt.hash(password, 12);
    },

    // Verify password
    async verifyPassword(password, hash) {
        return await bcrypt.compare(password, hash);
    },

    // Current Unix timestamp
    now() {
        return Math.floor(Date.now() / 1000);
    },

    // Convert Unix timestamp to Date
    timestampToDate(timestamp) {
        return new Date(timestamp * 1000);
    }
};

// User database operations
const UserDB = {
    // Create new user
    async createUser(userData) {
        const {
            email,
            name,
            company = '',
            password,
            stripeCustomerId = null,
            stripeSubscriptionId = null,
            subscriptionPlan = 'pro'
        } = userData;

        const uuid = DatabaseUtils.generateUUID();
        const passwordHash = password ? await DatabaseUtils.hashPassword(password) : null;
        const now = DatabaseUtils.now();

        return new Promise((resolve, reject) => {
            const db = getDatabase();
            const sql = `
                INSERT INTO users (
                    uuid, email, name, company, password_hash,
                    stripe_customer_id, stripe_subscription_id, subscription_plan,
                    created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            db.run(sql, [
                uuid, email, name, company, passwordHash,
                stripeCustomerId, stripeSubscriptionId, subscriptionPlan,
                now, now
            ], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        id: this.lastID,
                        uuid,
                        email,
                        name,
                        company,
                        subscription_plan: subscriptionPlan
                    });
                }
            });
        });
    },

    // Find user by email
    async findByEmail(email) {
        return new Promise((resolve, reject) => {
            const db = getDatabase();
            const sql = 'SELECT * FROM users WHERE email = ?';
            
            db.get(sql, [email], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row || null);
                }
            });
        });
    },

    // Find user by UUID
    async findByUUID(uuid) {
        return new Promise((resolve, reject) => {
            const db = getDatabase();
            const sql = 'SELECT * FROM users WHERE uuid = ?';
            
            db.get(sql, [uuid], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row || null);
                }
            });
        });
    },

    // Find user by Stripe customer ID
    async findByStripeCustomerId(stripeCustomerId) {
        return new Promise((resolve, reject) => {
            const db = getDatabase();
            const sql = 'SELECT * FROM users WHERE stripe_customer_id = ?';
            
            db.get(sql, [stripeCustomerId], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row || null);
                }
            });
        });
    },

    // Update user subscription info
    async updateSubscription(userId, subscriptionData) {
        const {
            stripeSubscriptionId,
            subscriptionStatus,
            subscriptionPlan,
            trialEndDate,
            billingCycleAnchor
        } = subscriptionData;

        const now = DatabaseUtils.now();

        return new Promise((resolve, reject) => {
            const db = getDatabase();
            const sql = `
                UPDATE users SET 
                    stripe_subscription_id = ?,
                    subscription_status = ?,
                    subscription_plan = ?,
                    trial_end_date = ?,
                    billing_cycle_anchor = ?,
                    updated_at = ?
                WHERE id = ?
            `;

            db.run(sql, [
                stripeSubscriptionId,
                subscriptionStatus,
                subscriptionPlan,
                trialEndDate,
                billingCycleAnchor,
                now,
                userId
            ], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes > 0);
                }
            });
        });
    },

    // Update last login
    async updateLastLogin(userId) {
        const now = DatabaseUtils.now();
        
        return new Promise((resolve, reject) => {
            const db = getDatabase();
            const sql = 'UPDATE users SET last_login_at = ? WHERE id = ?';
            
            db.run(sql, [now, userId], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes > 0);
                }
            });
        });
    },

    // Get user with project statistics
    async getUserWithStats(userId) {
        return new Promise((resolve, reject) => {
            const db = getDatabase();
            const sql = `
                SELECT 
                    u.*,
                    COUNT(p.id) as project_count,
                    SUM(CASE WHEN p.status = 'active' THEN 1 ELSE 0 END) as active_projects
                FROM users u
                LEFT JOIN projects p ON u.id = p.user_id
                WHERE u.id = ?
                GROUP BY u.id
            `;
            
            db.get(sql, [userId], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row || null);
                }
            });
        });
    }
};

// Project database operations
const ProjectDB = {
    // Create new project
    async createProject(projectData) {
        const {
            userId,
            name,
            description = '',
            csvFilename = null,
            csvSize = null,
            dashboardConfig = '{}'
        } = projectData;

        const uuid = DatabaseUtils.generateUUID();
        const now = DatabaseUtils.now();

        return new Promise((resolve, reject) => {
            const db = getDatabase();
            const sql = `
                INSERT INTO projects (
                    uuid, user_id, name, description,
                    csv_filename, csv_size, csv_upload_date,
                    dashboard_config, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            db.run(sql, [
                uuid, userId, name, description,
                csvFilename, csvSize, csvSize ? now : null,
                dashboardConfig, now, now
            ], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        id: this.lastID,
                        uuid,
                        name,
                        description
                    });
                }
            });
        });
    },

    // Get user's projects
    async getUserProjects(userId, status = 'active') {
        return new Promise((resolve, reject) => {
            const db = getDatabase();
            const sql = `
                SELECT * FROM projects 
                WHERE user_id = ? AND status = ?
                ORDER BY updated_at DESC
            `;
            
            db.all(sql, [userId, status], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows || []);
                }
            });
        });
    },

    // Get project by UUID
    async getProjectByUUID(uuid, userId = null) {
        return new Promise((resolve, reject) => {
            const db = getDatabase();
            let sql = 'SELECT * FROM projects WHERE uuid = ?';
            let params = [uuid];
            
            if (userId) {
                sql += ' AND user_id = ?';
                params.push(userId);
            }
            
            db.get(sql, params, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row || null);
                }
            });
        });
    },

    // Update project
    async updateProject(projectId, updates) {
        const allowedFields = [
            'name', 'description', 'dashboard_config', 
            'chart_types', 'custom_theme', 'is_public'
        ];
        
        const updateFields = [];
        const updateValues = [];
        
        Object.keys(updates).forEach(field => {
            if (allowedFields.includes(field)) {
                updateFields.push(`${field} = ?`);
                updateValues.push(updates[field]);
            }
        });
        
        if (updateFields.length === 0) {
            throw new Error('No valid fields to update');
        }
        
        updateValues.push(DatabaseUtils.now()); // updated_at
        updateValues.push(projectId);
        
        return new Promise((resolve, reject) => {
            const db = getDatabase();
            const sql = `
                UPDATE projects SET 
                    ${updateFields.join(', ')},
                    updated_at = ?
                WHERE id = ?
            `;
            
            db.run(sql, updateValues, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes > 0);
                }
            });
        });
    },

    // Delete project (soft delete)
    async deleteProject(projectId, userId) {
        const now = DatabaseUtils.now();
        
        return new Promise((resolve, reject) => {
            const db = getDatabase();
            const sql = `
                UPDATE projects SET 
                    status = 'deleted',
                    updated_at = ?
                WHERE id = ? AND user_id = ?
            `;
            
            db.run(sql, [now, projectId, userId], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes > 0);
                }
            });
        });
    }
};

// Session management
const SessionDB = {
    // Create session
    async createSession(userId, deviceInfo = {}) {
        const sessionToken = DatabaseUtils.generateToken(64);
        const expiresAt = DatabaseUtils.now() + (30 * 24 * 60 * 60); // 30 days
        const now = DatabaseUtils.now();

        return new Promise((resolve, reject) => {
            const db = getDatabase();
            const sql = `
                INSERT INTO sessions (
                    user_id, session_token, device_info,
                    ip_address, expires_at, created_at, last_used_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            db.run(sql, [
                userId, sessionToken, JSON.stringify(deviceInfo),
                deviceInfo.ip_address || null, expiresAt, now, now
            ], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        id: this.lastID,
                        sessionToken,
                        expiresAt
                    });
                }
            });
        });
    },

    // Validate session
    async validateSession(sessionToken) {
        const now = DatabaseUtils.now();
        
        return new Promise((resolve, reject) => {
            const db = getDatabase();
            const sql = `
                SELECT s.*, u.* FROM sessions s
                JOIN users u ON s.user_id = u.id
                WHERE s.session_token = ? AND s.expires_at > ?
            `;
            
            db.get(sql, [sessionToken, now], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    if (row) {
                        // Update last used time
                        db.run(
                            'UPDATE sessions SET last_used_at = ? WHERE id = ?',
                            [now, row.id]
                        );
                    }
                    resolve(row || null);
                }
            });
        });
    },

    // Delete session (logout)
    async deleteSession(sessionToken) {
        return new Promise((resolve, reject) => {
            const db = getDatabase();
            const sql = 'DELETE FROM sessions WHERE session_token = ?';
            
            db.run(sql, [sessionToken], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes > 0);
                }
            });
        });
    },

    // Clean expired sessions
    async cleanExpiredSessions() {
        const now = DatabaseUtils.now();
        
        return new Promise((resolve, reject) => {
            const db = getDatabase();
            const sql = 'DELETE FROM sessions WHERE expires_at <= ?';
            
            db.run(sql, [now], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes);
                }
            });
        });
    }
};

// Analytics tracking
const AnalyticsDB = {
    // Track user action
    async trackAction(actionData) {
        const {
            userId = null,
            projectId = null,
            action,
            metadata = {},
            ipAddress = null,
            userAgent = null
        } = actionData;

        const now = DatabaseUtils.now();

        return new Promise((resolve, reject) => {
            const db = getDatabase();
            const sql = `
                INSERT INTO usage_analytics (
                    user_id, project_id, action, metadata,
                    ip_address, user_agent, recorded_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            db.run(sql, [
                userId, projectId, action, JSON.stringify(metadata),
                ipAddress, userAgent, now
            ], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    },

    // Get user analytics summary
    async getUserAnalytics(userId, days = 30) {
        const since = DatabaseUtils.now() - (days * 24 * 60 * 60);
        
        return new Promise((resolve, reject) => {
            const db = getDatabase();
            const sql = `
                SELECT 
                    action,
                    COUNT(*) as count,
                    MAX(recorded_at) as last_action
                FROM usage_analytics 
                WHERE user_id = ? AND recorded_at >= ?
                GROUP BY action
                ORDER BY count DESC
            `;
            
            db.all(sql, [userId, since], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows || []);
                }
            });
        });
    }
};

module.exports = {
    getDatabase,
    initializeDatabase,
    DatabaseUtils,
    UserDB,
    ProjectDB,
    SessionDB,
    AnalyticsDB
};