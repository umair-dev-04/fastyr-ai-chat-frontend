"use client"

import { useState, useCallback } from "react"

interface Notification {
  id: string
  type: "success" | "error" | "info" | "warning"
  title: string
  message: string
  timestamp: string
  duration?: number
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback((notification: Notification) => {
    setNotifications((prev) => [...prev, notification])

    // Auto-remove notification after duration (default 5 seconds)
    const duration = notification.duration || 5000
    setTimeout(() => {
      removeNotification(notification.id)
    }, duration)
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const clearAllNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
  }
}
