import { authManager } from "./auth"
import { config } from "./config"
import { logger } from "./logger"
import { API_ENDPOINTS } from "./constants"

export const API_BASE_URL = config.API_BASE_URL

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

export interface ApiError {
  message: string
  status: number
  details?: any
}

class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
    logger.info("API Client initialized", { baseURL })
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const token = authManager.getToken()

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
        // "ngrok-skip-browser-warning": "anyvalue",
      },
      ...options,
    }

    try {
      logger.debug("API Request", { method: config.method || "GET", url, hasToken: !!token })

      const response = await fetch(url, config)

      // Handle 401 - try to refresh token
      if (response.status === 401 && token) {
        logger.warn("Received 401, attempting token refresh")
        const refreshed = await authManager.refreshToken()
        if (refreshed) {
          // Retry with new token
          const newToken = authManager.getToken()
          const retryConfig = {
            ...config,
            headers: {
              ...config.headers,
              Authorization: `Bearer ${newToken}`,
            },
          }
          const retryResponse = await fetch(url, retryConfig)
          return this.handleResponse<T>(retryResponse)
        } else {
          // Redirect to login
          logger.error("Token refresh failed, redirecting to login")
          window.location.href = "/auth/login"
          throw new ApiError("Authentication failed", 401)
        }
      }

      return this.handleResponse<T>(response)
    } catch (error) {
      logger.error("API Request failed", error as Error, { url, method: config.method })
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError("Network error", 0, error)
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("content-type")
    const isJson = contentType?.includes("application/json")

    if (!response.ok) {
      const errorData = isJson ? await response.json() : { message: response.statusText }
      logger.error("API Error Response", undefined, {
        status: response.status,
        statusText: response.statusText,
        errorData,
      })
      throw new ApiError(errorData.detail || errorData.message || "Request failed", response.status, errorData)
    }

    if (isJson) {
      return response.json()
    }

    return response.text() as unknown as T
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" })
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }

  async uploadFile<T>(endpoint: string, file: File, additionalData?: Record<string, string>): Promise<T> {
    const formData = new FormData()
    formData.append("file", file)

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value)
      })
    }

    const token = authManager.getToken()
    return this.request<T>(endpoint, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    })
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: any,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export const apiClient = new ApiClient(API_BASE_URL)

// API endpoints using constants
export const authApi = {
  signup: (userData: { full_name: string; email: string; password: string }) =>
    apiClient.post(API_ENDPOINTS.AUTH.SIGNUP, userData),

  login: (credentials: { email: string; password: string }) => apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials),

  logout: () => apiClient.post(API_ENDPOINTS.AUTH.LOGOUT),

  getCurrentUser: () => apiClient.get(API_ENDPOINTS.AUTH.ME),

  uploadAvatar: (file: File) => apiClient.uploadFile(API_ENDPOINTS.UPLOAD.AVATAR, file),

  googleAuth: async () => {
    const url = await apiClient.get(API_ENDPOINTS.AUTH.GOOGLE)
    window.location.href = url.url
  },
}

export const chatApi = {
  sendMessage: (message: string, sessionId?: string) => {
    const payload: any = { message }
    if (sessionId) {
      payload.session_id = sessionId
    }
    return apiClient.post(API_ENDPOINTS.CHAT.SEND, payload)
  },

  getSessions: () => apiClient.get(API_ENDPOINTS.CHAT.SESSIONS),

  getSession: (sessionId: string) => apiClient.get(API_ENDPOINTS.CHAT.SESSION(sessionId)),

  getSessionMessages: (sessionId: string) => apiClient.get(API_ENDPOINTS.CHAT.MESSAGES(sessionId)),

  deleteSession: (sessionId: string) => apiClient.delete(API_ENDPOINTS.CHAT.SESSION(sessionId)),
}

export const invoiceApi = {
  upload: (file: File) => apiClient.uploadFile(API_ENDPOINTS.UPLOAD.INVOICE, file),

  getAll: () => apiClient.get("/api/invoices"),

  getById: (id: string) => apiClient.get(`/api/invoices/${id}`),
}
