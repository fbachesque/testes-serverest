describe('Cadastro de Produtos', () => {
  beforeEach(() => {
    cy.fixture('usuario').then((usuario) => {
      cy.login(usuario.email, usuario.password)
    })
  })

  it('Cadastrar um novo produto com sucesso', () => {
    const nomeProduto = `Produto de Teste ${String(Date.now()).slice(-6)}`
    const preco = Math.floor(Math.random() * (500 - 100 + 1)) + 100
    const quantidade = Math.floor(Math.random() * (100 - 10 + 1)) + 10
    const descricao = `Descrição do Produto de Teste ${String(Date.now()).slice(-6)}`

    cy.get('a[data-testid="cadastrar-produtos"]').click()

    cy.get('input[data-testid="nome"]').type(nomeProduto)
    cy.get('input[data-testid="preco"]').type(String(preco))
    cy.get('textarea[data-testid="descricao"]').type(String(descricao))
    cy.get('input[data-testid="quantity"]').type(String(quantidade))
    cy.get('button[data-testid="cadastarProdutos"]').click()

    cy.url().should('include', '/admin/listarprodutos')
    cy.contains(nomeProduto).should('be.visible')
  })
})
