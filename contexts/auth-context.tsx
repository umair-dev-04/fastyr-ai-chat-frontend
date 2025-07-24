"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authManager } from "@/lib/auth"
import { authApi } from "@/lib/api"
import type { AuthContextType, User } from "@/types"
import { STORAGE_KEYS } from "@/lib/constants"
import { config } from "@/lib/config"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter()

  useEffect(() => {
    const initAuth = () => {
      const authData = authManager.getAuth()
      if (authData && authManager.isAuthenticated()) {
        setUser(authData.user)
      }
      setIsLoading(false)
    }

    initAuth()
  }, [router])

  const signup = async (name: string, email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true)
      await authApi.signup({ full_name: name, email, password })
      router.push("/auth/login")
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true)
      const response = await authApi.login({ email, password })
      
      const authData = {
        token: response.access_token, // Updated to match API response
        user: response.user as User,
        refreshToken: response.refresh_token,
      }

      authManager.setAuth(authData)
      setUser(authData.user)
      router.push("/chat")
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handleAuthGoogle = async (credentialResponse:any) => {
    try {
      const response = await fetch(config.API_BASE_URL+"/auth/google/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: credentialResponse.credential,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem(STORAGE_KEYS.AUTH, data.access_token)
        localStorage.setItem("user", JSON.stringify(data.user))
        const authData = {
          token: data.access_token, // Updated to match API response
          user: data.user as User,
          refreshToken: "",
        }
  
        authManager.setAuth(authData)
        setUser(data.user)
        router.push("/chat")
      } else {
      }
    } catch (err) {
    } finally {
    }
  }

  const googleAuth = (): void => {
    // Redirect to backend Google auth endpoint
    authApi.googleAuth()
  }

  // const googleAuth = async (credential: string): Promise<void> => {
  //   try {
  //     setIsLoading(true)
  //     const response = await authApi.googleAuth(credential)

  //     const authData = {
  //       token: response.token,
  //       user: response.user,
  //       refreshToken: response.refresh_token,
  //     }

  //     authManager.setAuth(authData)
  //     setUser(response.user)
  //     router.push("/chat")
  //   } catch (error) {
  //     throw error
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  const logout = () => {
    authManager.clearAuth()
    setUser(null)
    router.push("/")
  }

  const uploadAvatar = async (file: File): Promise<void> => {
    try {
      setIsLoading(true)
      const response = await authApi.uploadAvatar(file)

      // Update user with new avatar URL
      if (user) {
        const updatedUser = { ...user, avatar_url: response.avatar_url }
        setUser(updatedUser)

        // Update stored auth data
        const authData = authManager.getAuth()
        if (authData) {
          authManager.setAuth({
            ...authData,
            user: updatedUser,
          })
        }
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }


  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && authManager.isAuthenticated(),
    isLoading,
    login,
    signup,
    googleAuth,
    handleAuthGoogle,
    logout,
    uploadAvatar,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
