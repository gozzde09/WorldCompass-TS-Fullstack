describe("Login-Register Page", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should show the LOGIN form by default", () => {
    cy.get(".flip-card-front").should("be.visible");
    cy.get(".flip-card-back").should("not.be.visible");
  });

  it("should flip to the REGISTER form when 'No account? Click to register' is clicked", () => {
    cy.get(".flip-button").contains("No account? Click to register").click();
    cy.get(".flip-card-back").should("be.visible");
    cy.get(".flip-card-front").should("not.be.visible");
  });
});
