"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Brain,
  Send,
  LogOut,
  User,
  Paperclip,
  Bot,
  AlertCircle,
  MoreVertical,
  Trash2,
  MessageSquare,
  Plus,
  WifiOff,
  Wifi,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { AuthGuard } from "@/components/auth/auth-guard"
import { useAuth } from "@/contexts/auth-context"
import { useNotifications } from "@/hooks/useNotifications"
import { chatApi, invoiceApi } from "@/lib/api"
import { useApi } from "@/hooks/use-api"
import type { Message } from "@/types"

interface ChatSession {
  id: string
  title: string
  created_at: string
  updated_at: string
  message_count?: number
}

const options = { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric',
  hour: 'numeric', 
  minute: 'numeric',
  hour12: true 
};


function ChatInterface() {
  const { user, logout, uploadAvatar } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [showAllSessions, setShowAllSessions] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  
  // API hooks
  const { execute: sendMessage, loading: sendingMessage } = useApi(chatApi.sendMessage)
  const { execute: uploadFile } = useApi(invoiceApi.upload)
  const { execute: getSessions, loading: loadingSessions } = useApi(chatApi.getSessions)
  const { execute: getSession } = useApi(chatApi.getSession)
  const { execute: getSessionMessages } = useApi(chatApi.getSessionMessages)
  const { execute: deleteSession } = useApi(chatApi.deleteSession)

  // Notifications
  const { notifications, addNotification, removeNotification } = useNotifications()

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      addNotification({
        id: crypto.randomUUID(),
        type: "error",
        title: "Invalid File Type",
        message: "Please select an image file.",
        timestamp: new Date().toISOString(),
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      addNotification({
        id: crypto.randomUUID(),
        type: "error",
        title: "File Too Large",
        message: "Please select an image smaller than 5MB.",
        timestamp: new Date().toISOString(),
      })
      return
    }

    try {
      await uploadAvatar(file)
      addNotification({
        id: crypto.randomUUID(),
        type: "success",
        title: "Avatar Updated",
        message: "Your profile picture has been updated successfully.",
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Avatar upload failed:", error)
      addNotification({
        id: crypto.randomUUID(),
        type: "error",
        title: "Upload Failed",
        message: "Failed to update profile picture. Please try again.",
        timestamp: new Date().toISOString(),
      })
    }

    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Online/Offline detection
  useEffect(() => {
    const updateOnlineStatus = () => {
      const online = navigator.onLine
      setIsOnline(online)

      if (!online) {
        addNotification({
          id: "offline-notification",
          type: "error",
          title: "Connection Lost",
          message: "Check your internet connection. Some features may not work.",
          timestamp: new Date().toISOString(),
        })
      } else {
        removeNotification("offline-notification")
      }
    }

    // Set initial status
    updateOnlineStatus()

    // Listen for online/offline events
    window.addEventListener("online", updateOnlineStatus)
    window.addEventListener("offline", updateOnlineStatus)

    return () => {
      window.removeEventListener("online", updateOnlineStatus)
      window.removeEventListener("offline", updateOnlineStatus)
    }
  }, [addNotification, removeNotification])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (isOnline) {
      loadSessions()
    }
  }, [isOnline])

  const loadSessions = async () => {
    try {
      const data = await getSessions()
      setSessions(data || [])
    } catch (error) {
      console.error("Failed to load sessions:", error)
      addNotification({
        id: crypto.randomUUID(),
        type: "error",
        title: "Failed to Load Sessions",
        message: "Could not load your chat sessions. Please try again.",
        timestamp: new Date().toISOString(),
      })
    }
  }

  const loadSessionMessages = async (sessionId: string) => {
    if (!isOnline) {
      addNotification({
        id: crypto.randomUUID(),
        type: "error",
        title: "No Internet Connection",
        message: "Please check your internet connection and try again.",
        timestamp: new Date().toISOString(),
      })
      return
    }

    try {
      setMessages([]) // Clear current messages
      setCurrentSessionId(sessionId)

      const data = await getSessionMessages(sessionId)
      setMessages(data || [])
    } catch (error) {
      console.error("Failed to load session messages:", error)
      addNotification({
        id: crypto.randomUUID(),
        type: "error",
        title: "Failed to Load Messages",
        message: "Could not load messages for this session. Please try again.",
        timestamp: new Date().toISOString(),
      })
    }
  }

  const handleDeleteSession = async (sessionId: string, event: React.MouseEvent) => {
    event.stopPropagation() // Prevent session selection when clicking delete

    if (!isOnline) {
      addNotification({
        id: crypto.randomUUID(),
        type: "error",
        title: "No Internet Connection",
        message: "Please check your internet connection and try again.",
        timestamp: new Date().toISOString(),
      })
      return
    }

    try {
      await deleteSession(sessionId)
      setSessions((prev) => prev.filter((session) => session.session_id !== sessionId))

      // If we deleted the current session, clear the messages
      if (currentSessionId === sessionId) {
        setCurrentSessionId(null)
        setMessages([])
      }

      addNotification({
        id: crypto.randomUUID(),
        type: "success",
        title: "Session Deleted",
        message: "Chat session has been deleted successfully.",
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Failed to delete session:", error)
      addNotification({
        id: crypto.randomUUID(),
        type: "error",
        title: "Delete Failed",
        message: "Could not delete the session. Please try again.",
        timestamp: new Date().toISOString(),
      })
    }
  }

  const startNewSession = () => {
    setCurrentSessionId(null)
    setMessages([])
    setInput("")
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!input.trim() && !uploadedFile) return

    if (!isOnline) {
      addNotification({
        id: crypto.randomUUID(),
        type: "error",
        title: "No Internet Connection",
        message: "Please check your internet connection and try again.",
        timestamp: new Date().toISOString(),
      })
      return
    }

    let messageContent = input

    try {
      setIsTyping(true)

      // Add user message to UI immediately
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: messageContent,
        timestamp: new Date().toLocaleString('en-US', options),
        session_id: currentSessionId || undefined,
      }
      setMessages((prev) => [...prev, userMessage])

      const response = await sendMessage(messageContent, currentSessionId || undefined)

      // Update current session ID if this was a new session
      if (!currentSessionId && response.session_id) {
        setCurrentSessionId(response.session_id)
        // Reload sessions to include the new one
        loadSessions()
      }

      // Add AI response to messages
      if (response.message) {
        const aiMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: response.message,
          timestamp: response?.assistant_message_created_at && new Date(response.assistant_message_created_at).toLocaleString('en-US', options) || new Date().toLocaleString('en-US', options),
          session_id: response.session_id,
        }
        setMessages((prev) => [...prev, aiMessage])
      }

      setInput("")
      setIsTyping(false)
    } catch (error) {
      console.error("Failed to send message:", error)
      setIsTyping(false)
      addNotification({
        id: crypto.randomUUID(),
        type: "error",
        title: "Message Failed",
        message: "Failed to send message. Please try again.",
        timestamp: new Date().toISOString(),
      })
    }
  }

  const displayedSessions = showAllSessions ? sessions : sessions.slice(0, 6)

  return (
    <SidebarProvider>
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="max-w-sm"
            >
              <Alert className={`${notification.type === "error" ? "border-red-500" : "border-blue-500"}`}>
                <AlertCircle className="h-4 w-4" />
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{notification.title}</h4>
                    <AlertDescription>{notification.message}</AlertDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeNotification(notification.id)}
                    className="ml-2"
                  >
                    ×
                  </Button>
                </div>
              </Alert>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Sidebar */}
      <Sidebar className="border-r border-gray-200">
        <SidebarHeader className="border-b border-gray-200 p-6 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">AI Assistant</span>
            </div>
            {messages.length > 0 && (
              <Button variant="ghost" size="sm" onClick={startNewSession} className="text-blue-600 hover:text-blue-700">
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent className=" bg-white">
          {/* User Info */}
          <SidebarGroup>
            <div className="p-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="cursor-pointer hover:opacity-80 transition-opacity" onClick={handleAvatarClick}>
                    <AvatarImage src={user?.avatar_url || ""} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{user?.full_name}</p>
                  <p className="text-sm text-gray-500 truncate leading-tight" title={user?.email}>
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
          </SidebarGroup>

          {/* Chat Sessions */}
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center justify-between">
              <span>Recent Chats</span>
              {loadingSessions && (
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              )}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {displayedSessions.map((session) => (
                  <SidebarMenuItem key={session.id} className="my-2">
                    <SidebarMenuButton
                      onClick={() => loadSessionMessages(session.session_id)}
                      isActive={currentSessionId === session.id}
                      className="group relative"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <div className="flex-1 min-w-0 ">
                        <p className="text-sm font-medium truncate">{session.title || "Untitled Chat"}</p>
                        <p className="text-xs text-gray-500">{new Date(session.messages[0].created_at).toLocaleString('en-US', options)}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => handleDeleteSession(session.session_id, e)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Session
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}

                {sessions.length === 0 && !loadingSessions && (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No chat sessions yet</p>
                    <p className="text-xs text-gray-400 mt-1">Start a conversation to create your first session</p>
                  </div>
                )}

                {sessions.length > 6 && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setShowAllSessions(!showAllSessions)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {showAllSessions ? "Show Less" : `Show More (${sessions.length - 6})`}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-gray-200 p-4 bg-white">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={logout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Main Chat Area */}
      <SidebarInset>
        <div className="flex flex-col h-screen">
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {currentSessionId ? "Chat Session" : "AI Assistant"}
                </h1>
                <p className="text-sm text-gray-600">
                  {currentSessionId
                    ? "Continue your conversation"
                    : "Ask me anything - from questions to calculations, writing help, and more"}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className={isOnline ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
              {isOnline ? (
                <>
                  <Wifi className="w-2 h-2 mr-2" />
                  Online
                </>
              ) : (
                <>
                  <WifiOff className="w-2 h-2 mr-2" />
                  Offline
                </>
              )}
            </Badge>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <AnimatePresence>
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <Bot className="h-16 w-16 text-blue-600 mx-auto mb-4" data-cy="bot-icon" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {currentSessionId ? "Session Loaded" : "Welcome to AI Assistant!"}
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    {currentSessionId
                      ? "Your previous conversation has been loaded. Continue where you left off!"
                      : "I'm here to help you with anything you need. Try asking me something like:"}
                  </p>
                  {!currentSessionId && (
                    <div className="mt-6 space-y-2 max-w-md mx-auto">
                      <div className="text-sm text-gray-500 bg-gray-100 rounded-lg p-3">
                        "Explain quantum physics in simple terms"
                      </div>
                      <div className="text-sm text-gray-500 bg-gray-100 rounded-lg p-3">
                        "Help me write a professional email"
                      </div>
                      <div className="text-sm text-gray-500 bg-gray-100 rounded-lg p-3">
                        "Calculate compound interest for $1000 at 5% for 10 years"
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  data-cy={message.role === "user" ? "user-message" : "ai-message"}
                >
                  <div className={`flex max-w-3xl ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <Avatar className="flex-shrink-0">
                      {message.role === "user" ? (
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      ) : (
                        <AvatarFallback className="bg-blue-100">
                          <Bot className="h-4 w-4 text-blue-600" />
                        </AvatarFallback>
                      )}
                    </Avatar>

                    <div className={`mx-3 ${message.role === "user" ? "text-right" : "text-left"}`}>
                      <div
                        className={`inline-block p-4 rounded-lg ${
                          message.role === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-white border border-gray-200 text-gray-900"
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{message.content}</div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {message.timestamp}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {(sendingMessage || isTyping) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
                data-cy="typing-indicator"
              >
                <div className="flex max-w-3xl">
                  <Avatar className="flex-shrink-0">
                    <AvatarFallback className="bg-blue-100">
                      <Bot className="h-4 w-4 text-blue-600" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="mx-3">
                    <div className="inline-block p-4 rounded-lg bg-white border border-gray-200">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-white border-t border-gray-200 p-4">
            {!isOnline && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                <WifiOff className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-800">
                  No internet connection. Please check your connection and try again.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex space-x-4">
              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    isOnline
                      ? "Ask me anything - questions, calculations, writing help, and more..."
                      : "Please check your internet connection..."
                  }
                  className="pr-12"
                  disabled={sendingMessage || !isOnline}
                />
              </div>
              <Button type="submit" disabled={sendingMessage || (!input.trim() && !uploadedFile) || !isOnline}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default function ChatPage() {
  return (
    <AuthGuard requireAuth={true}>
      <ChatInterface />
    </AuthGuard>
  )
}
