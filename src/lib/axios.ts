import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor — attach Bearer token from the readable accessToken cookie
api.interceptors.request.use(
  async (config) => {
    let token: string | undefined;

    if (typeof window !== 'undefined') {
      const match = document.cookie.match(new RegExp('(^| )accessToken=([^;]+)'));
      if (match) token = match[2];
    } else {
      try {
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();
        token = cookieStore.get('accessToken')?.value;
      } catch {
        // Outside request context — no token available
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Queue for concurrent requests during refresh
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthRequest = originalRequest.url?.includes('/auth/');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // refreshToken is an httpOnly cookie — no body needed, browser sends it automatically
        const response = await axios.post(
          (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/') + 'v1/auth/refresh',
          null,
          { withCredentials: true },
        );

        const { accessToken } = response.data as { accessToken: string };

        // Backend sets the new httpOnly refreshToken cookie and the readable accessToken cookie.
        // Update the readable accessToken cookie for the Authorization header.
        if (typeof window !== 'undefined') {
          document.cookie = `accessToken=${accessToken}; path=/; max-age=900; SameSite=Strict`;
        }

        api.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
        processQueue(null, accessToken);
        originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        if (typeof window !== 'undefined') {
          const returnPath = window.location.pathname + window.location.search;
          const q = `?callbackUrl=${encodeURIComponent(returnPath)}`;
          if (returnPath.startsWith('/seller')) {
            window.location.href = '/seller' + q;
          } else if (returnPath.startsWith('/admin')) {
            window.location.href = '/admin/auth' + q;
          } else {
            window.location.href = '/' + q;
          }
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
