import { describe, beforeEach, it } from "cypress"
import { cy, Cypress } from "cypress"

describe("Chat Interface", () => {
  beforeEach(() => {
    // Login first
    cy.visit("/auth/signup")
    cy.get('input[name="name"]').type("Test User")
    cy.get('input[name="email"]').type(`test${Date.now()}@example.com`)
    cy.get('input[name="password"]').type("password123")
    cy.get('input[name="confirmPassword"]').type("password123")
    cy.get("form").submit()
    cy.url().should("include", "/chat")
  })

  it("should display welcome message", () => {
    cy.get("h3").should("contain", "Welcome to Invoice Copilot!")
    cy.get('[data-cy="bot-icon"]').should("be.visible")
  })

  it("should send a message and receive response", () => {
    const testMessage = "Hello, can you help me with my invoices?"

    cy.get('input[placeholder*="Ask me about"]').type(testMessage)
    cy.get('button[type="submit"]').click()

    // Check user message appears
    cy.get('[data-cy="user-message"]').should("contain", testMessage)

    // Check AI response appears (with timeout for API call)
    cy.get('[data-cy="ai-message"]', { timeout: 10000 }).should("exist")
  })

  it("should show typing indicator while loading", () => {
    cy.get('input[placeholder*="Ask me about"]').type("Analyze my invoices")
    cy.get('button[type="submit"]').click()

    // Should show typing indicator
    cy.get('[data-cy="typing-indicator"]').should("be.visible")
  })

  it("should handle file upload", () => {
    const fileName = "test-invoice.pdf"

    // Create a test file
    cy.get('input[type="file"]').selectFile(
      {
        contents: Cypress.Buffer.from("test file content"),
        fileName: fileName,
        mimeType: "application/pdf",
      },
      { force: true },
    )

    cy.get('[data-cy="uploaded-file"]').should("contain", fileName)
  })

  it("should display quick actions in sidebar", () => {
    cy.get('[data-cy="quick-actions"]').should("be.visible")
    cy.get('[data-cy="upload-invoice-btn"]').should("contain", "Upload Invoice")
    cy.get('[data-cy="view-reports-btn"]').should("contain", "View Reports")
    cy.get('[data-cy="analytics-btn"]').should("contain", "Analytics")
  })

  it("should logout successfully", () => {
    cy.get('[data-cy="logout-btn"]').click()
    cy.url().should("not.include", "/chat")
    cy.url().should("include", "/")
  })
})
