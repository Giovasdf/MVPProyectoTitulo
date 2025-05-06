describe('Login As User', () => {
    it('debería ingresar correctamente con credenciales válidas', () => {
      cy.visit('http://localhost:5173/login')
      cy.screenshot('01-pantalla-login-inicial')
      cy.get('input[name=email]').type('thalitacmartins@gmail.com')
      cy.get('input[name=password]').type('thalita123')
      cy.screenshot('02-credenciales-ingresadas')
      cy.get('button[type=submit]').click()
      cy.url().should('include', '/dashboard')
      cy.screenshot('03-redireccion-dashboard')
    })
  })
  