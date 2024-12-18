describe("Homepage", () => {
  beforeEach(() => {
    cy.visit("/home");
  });

  it("should load the homepage with key components", () => {
    cy.get("nav").should("be.visible");
    cy.get("#map").should("be.visible");
    cy.get(".travel-list").should("be.visible");
    cy.get("footer").should("be.visible");
    cy.get("#welcome").contains("Welcome,").should("be.visible");
  });
});
