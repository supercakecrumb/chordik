// Prefer runtime override, then build-time env, then default to '/api'
// Strip trailing slash to avoid double slashes
export const API_BASE = (window.__ENV?.API_BASE_URL ??
                         import.meta.env.VITE_API_BASE_URL ??
                         '/api').replace(/\/$/, '');