describe("CountryDetailsModal", () => {
  beforeEach(() => {
    // Logga in
    cy.visit("/");
    cy.get("#loginEmail").type("test@example.com");
    cy.get("#loginPassword").type("test");
    cy.get("#login").click();
    cy.wait(2000);
    cy.visit("/home");
  });

  it("should open the modal and display country details on the FRONTEND", () => {
    cy.get("path.leaflet-interactive").eq(12).click();
    cy.get(".modal-title").should("be.visible");
    cy.get(".modal-body").should("be.visible");
    cy.get("p").contains("Capital");
    cy.get("p").contains("Capital").should("be.visible");
    cy.get("p").contains("Population").should("be.visible");
    cy.get("p").contains("Continent").should("be.visible");
    cy.get("p").contains("Language").should("be.visible");
    cy.get("p").contains("Currency").should("be.visible");

    cy.get("button").contains("Visited").scrollIntoView().should("be.visible");
    cy.get("button")
      .contains("Want to Visit")
      .scrollIntoView()
      .should("be.visible");
    cy.get("button").contains("Cancel").scrollIntoView().should("be.visible");
  });

  it('should set visit status to "Visited" via the BACKEND and display on the FRONTEND', () => {
    cy.get("path.leaflet-interactive").eq(12).click(); //Belgium
    cy.get("button").contains("Visited").click();
    cy.contains("Belgium").should("be.visible");
  });
  //Backend Database
  it("should exist in the correct list in the DATABASE", () => {
    cy.request(`GET`, `/api/travellist/1`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("visited"); //Belgium
      expect(response.body.visited).to.include("Belgium");
    });
  });

  it('should set visit status to "Want to Visit" via the BACKEND and and display on the FRONTEND', () => {
    cy.get("path.leaflet-interactive").eq(0).click(); //Afghanistan
    cy.get("button").contains("Want to Visit").click();
    cy.contains("Afghanistan").should("be.visible");
  });

  //Backend Database
  it("should exist in the correct list in the DATABASE", () => {
    cy.request(`GET`, `/api/travellist/1`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("wanted");
      expect(response.body.wanted).to.include("Afghanistan");
    });
  });

  it('should change visit status from "Visit" to "Want to Visit"', () => {
    cy.get("path.leaflet-interactive").eq(11).click(); //Burundi
    cy.get("button").contains("Visited").click();

    //Backend Database visited
    cy.request(`GET`, `/api/travellist/1`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("visited");
      expect(response.body.visited).to.include("Burundi");
    });
    cy.get("path.leaflet-interactive").eq(11).click();
    cy.get("button").contains("Want to Visit").click();

    //Backend Database wanted
    cy.request(`GET`, `/api/travellist/1`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("wanted");
      expect(response.body.wanted).to.include("Burundi");
    });
  });
  it("should close the modal on cancel", () => {
    cy.get("path.leaflet-interactive").eq(11).click();
    cy.get("button").contains("Cancel").click();
    cy.get(".modal").should("not.exist");
  });
});
