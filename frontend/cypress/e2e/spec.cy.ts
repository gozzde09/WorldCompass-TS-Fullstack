describe("template spec", () => {
  beforeEach(() => {
    //VISIT THE PAGE
    cy.visit("/");
  });
  it("fetches all the countries from the database", () => {
    cy.request("GET", "/api/countries").then((response) => {
      expect(response.status).to.eq(200); // response OK
      expect(response.body).to.be.an("array");
      expect(response.body).to.have.length.greaterThan(0);
    });
  });
});
