import { sanitizer } from "@/lib/sanitizer"
import jest from "jest"

// Mock DOMPurify for testing
jest.mock("dompurify", () => ({
  sanitize: jest.fn((content) => content.replace(/<script.*?<\/script>/gi, "")),
}))

describe("ContentSanitizer", () => {
  describe("sanitizeText", () => {
    it("should remove HTML tags", () => {
      const input = "<p>Hello <strong>world</strong></p>"
      const result = sanitizer.sanitizeText(input)
      expect(result).toBe("Hello world")
    })

    it("should decode HTML entities", () => {
      const input = "Hello &amp; goodbye &lt;test&gt;"
      const result = sanitizer.sanitizeText(input)
      expect(result).toBe("Hello & goodbye <test>")
    })
  })

  describe("validateInput", () => {
    it("should validate normal input", () => {
      const result = sanitizer.validateInput("Hello world")
      expect(result.isValid).toBe(true)
    })

    it("should reject empty input", () => {
      const result = sanitizer.validateInput("")
      expect(result.isValid).toBe(false)
      expect(result.error).toContain("non-empty string")
    })

    it("should reject input that is too long", () => {
      const longInput = "a".repeat(1001)
      const result = sanitizer.validateInput(longInput, 1000)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain("exceeds maximum length")
    })

    it("should reject malicious content", () => {
      const maliciousInput = '<script>alert("xss")</script>'
      const result = sanitizer.validateInput(maliciousInput)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain("malicious content")
    })
  })
})
