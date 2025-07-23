// Centralized constants management
export const TIMING = {
    NOTIFICATION_DURATION: 5000,
    RECONNECT_INTERVAL: 3000,
    TOKEN_REFRESH_BUFFER: 300000, // 5 minutes
    TYPING_INDICATOR_DELAY: 1000,
    AUTO_SAVE_DELAY: 2000,
  } as const
  
  export const ROUTES = {
    HOME: "/",
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    CHAT: "/chat",
    DEMO: "/demo",
  } as const
  
  export const API_ENDPOINTS = {
    AUTH: {
      LOGIN: "/login",
      SIGNUP: "/signup",
      LOGOUT: "/logout",
      REFRESH: "/refresh",
      ME: "/me",
      GOOGLE: "/auth/google",
    },
    CHAT: {
      SEND: "/chat",
      SESSIONS: "/chat/sessions",
      SESSION: (id: string) => `/chat/sessions/${id}`,
      MESSAGES: (id: string) => `/chat/sessions/${id}/messages`,
    },
    UPLOAD: {
      AVATAR: "/upload/avatar",
      INVOICE: "/api/invoices/upload",
    },
  } as const
  
  export const STORAGE_KEYS = {
    AUTH: "invoice_copilot_auth",
    THEME: "theme",
    SIDEBAR_STATE: "sidebar:state",
  } as const
  
  export const VALIDATION = {
    PASSWORD_MIN_LENGTH: 8,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  } as const
  
  export const UI = {
    SIDEBAR_WIDTH: "16rem",
    SIDEBAR_WIDTH_MOBILE: "18rem",
    SIDEBAR_WIDTH_ICON: "3rem",
    MOBILE_BREAKPOINT: 768,
    TOAST_LIMIT: 3,
  } as const
  