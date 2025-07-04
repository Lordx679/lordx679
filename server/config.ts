// Configuration file that reads from environment variables
// This file handles all secrets and sensitive configuration

interface DatabaseConfig {
  url: string;
  maxConnections: number;
  connectionTimeout: number;
}

interface GitHubConfig {
  clientId: string;
  clientSecret: string;
  callbackURL: string;
}

interface SessionConfig {
  secret: string;
  name: string;
  maxAge: number;
  secure: boolean;
  sameSite: "strict" | "lax" | "none";
}

interface AppConfig {
  port: number;
  environment: string;
  domain: string;
  corsOrigin: string;
}

interface AdminConfig {
  adminUsers: string[];
  permissions: {
    canCreateProjects: boolean;
    canEditAllProjects: boolean;
    canDeleteProjects: boolean;
    canManageUsers: boolean;
    canViewStats: boolean;
    canModerateContent: boolean;
  };
}

interface UploadConfig {
  maxFileSize: number;
  allowedTypes: string[];
  uploadPath: string;
  publicPath: string;
}

interface SecurityConfig {
  rateLimitWindow: number;
  rateLimitMax: number;
  bcryptRounds: number;
  jwtExpiry: string;
}

interface EmailConfig {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  fromEmail: string;
}

interface FeatureFlags {
  enableEmailNotifications: boolean;
  enableFileUploads: boolean;
  enableRateLimiting: boolean;
  enableAnalytics: boolean;
  maintenanceMode: boolean;
}

// Database Configuration  
export const DATABASE_CONFIG: DatabaseConfig = {
  url: process.env.DATABASE_URL || "mongodb+srv://codex-us2:codex-us2@codex-us2.62zm1.mongodb.net/?retryWrites=true&w=majority&appName=codex-us2",
  maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || "10"),
  connectionTimeout: parseInt(process.env.DB_TIMEOUT || "30000")
};

// GitHub OAuth Configuration
export const GITHUB_CONFIG = {
  clientId: process.env.GITHUB_CLIENT_ID || "Ov23lihaX4CSTXNgP0F4",
  clientSecret: process.env.GITHUB_CLIENT_SECRET || "39c16791e0e0438def3f45e67fa84cb848a746ff",
  callbackURL: process.env.GITHUB_CALLBACK_URL || "/api/auth/github/callback"
};

// Session Configuration
export const SESSION_CONFIG = {
  secret: process.env.SESSION_SECRET || "nuEdb4WjWWj/JQ5qex1mbx5Ia1cn11A0uXySXKAFlzQCJMy5URYBEHjy8uLGU4/vptQT6E+2gtlYjNevSbM06w==",
  name: process.env.SESSION_NAME || "discord-projects-session",
  maxAge: parseInt(process.env.SESSION_MAX_AGE || "86400000"), // 24 hours
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax"
};

// Application Configuration
export const APP_CONFIG = {
  port: parseInt(process.env.PORT || "5000"),
  environment: process.env.NODE_ENV || "development",
  domain: process.env.REPLIT_DEV_DOMAIN || "localhost",
  corsOrigin: process.env.CORS_ORIGIN || "*"
};

// Admin Configuration
export const ADMIN_CONFIG = {
  // List of admin user IDs
  adminUsers: (process.env.ADMIN_USER_IDS || "190771533").split(","),
  // Admin permissions
  permissions: {
    canCreateProjects: true,
    canEditAllProjects: true,
    canDeleteProjects: true,
    canManageUsers: true,
    canViewStats: true,
    canModerateContent: true
  }
};

// File Upload Configuration
export const UPLOAD_CONFIG = {
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || "10485760"), // 10MB
  allowedTypes: (process.env.ALLOWED_FILE_TYPES || "zip,rar,7z,tar.gz,jpg,jpeg,png,gif").split(","),
  uploadPath: process.env.UPLOAD_PATH || "./uploads",
  publicPath: process.env.PUBLIC_PATH || "/uploads"
};

// Security Configuration
export const SECURITY_CONFIG: SecurityConfig = {
  rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || "900000"), // 15 minutes
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || "100"), // requests per window
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || "12"),
  jwtExpiry: process.env.JWT_EXPIRY || "7d"
};

// Email Configuration (for future features)
export const EMAIL_CONFIG = {
  smtpHost: process.env.SMTP_HOST || "",
  smtpPort: parseInt(process.env.SMTP_PORT || "587"),
  smtpUser: process.env.SMTP_USER || "",
  smtpPass: process.env.SMTP_PASS || "",
  fromEmail: process.env.FROM_EMAIL || "noreply@discord-projects.com"
};

// Feature Flags
export const FEATURE_FLAGS = {
  enableEmailNotifications: process.env.ENABLE_EMAIL === "true",
  enableFileUploads: process.env.ENABLE_UPLOADS !== "false", // enabled by default
  enableRateLimiting: process.env.ENABLE_RATE_LIMIT !== "false",
  enableAnalytics: process.env.ENABLE_ANALYTICS === "true",
  maintenanceMode: process.env.MAINTENANCE_MODE === "true"
};

// Validation function to check if all required configs are present
export function validateConfig() {
  const errors = [];
  
  if (!DATABASE_CONFIG.url) {
    errors.push("DATABASE_URL is required");
  }
  
  if (!GITHUB_CONFIG.clientId) {
    errors.push("GITHUB_CLIENT_ID is required");
  }
  
  if (!GITHUB_CONFIG.clientSecret) {
    errors.push("GITHUB_CLIENT_SECRET is required");
  }
  
  if (SESSION_CONFIG.secret === "your-session-secret-key-change-this-in-production") {
    errors.push("SESSION_SECRET should be changed in production");
  }
  
  return errors;
}

// Export all configs as a single object for easy access
export default {
  database: DATABASE_CONFIG,
  github: GITHUB_CONFIG,
  session: SESSION_CONFIG,
  app: APP_CONFIG,
  admin: ADMIN_CONFIG,
  upload: UPLOAD_CONFIG,
  security: SECURITY_CONFIG,
  email: EMAIL_CONFIG,
  features: FEATURE_FLAGS,
  validate: validateConfig
};