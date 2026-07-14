describe('Listar Produtos', () => {
  beforeEach(() => {
    cy.fixture('usuario').then((usuario) => {
      cy.login(usuario.email, usuario.password)
    })
  })

  it('Listar todos os produtos já cadastrados', () => {
    cy.get('a[data-testid="listar-produtos"]').click()
    cy.url().should('include', '/admin/listarprodutos')
    cy.contains('Produto de Teste').should('be.visible')
  })
})
