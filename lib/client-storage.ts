// Client-side storage utilities with SSR safety
export class ClientStorage {
    private static isClient = typeof window !== "undefined"
  
    static getItem(key: string): string | null {
      if (!this.isClient) return null
  
      try {
        return localStorage.getItem(key)
      } catch (error) {
        console.warn("Failed to get item from localStorage:", error)
        return null
      }
    }
  
    static setItem(key: string, value: string): boolean {
      if (!this.isClient) return false
  
      try {
        localStorage.setItem(key, value)
        return true
      } catch (error) {
        console.warn("Failed to set item in localStorage:", error)
        return false
      }
    }
  
    static removeItem(key: string): boolean {
      if (!this.isClient) return false
  
      try {
        localStorage.removeItem(key)
        return true
      } catch (error) {
        console.warn("Failed to remove item from localStorage:", error)
        return false
      }
    }
  
    static clear(): boolean {
      if (!this.isClient) return false
  
      try {
        localStorage.clear()
        return true
      } catch (error) {
        console.warn("Failed to clear localStorage:", error)
        return false
      }
    }
  }
  