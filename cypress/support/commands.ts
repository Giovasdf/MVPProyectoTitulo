Cypress.Commands.add("loginAsAdmin", () => {
  cy.visit("http://localhost:5173/login");
  cy.get("input[name=email]").type("gmolina.dev@gmail.com");
  cy.get("input[name=password]").type("giovanni123.");
  cy.get("button[type=submit]").click();
  cy.url().should("include", "/dashboard");
});

Cypress.Commands.add("logout", () => {
  cy.get('[data-cy="user-menu"]').click();
  cy.get('[data-cy="logout-button"]').click();
});

Cypress.Commands.add("navigateToSucursales", () => {
  cy.get("body").then(($body) => {
    cy.url().then((url) => {
      if (!url.includes("/sucursales")) {
        const sucursalesLink = $body.find('a:contains("Sucursales")');

        if (sucursalesLink.length === 0) {
          const toggleButton = $body.find('[data-cy="menu-toggle"]');
          if (toggleButton.length > 0) {
            cy.get('[data-cy="menu-toggle"]').click();
          }
        }

        cy.contains("a", /sucursales/i, { matchCase: false, timeout: 15000 })
          .should("be.visible")
          .click();

        cy.url().should("include", "/sucursales");
        cy.contains("h2", "Gestión de Sucursales", { timeout: 10000 }).should(
          "be.visible"
        );
      }
    });
  });
});

Cypress.Commands.add("confirmActionInModal", () => {
  cy.get(".swal2-confirm", { timeout: 10000 }).click();
});

Cypress.Commands.add("verifySuccessMessage", (message) => {
  cy.contains(".swal2-title", message, { timeout: 10000 }).should("be.visible");
});
