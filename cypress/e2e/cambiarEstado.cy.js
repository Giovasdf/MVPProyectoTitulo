

describe('Cambio de estado de pedido', () => {
  before(() => {
    cy.loginAsAdmin();
    cy.url().should("include", "/dashboard");
  });

  it("Cambia el estado del primer pedido a Preparando", () => {
    
    cy.contains("Pedidos").click();
    cy.intercept('GET', '**/api/collections/pedidos/records*').as('fetchPedidos');
    cy.wait('@fetchPedidos');
    cy.screenshot('01-listado-pedidos-inicial');
    cy.get('[data-testid="lista-pedidos"] .pedido-card').first().as('primerPedido');
    
    
    cy.get('@primerPedido').find('.pedido-id').invoke('text').then((textoId) => {
      const pedidoId = textoId.replace('#', '').trim();
      cy.log(`ID del pedido seleccionado: ${pedidoId}`);
      
      
      cy.wrap(pedidoId).as('pedidoId');

      
      cy.get('@primerPedido').contains('button', 'Cambiar estado').click({ force: true });

      
      cy.get('[data-cy="modal-overlay"]', { timeout: 15000 }).should('be.visible');
      cy.screenshot('02-modal-cambio-estado-abierto');
      cy.get('[data-cy="modal-content"]').within(() => {
        
        cy.intercept('PATCH', `**/api/collections/pedidos/records/${pedidoId}`).as('updateStatus');
        
        cy.get('[data-cy="select-estado"]').select('preparando', { force: true });
        cy.screenshot('03-estado-seleccionado-preparando');
        cy.get('[data-cy="btn-guardar"]').click({ force: true });
      });

      
      cy.wait('@updateStatus', { timeout: 10000 }).its('response.statusCode').should('eq', 200);
      cy.on('fail', (error) => {
        cy.screenshot('error-fallo-actualizacion-estado');
        throw error;
      });
      
      cy.get('@pedidoId').then((id) => {
        cy.contains('.pedido-id', `#${id}`, { timeout: 10000 })
          .should('exist')
          .parents('.pedido-card')
          .within(() => {
            cy.get('.pedido-estado', { timeout: 10000 })
              .should(($estado) => {
                const texto = $estado.text().trim().toLowerCase();
                expect(texto).to.equal('preparando');
              });
          });
      });

      cy.screenshot('04-estado-actualizado-en-tarjeta');
    });
  });
});