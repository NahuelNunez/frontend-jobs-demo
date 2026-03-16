import axios from "axios";

// Configuración base de la API
const API_BASE_URL = import.meta.env.VITE_URL || "http://localhost:3000/api/v1";

if (!import.meta.env.VITE_URL) {
  console.warn("VITE_URL no está definida, usando valor por defecto");
}

// Tipos para la cola de peticiones fallidas
interface QueuedRequest {
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}

// Variable para controlar si ya se está refrescando el token
let isRefreshing = false;
let failedQueue: QueuedRequest[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

// Crear instancia de axios con configuración por defecto
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token de autenticación
api.interceptors.request.use(
  (config) => {
    const data = localStorage.getItem("token");
    if (data) {
      config.headers.Authorization = `Bearer ${data}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401 y no hemos intentado refrescar aún
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Si ya se está refrescando, agregar a la cola
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        // No hay refresh token, cerrar sesión y redirigir al login
        isRefreshing = false;
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.href = "/";
        return Promise.reject(error);
      }

      try {
        // Llamar al endpoint de refresh token (enviar refreshToken en el body)
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          { refreshToken },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // El backend devuelve { accessToken, refreshToken }
        const { accessToken, refreshToken: newRefreshToken } =
          response.data.data;

        // Actualizar ambos tokens en localStorage
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        // Actualizar el header de la petición original
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Procesar cola de peticiones pendientes
        processQueue(null, accessToken);
        isRefreshing = false;

        // Reintentar la petición original
        return api(originalRequest);
      } catch (refreshError) {
        // Si falla el refresh, cerrar sesión
        const error =
          refreshError instanceof Error
            ? refreshError
            : new Error("Error al refrescar token");
        processQueue(error, null);
        isRefreshing = false;
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
