import { describe, beforeEach, it } from "cypress"

describe("Homepage", () => {
  beforeEach(() => {
    cy.visit("/")
  })

  it("should display main navigation", () => {
    cy.get("header").should("be.visible")
    cy.get('[data-cy="logo"]').should("contain", "Invoice Copilot")
    cy.get('[data-cy="login-btn"]').should("be.visible")
    cy.get('[data-cy="get-started-btn"]').should("be.visible")
  })

  it("should display hero section", () => {
    cy.get("h1").should("contain", "Your AI-Powered")
    cy.get("h1").should("contain", "Invoice Assistant")
    cy.get('[data-cy="hero-description"]').should("be.visible")
  })

  it("should display features section", () => {
    cy.get('[data-cy="features-section"]').should("be.visible")
    cy.get('[data-cy="feature-card"]').should("have.length", 4)

    // Check each feature
    cy.get('[data-cy="feature-card"]').eq(0).should("contain", "AI-Powered Chat")
    cy.get('[data-cy="feature-card"]').eq(1).should("contain", "Invoice Analysis")
    cy.get('[data-cy="feature-card"]').eq(2).should("contain", "Financial Reports")
    cy.get('[data-cy="feature-card"]').eq(3).should("contain", "Business Insights")
  })

  it("should navigate to demo page", () => {
    cy.get('[data-cy="watch-demo-btn"]').click()
    cy.url().should("include", "/demo")
  })

  it("should display call-to-action section", () => {
    cy.get('[data-cy="cta-section"]').should("be.visible")
    cy.get('[data-cy="cta-title"]').should("contain", "Ready to transform")
  })

  it("should display footer", () => {
    cy.get("footer").should("be.visible")
    cy.get("footer").should("contain", "© 2025 Invoice Copilot")
  })
})
