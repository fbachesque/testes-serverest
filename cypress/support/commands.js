Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login')
  cy.get('#email').type(email)
  cy.get('#password').type(password)
  cy.get('button[data-testid="entrar"]').click()

  cy.url().should('include', '/home')
})
