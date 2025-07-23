import { jwtDecode } from "jwt-decode"
import { config } from "./config"
import { logger } from "./logger"
import { STORAGE_KEYS } from "./constants"

interface JWTPayload {
  exp: number
  user_id: string
  email: string
}

export interface AuthData {
  token: string
  user: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  refreshToken?: string
}

export class AuthManager {
  private static instance: AuthManager
  private authData: AuthData | null = null

  private constructor() {
    this.loadAuthData()
  }

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager()
    }
    return AuthManager.instance
  }

  private loadAuthData(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AUTH)
      if (stored) {
        const data = JSON.parse(stored)
        if (this.isTokenValid(data.token)) {
          this.authData = data
          logger.info("Auth data loaded from storage")
        } else {
          logger.warn("Stored token is invalid, clearing auth data")
          this.clearAuth()
        }
      }
    } catch (error) {
      logger.error("Failed to load auth data", error as Error)
      this.clearAuth()
    }
  }

  private isTokenValid(token: string): boolean {
    try {
      const decoded = jwtDecode<JWTPayload>(token)
      const isValid = decoded.exp * 1000 > Date.now()
      if (!isValid) {
        logger.debug("Token expired", { exp: decoded.exp, now: Date.now() })
      }
      return isValid
    } catch (error) {
      logger.warn("Token validation failed", { error: (error as Error).message })
      return false
    }
  }

  setAuth(authData: AuthData): void {
    this.authData = authData
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(authData))
    logger.info("Auth data set", { userId: authData.user.id, email: authData.user.email })
  }

  getAuth(): AuthData | null {
    return this.authData
  }

  getToken(): string | null {
    return this.authData?.token || null
  }

  getUser() {
    return this.authData?.user || null
  }

  isAuthenticated(): boolean {
    const isAuth = this.authData !== null && this.isTokenValid(this.authData.token)
    logger.debug("Authentication check", { isAuthenticated: isAuth })
    return isAuth
  }

  clearAuth(): void {
    this.authData = null
    localStorage.removeItem(STORAGE_KEYS.AUTH)
    localStorage.removeItem("token") // Legacy cleanup
    localStorage.removeItem("user") // Legacy cleanup
    logger.info("Auth data cleared")
  }

  async refreshToken(): Promise<boolean> {
    if (!this.authData?.refreshToken) {
      logger.warn("No refresh token available")
      return false
    }

    try {
      logger.info("Attempting token refresh")
      const response = await fetch(`${config.API_BASE_URL}/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh_token: this.authData.refreshToken,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        this.setAuth({
          ...this.authData,
          token: data.access_token,
        })
        logger.info("Token refresh successful")
        return true
      } else {
        logger.error("Token refresh failed", undefined, { status: response.status })
      }
    } catch (error) {
      logger.error("Token refresh failed", error as Error)
    }

    this.clearAuth()
    return false
  }
}

export const authManager = AuthManager.getInstance()
