const API = 'https://serverest.dev'

describe('API ServeRest', () => {
 
  const email = `qa.${Date.now()}@teste.com`
  const senha = 'senha123'

  it('Fluxo completo: cria usuário, autentica, cadastra produto, monta carrinho e conclui a compra', () => {
    
    cy.request('POST', `${API}/usuarios`, {
      nome: 'Usuário QA',
      email: email,
      password: senha,
      administrador: 'true',
    }).then((res) => {
      expect(res.status).to.eq(201)
      expect(res.body.message).to.eq('Cadastro realizado com sucesso')
      expect(res.body._id).to.be.a('string')
    })

    
    cy.request('POST', `${API}/login`, {
      email: email,
      password: senha,
    }).then((login) => {
      expect(login.status).to.eq(200)
      expect(login.body.message).to.eq('Login realizado com sucesso')
      const token = login.body.authorization

      
      const nomeProduto = `Produto QA ${Date.now()}`
      cy.request({
        method: 'POST',
        url: `${API}/produtos`,
        headers: { authorization: token },
        body: {
          nome: nomeProduto,
          preco: 300,
          descricao: 'Produto criado via teste de API',
          quantidade: 30,
        },
      }).then((produto) => {
        expect(produto.status).to.eq(201)
        expect(produto.body.message).to.eq('Cadastro realizado com sucesso')
        const idProduto = produto.body._id

        
        cy.request({
          method: 'POST',
          url: `${API}/carrinhos`,
          headers: { authorization: token },
          body: {
            produtos: [{ idProduto: idProduto, quantidade: 2 }],
          },
        }).then((carrinho) => {
          expect(carrinho.status).to.eq(201)
          expect(carrinho.body.message).to.eq('Cadastro realizado com sucesso')
        })

        
        cy.request({
          method: 'DELETE',
          url: `${API}/carrinhos/concluir-compra`,
          headers: { authorization: token },
        }).then((compra) => {
          expect(compra.status).to.eq(200)
          expect(compra.body.message).to.eq('Registro excluído com sucesso')
        })
      })
    })
  })

  it('Autenticação e autorização: recusa login inválido e bloqueia cadastro de produto sem token válido', () => {
    
    cy.request({
      method: 'POST',
      url: `${API}/login`,
      failOnStatusCode: false,
      body: { email: email, password: 'senhaErrada' },
    }).then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body.message).to.eq('Email e/ou senha inválidos')
    })

    
    cy.request({
      method: 'POST',
      url: `${API}/produtos`,
      failOnStatusCode: false,
      body: {
        nome: `Produto Sem Token ${Date.now()}`,
        preco: 100,
        descricao: 'Não deveria ser criado',
        quantidade: 5,
      },
    }).then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body.message).to.eq(
        'Token de acesso ausente, inválido, expirado ou usuário do token não existe mais'
      )
    })

    
    cy.request({
      method: 'POST',
      url: `${API}/produtos`,
      failOnStatusCode: false,
      headers: { authorization: 'Bearer token_invalido' },
      body: {
        nome: `Produto Token Inválido ${Date.now()}`,
        preco: 100,
        descricao: 'Não deveria ser criado',
        quantidade: 5,
      },
    }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })

  it('Validação de dados: bloqueia e-mail duplicado e produto com corpo inválido', () => {
    
    cy.request({
      method: 'POST',
      url: `${API}/usuarios`,
      failOnStatusCode: false,
      body: {
        nome: 'Usuário Duplicado',
        email: email,
        password: senha,
        administrador: 'true',
      },
    }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body.message).to.eq('Este email já está sendo usado')
    })

    
    cy.request('POST', `${API}/login`, {
      email: email,
      password: senha,
    }).then((login) => {
      const token = login.body.authorization

      
      cy.request({
        method: 'POST',
        url: `${API}/produtos`,
        failOnStatusCode: false,
        headers: { authorization: token },
        body: {
          nome: '',
          preco: 'não é número',
        },
      }).then((res) => {
        expect(res.status).to.eq(400)
        
        expect(res.body).to.have.property('preco')
      })
    })
  })
})
