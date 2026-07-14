const API = 'https://serverest.dev'

Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login')
  cy.get('#email').type(email)
  cy.get('#password').type(password)
  cy.get('button[data-testid="entrar"]').click()

  cy.url().should('include', '/home')
})


Cypress.Commands.add('criarUsuarioELogar', () => {
  const email = `qa.${Date.now()}@teste.com`
  const password = 'senha123'

  cy.request('POST', `${API}/usuarios`, {
    nome: 'Usuário QA',
    email: email,
    password: password,
    administrador: 'true',
  }).then((res) => {
    expect(res.status).to.eq(201)
    cy.login(email, password)
  })
})
