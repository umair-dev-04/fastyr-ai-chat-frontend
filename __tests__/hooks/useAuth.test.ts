"use client"

import { renderHook, act } from "@testing-library/react"
import { useAuth } from "@/contexts/auth-context"
import { authManager } from "@/lib/auth"
import jest from "jest" // Import jest to declare it

// Mock the auth manager
jest.mock("@/lib/auth", () => ({
  authManager: {
    getAuth: jest.fn(),
    setAuth: jest.fn(),
    clearAuth: jest.fn(),
    isAuthenticated: jest.fn(),
    refreshToken: jest.fn(),
  },
}))

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  })
}))

describe("useAuth hook", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should initialize with loading state", () => {
    ;(authManager.isAuthenticated as jest.Mock).mockReturnValue(false)
    ;(authManager.getAuth as jest.Mock).mockReturnValue(null)

    const { result } = renderHook(() => useAuth())

    expect(result.current.isLoading).toBe(true)
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBe(null)
  })

  it("should handle successful login", async () => {
    const mockUser = {
      id: "1",
      name: "Test User",
      email: "test@example.com",
    }

    const mockAuthData = {
      token: "mock-token",
      user: mockUser,
      refreshToken: "mock-refresh-token",
    }
    ;(authManager.setAuth as jest.Mock).mockImplementation(() => {
      ;(authManager.getAuth as jest.Mock).mockReturnValue(mockAuthData)
      ;(authManager.isAuthenticated as jest.Mock).mockReturnValue(true)
    })

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.login("test@example.com", "password")
    })

    expect(authManager.setAuth).toHaveBeenCalledWith(mockAuthData)
  })

  it("should handle logout", () => {
    const { result } = renderHook(() => useAuth())

    act(() => {
      result.current.logout()
    })

    expect(authManager.clearAuth).toHaveBeenCalled()
  })
})
