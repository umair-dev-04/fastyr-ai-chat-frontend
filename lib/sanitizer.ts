// Content sanitization utilities
import DOMPurify from "dompurify"

interface SanitizeOptions {
  allowedTags?: string[]
  allowedAttributes?: string[]
  stripTags?: boolean
}

class ContentSanitizer {
  private defaultOptions: SanitizeOptions = {
    allowedTags: ["p", "br", "strong", "em", "u", "code", "pre", "blockquote", "ul", "ol", "li"],
    allowedAttributes: ["class"],
    stripTags: false,
  }

  sanitizeHtml(content: string, options?: SanitizeOptions): string {
    if (typeof window === "undefined") {
      // Server-side: basic sanitization
      return this.basicSanitize(content)
    }

    const opts = { ...this.defaultOptions, ...options }

    const config: any = {
      ALLOWED_TAGS: opts.allowedTags,
      ALLOWED_ATTR: opts.allowedAttributes,
      KEEP_CONTENT: !opts.stripTags,
    }

    return DOMPurify.sanitize(content, config)
  }

  sanitizeText(content: string): string {
    // Remove HTML tags and decode entities
    return content
      .replace(/<[^>]*>/g, "") // Remove HTML tags
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .trim()
  }

  private basicSanitize(content: string): string {
    // Basic server-side sanitization
    return content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
      .replace(/javascript:/gi, "")
      .replace(/on\w+\s*=/gi, "")
  }

  validateInput(input: string, maxLength = 1000): { isValid: boolean; error?: string } {
    if (!input || typeof input !== "string") {
      return { isValid: false, error: "Input must be a non-empty string" }
    }

    if (input.length > maxLength) {
      return { isValid: false, error: `Input exceeds maximum length of ${maxLength} characters` }
    }

    // Check for potentially malicious patterns
    const maliciousPatterns = [/<script/i, /javascript:/i, /on\w+\s*=/i, /<iframe/i, /<object/i, /<embed/i]

    for (const pattern of maliciousPatterns) {
      if (pattern.test(input)) {
        return { isValid: false, error: "Input contains potentially malicious content" }
      }
    }

    return { isValid: true }
  }
}

export const sanitizer = new ContentSanitizer()
