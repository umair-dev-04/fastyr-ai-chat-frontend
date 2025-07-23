import { describe, beforeEach, it } from "cypress"

describe("Authentication Flow", () => {
  beforeEach(() => {
    cy.visit("/")
  })

  it("should navigate to signup page", () => {
    cy.get('[data-cy="get-started-btn"]').click()
    cy.url().should("include", "/auth/signup")
    cy.get("h1").should("contain", "Create Your Account")
  })

  it("should navigate to login page", () => {
    cy.get('[data-cy="login-btn"]').click()
    cy.url().should("include", "/auth/login")
    cy.get("h1").should("contain", "Welcome Back")
  })

  it("should show validation errors for empty signup form", () => {
    cy.visit("/auth/signup")
    cy.get("form").submit()
    cy.get('input[name="name"]:invalid').should("exist")
    cy.get('input[name="email"]:invalid').should("exist")
    cy.get('input[name="password"]:invalid').should("exist")
  })

  it("should show error for password mismatch", () => {
    cy.visit("/auth/signup")
    cy.get('input[name="name"]').type("Test User")
    cy.get('input[name="email"]').type("test@example.com")
    cy.get('input[name="password"]').type("password123")
    cy.get('input[name="confirmPassword"]').type("password456")
    cy.get("form").submit()
    cy.get('[role="alert"]').should("contain", "Passwords do not match")
  })

  it("should successfully signup with valid data", () => {
    cy.visit("/auth/signup")
    cy.get('input[name="name"]').type("Test User")
    cy.get('input[name="email"]').type("test@example.com")
    cy.get('input[name="password"]').type("password123")
    cy.get('input[name="confirmPassword"]').type("password123")
    cy.get("form").submit()
    cy.url().should("include", "/chat")
  })

  it("should successfully login with valid credentials", () => {
    // First create a user
    cy.visit("/auth/signup")
    cy.get('input[name="name"]').type("Test User")
    cy.get('input[name="email"]').type("login@example.com")
    cy.get('input[name="password"]').type("password123")
    cy.get('input[name="confirmPassword"]').type("password123")
    cy.get("form").submit()

    // Logout
    cy.get('[data-cy="logout-btn"]').click()

    // Login
    cy.visit("/auth/login")
    cy.get('input[name="email"]').type("login@example.com")
    cy.get('input[name="password"]').type("password123")
    cy.get("form").submit()
    cy.url().should("include", "/chat")
  })
})
