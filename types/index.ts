export interface User {
    id: string
    full_name: string
    email: string
    avatar_url?: string
    is_active?: boolean
    google_id?: string | null
    auth_provider?: string | null
    created_at: string
    updated_at?: string
  }
  
  export interface Message {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: string
    session_id?: string
  }
  
  export interface ChatSession {
    id: string
    user_id: string
    created_at: string
    updated_at: string
    messages: Message[]
  }
  
  export interface Invoice {
    id: string
    user_id: string
    client_name: string
    amount: number
    currency: string
    status: "pending" | "paid" | "overdue"
    due_date: string
    created_at: string
    updated_at: string
  }
  
  export interface Notification {
    id: string
    type: "success" | "error" | "info" | "warning"
    title: string
    message: string
    timestamp: string
    duration?: number
  }
  
  export interface WebSocketMessage {
    type: string
    data: any
    session_id?: string
  }
  
  export interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (email: string, password: string) => Promise<void>
    signup: (name: string, email: string, password: string) => Promise<void>
    googleAuth: (credential: string) => Promise<void>
    handleAuthGoogle: (credential: string) => Promise<void>
    logout: () => void
  }
  