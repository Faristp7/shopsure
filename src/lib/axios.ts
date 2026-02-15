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

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle global errors here, e.g., redirect to login on 401
    return Promise.reject(error);
  }
);

export default api;
