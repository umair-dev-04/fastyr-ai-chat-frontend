// Import commands.js using ES2015 syntax:
import "./commands"

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Add custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>
      signup(name: string, email: string, password: string): Chainable<void>
    }
  }
}
