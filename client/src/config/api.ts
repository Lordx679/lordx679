// API configuration for different environments
export const API_CONFIG = {
  // Use environment variable if available, otherwise use relative URLs
  baseUrl: import.meta.env.VITE_API_URL || '',
  endpoints: {
    // Auth endpoints
    login: '/api/login',
    logout: '/api/logout',
    user: '/api/auth/user',
    
    // Project endpoints
    projects: '/api/projects',
    projectDetail: (id: string | number) => `/api/projects/${id}`,
    projectLike: (id: string | number) => `/api/projects/${id}/like`,
    projectLiked: (id: string | number) => `/api/projects/${id}/liked`,
    
    // Admin endpoints
    adminStats: '/api/admin/stats',
    
    // Upload endpoint
    upload: '/api/upload',
    
    // Stats endpoint
    stats: '/api/stats'
  }
};

// Helper function to get full API URL
export function getApiUrl(endpoint: string): string {
  return `${API_CONFIG.baseUrl}${endpoint}`;
}