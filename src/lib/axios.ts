import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/', // Default to local API if not set
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    let token: string | undefined;

    // Client-side: Get token from cookies
    if (typeof window !== 'undefined') {
      const match = document.cookie.match(new RegExp('(^| )accessToken=([^;]+)'));
      if (match) token = match[2];
    }
    // Server-side: Get token from next/headers
    else {
      try {
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();
        token = cookieStore.get('accessToken')?.value;
      } catch (error) {
        // Ignore errors if outside request context
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Queue for concurrent requests during refresh
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Do not attempt to refresh token for authentication endpoints
    const isAuthRequest = originalRequest.url?.includes('/auth/');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        let refreshToken: string | undefined;

        // Client-side: Get refresh token from cookies
        if (typeof window !== 'undefined') {
          const match = document.cookie.match(new RegExp('(^| )refreshToken=([^;]+)'));
          if (match) refreshToken = match[2];
        }
        // Server-side: Get refresh token from next/headers
        else {
          try {
            const { cookies } = await import('next/headers');
            const cookieStore = await cookies();
            refreshToken = cookieStore.get('refreshToken')?.value;
          } catch (error) {
            // Ignore errors if outside request context
          }
        }

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Call refresh endpoint
        // Using axios directly to avoid interceptors
        const response = await axios.post(
          (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/') + 'v1/auth/refresh',
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Update cookies
        if (typeof window !== 'undefined') {
          document.cookie = `accessToken=${accessToken}; path=/; max-age=86400; SameSite=Strict`;
          document.cookie = `refreshToken=${newRefreshToken}; path=/; max-age=604800; SameSite=Strict`;
        } else {
          try {
            const { cookies } = await import('next/headers');
            const cookieStore = await cookies();
            // Note: cookies().set() is only available in Server Actions or Route Handlers
            // Check if set method is available (it might not be in RSC)
            if ('set' in cookieStore && typeof cookieStore.set === 'function') {
              // @ts-ignore - dynamic check covers it
              cookieStore.set('accessToken', accessToken);
              // @ts-ignore
              cookieStore.set('refreshToken', newRefreshToken);
            }
          } catch (error) {
            console.error('Failed to set cookies on server side during refresh', error);
          }
        }

        api.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
        processQueue(null, accessToken);
        originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        // Clear cookies and redirect on failure
        if (typeof window !== 'undefined') {
          // Optional: clear cookies
          document.cookie = 'accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
          document.cookie = 'refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

          const currentPath = window.location.pathname;
          if (currentPath.startsWith('/seller')) {
            window.location.href = '/seller';
          } else if (currentPath.startsWith('/admin')) {
            window.location.href = '/admin/auth';
          } else {
            window.location.href = '/login';
          }
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle global errors here
    return Promise.reject(error);
  }
);

export default api;
