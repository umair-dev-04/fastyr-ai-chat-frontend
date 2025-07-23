"use client"

import { useState, useCallback, useMemo } from "react"
import { ApiError } from "@/lib/api"
import { logger } from "@/lib/logger"

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T | null>
  reset: () => void
}

export function useApi<T>(apiFunction: (...args: any[]) => Promise<T>): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      const startTime = Date.now()
      logger.debug("API call started", { functionName: apiFunction.name, args })

      try {
        const result = await apiFunction(...args)
        const duration = Date.now() - startTime

        setState({ data: result, loading: false, error: null })
        logger.debug("API call successful", {
          functionName: apiFunction.name,
          duration: `${duration}ms`,
        })

        return result
      } catch (error) {
        const duration = Date.now() - startTime
        const errorMessage = error instanceof ApiError ? error.message : "An unexpected error occurred"

        setState({ data: null, loading: false, error: errorMessage })
        logger.error("API call failed", error as Error, {
          functionName: apiFunction.name,
          duration: `${duration}ms`,
        })

        return null
      }
    },
    [apiFunction],
  )

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
    logger.debug("API state reset")
  }, [])

  return useMemo(
    () => ({
      ...state,
      execute,
      reset,
    }),
    [state, execute, reset],
  )
}
