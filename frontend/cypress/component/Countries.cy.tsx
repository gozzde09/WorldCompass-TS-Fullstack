import Countries from "../../components/Countries";

describe("Countries", () => {
  it("should render the title and countries list", () => {
    cy.mount(<Countries />);

    // Verifiera att rubriken finns och är korrekt
    cy.contains("h2", "Countries List").should("be.visible");

    // Verifiera att listan innehåller rätt länder
    cy.get("ul").within(() => {
      cy.get("li").should("have.length", 3);
      cy.contains("li", "Italien");
      cy.contains("li", "Turkiet");
      cy.contains("li", "Sverige");
    });
  });
  // GET
  it("fetches the list of users correctly", () => {
    cy.request("GET", "/api/users").then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.length.greaterThan(0);
    });
  });
});
