"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Skeleton } from "@/components/ui/skeleton"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

const publicRoutes = ["/", "/auth/login", "/auth/signup", "/demo"]

export function AuthGuard({ children, requireAuth = true, redirectTo = "/auth/login" }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (isLoading) return

    const isPublicRoute = publicRoutes.includes(pathname)

    if (requireAuth && !isAuthenticated && !isPublicRoute) {
      router.push(redirectTo)
      return
    }

    if (!requireAuth && isAuthenticated && (pathname === "/auth/login" || pathname === "/auth/signup")) {
      router.push("/chat")
      return
    }
  }, [isAuthenticated, isLoading, pathname, router, requireAuth, redirectTo])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    )
  }

  const isPublicRoute = publicRoutes.includes(pathname)

  if (requireAuth && !isAuthenticated && !isPublicRoute) {
    return null // Will redirect
  }

  if (!requireAuth && isAuthenticated && (pathname === "/auth/login" || pathname === "/auth/signup")) {
    return null // Will redirect
  }

  return <>{children}</>
}
