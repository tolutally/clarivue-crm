/**
 * API Configuration
 * Determines the base URL for API calls based on environment
 */

// For Render deployment: use VITE_API_URL env var
// For Vercel deployment: use relative /api paths
// For local development: use localhost:3001
export const API_BASE_URL = 
  import.meta.env.VITE_API_URL || // Render backend URL
  (import.meta.env.PROD ? '/api' : 'http://localhost:3001'); // Vercel or local

export const getApiUrl = (endpoint: string) => {
  // If using Vercel serverless (no VITE_API_URL set in prod), use relative paths
  if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
    return endpoint; // Already starts with /api
  }
  
  // Otherwise use full URL
  return `${API_BASE_URL}${endpoint}`;
};
