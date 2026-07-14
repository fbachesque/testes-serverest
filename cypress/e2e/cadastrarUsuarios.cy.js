describe('Cadastro de Usuários', () => {
  beforeEach(() => {
    cy.criarUsuarioELogar()
  })

  it('Não deve cadastrar um usuário administrador com o campo senha vazio', () => {
    const nomeUsuario = `Usuario de Teste ${String(Date.now()).slice(-6)}`
    const emailUsuario = `teste_${String(Date.now()).slice(-6)}@email.com`

    cy.get('a[data-testid="cadastrar-usuarios"]').click()

    cy.get('input[data-testid="nome"]').type(nomeUsuario)
    cy.get('input[data-testid="email"]').type(emailUsuario)
    cy.get('input[data-testid="checkbox"]').check()
    cy.get('button[data-testid="cadastrarUsuario"]').click()

    cy.url().should('include', '/admin/cadastrarusuarios')
    cy.contains('Password é obrigatório').should('be.visible')
  })
})
