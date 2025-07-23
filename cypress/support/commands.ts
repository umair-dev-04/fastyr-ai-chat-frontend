import { Cypress, cy } from "cypress"

// Custom commands for authentication
Cypress.Commands.add("login", (email: string, password: string) => {
  cy.visit("/auth/login")
  cy.get('input[name="email"]').type(email)
  cy.get('input[name="password"]').type(password)
  cy.get("form").submit()
  cy.url().should("include", "/chat")
})

Cypress.Commands.add("signup", (name: string, email: string, password: string) => {
  cy.visit("/auth/signup")
  cy.get('input[name="name"]').type(name)
  cy.get('input[name="email"]').type(email)
  cy.get('input[name="password"]').type(password)
  cy.get('input[name="confirmPassword"]').type(password)
  cy.get("form").submit()
  cy.url().should("include", "/chat")
})
