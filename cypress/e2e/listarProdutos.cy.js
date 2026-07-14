describe('Listar Produtos', () => {
  beforeEach(() => {
    cy.criarUsuarioELogar()
  })

  it('Listar todos os produtos já cadastrados', () => {
    cy.get('a[data-testid="listar-produtos"]').click()
    cy.url().should('include', '/admin/listarprodutos')
    cy.contains('Produto de Teste').should('be.visible')
  })
})
