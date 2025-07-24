// Environment configuration
export const config = {
    API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://fastyr-ai-chatbot-backend.invo.email",
    GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
    APP_ENV: process.env.NODE_ENV || "development",
    IS_DEVELOPMENT: process.env.NODE_ENV === "development",
    IS_PRODUCTION: process.env.NODE_ENV === "production",
  } as const
  
  // Validate required environment variables
  export function validateConfig() {
    const requiredVars = {
      GOOGLE_CLIENT_ID: config.GOOGLE_CLIENT_ID,
    }
  
    const missing = Object.entries(requiredVars)
      .filter(([_, value]) => !value)
      .map(([key]) => key)
  
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(", ")}`)
    }
  }
  