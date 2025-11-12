export const getBasePath = () => {
  // In production build, PUBLIC_URL is set by Create React App
  // In development, it's typically empty
  if (process.env.PUBLIC_URL) {
    try {
      const url = new URL(process.env.PUBLIC_URL, 'http://abc.com');
      return url.pathname.replace(/\/$/, ''); // Remove trailing slash
    } catch {
      return '';
    }
  }
  return '';
};

/**
 * Get full path with base path prepended
 * This is mainly for window.location operations
 */
export const getFullPath = (path) => {
  const basePath = getBasePath();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return basePath ? `${basePath}${normalizedPath}` : normalizedPath;
};

/**
 * Navigate using window.location (for non-React Router navigation)
 * Use this sparingly - prefer React Router's navigate() when possible
 */
export const navigateTo = (path) => {
  window.location.href = getFullPath(path);
};

// Export basename for React Router
export const basename = getBasePath();

