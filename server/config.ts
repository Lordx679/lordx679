// Import configuration from environment-based config file
import config from './config.env.ts';

// Export configurations using environment variables
export const GITHUB_CONFIG = config.github;
export const SESSION_CONFIG = config.session;
export const APP_CONFIG = config.app;
export const ADMIN_CONFIG = config.admin;
export const UPLOAD_CONFIG = config.upload;
export const SECURITY_CONFIG = config.security;
export const FEATURE_FLAGS = config.features;

// Validate configuration on startup
const configErrors = config.validate();
if (configErrors.length > 0) {
  console.warn('Configuration warnings:');
  configErrors.forEach(error => console.warn(`- ${error}`));
}