describe("Gestión de Sucursales", () => {
  const nuevaSucursal = "Calle Principal 123, Ciudad Test";

  before(() => {
    cy.loginAsAdmin();
    cy.url().should("include", "/dashboard");
  });

  it("Permite agregar una nueva sucursal", () => {
    cy.contains("Sucursales").click();

    cy.intercept("GET", "**/api/collections/sucursales/records*").as(
      "getSucursales"
    );
    cy.wait("@getSucursales");
    cy.screenshot("01-listado-inicial-sucursales");
    cy.get(".sucursal-form").should("exist");

    cy.intercept("POST", "**/api/collections/sucursales/records*").as(
      "createSucursal"
    );

    cy.get('.sucursal-form input[placeholder="Dirección de la sucursal"]').type(
      nuevaSucursal
    );
    cy.screenshot("02-formulario-datos-ingresados");
    cy.get('.sucursal-form button[type="submit"]').click();

    cy.get(".swal2-confirm").click();

    cy.wait("@createSucursal").its("response.statusCode").should("eq", 200);

    cy.contains(".swal2-title", "¡Creado!").should("be.visible");
    cy.screenshot("03-alerta-exito-creacion");
    cy.wait("@getSucursales");

    cy.get(".sucursal-table tbody tr")
      .contains("td", nuevaSucursal)
      .should("exist");
  });

  it("Valida el formulario de sucursal", () => {
    cy.loginAsAdmin();
    cy.url().should("include", "/dashboard");
    cy.contains("Sucursales").click();
    cy.intercept("GET", "**/api/collections/sucursales/records*").as(
      "getSucursales"
    );

    cy.get(".sucursal-form").should("exist");

    cy.intercept("POST", "**/api/collections/sucursales/records*").as(
      "createSucursal"
    );


    cy.get('.sucursal-form button[type="submit"]').click();
    cy.screenshot("04-validacion-formulario-vacio");
    cy.get(".sucursal-form input:invalid").should("exist");

    cy.get("@createSucursal.all").should("have.length", 0);
  });

  it("Permite editar una sucursal existente", () => {
    cy.loginAsAdmin();
    cy.url().should("include", "/dashboard");
    cy.contains("Sucursales").click();
    cy.intercept("GET", "**/api/collections/sucursales/records*").as(
      "getSucursales"
    );

    cy.get(".sucursal-form").should("exist");

    cy.intercept("POST", "**/api/collections/sucursales/records*").as(
      "createSucursal"
    );

    cy.get(".sucursal-table tbody tr").first().as("primeraSucursal");

    cy.get("@primeraSucursal")
      .find("td:nth-child(2)")
      .invoke("text")
      .as("direccionOriginal");

    cy.get("@primeraSucursal").find(".btn-edit").click();
    cy.screenshot("05-formulario-en-modo-edicion");
    cy.get('.sucursal-form button[type="submit"]').should(
      "contain",
      "Actualizar"
    );

    cy.intercept("PATCH", "**/api/collections/sucursales/records/*").as(
      "updateSucursal"
    );

    const nuevaDireccion = "Dirección editada " + Date.now();
    cy.get(".sucursal-form input").clear().type(nuevaDireccion);

    cy.get('.sucursal-form button[type="submit"]').click();

    cy.get(".swal2-confirm").click();
    cy.screenshot("06-alerta-exito-actualizacion");
    cy.wait("@updateSucursal").its("response.statusCode").should("eq", 200);

    cy.contains(".swal2-title", "¡Actualizado!").should("be.visible");

    cy.get(".sucursal-table tbody tr").first().contains("td", nuevaDireccion);
  });

  it("Permite cancelar la edición", () => {
    cy.loginAsAdmin();
    cy.url().should("include", "/dashboard");
    cy.contains("Sucursales").click();
    cy.intercept("GET", "**/api/collections/sucursales/records*").as(
      "getSucursales"
    );
    cy.wait("@getSucursales");

    cy.get(".sucursal-form").should("exist");

    cy.intercept("POST", "**/api/collections/sucursales/records*").as(
      "createSucursal"
    );

    cy.get(".sucursal-table tbody tr").first().find(".btn-edit").click();

    cy.get('.sucursal-form button[type="submit"]').should(
      "contain",
      "Actualizar"
    );

    cy.get('.sucursal-form button[type="button"]').click();

    cy.get('.sucursal-form button[type="submit"]').should("contain", "Agregar");
    cy.screenshot("07-formulario-reseteado-tras-cancelar");
    cy.get(".sucursal-form input").should("have.value", "");
  });
});
