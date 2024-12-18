describe("CompleteE2E: Travel List", () => {
  let visitedCountries = [];
  let wantedCountries = [];

  beforeEach(() => {
    // Logga in
    cy.visit("/");
    cy.get("#loginEmail").type("test@example.com");
    cy.get("#loginPassword").type("test");
    cy.get("#login").click();

    cy.wait(2000);

    cy.request("GET", "/api/travellist/1").then((response) => {
      expect(response.status).to.eq(200);
      visitedCountries = response.body.visited;
      wantedCountries = response.body.wanted;
    });
  });

  it("verifies that visited and wanted countries are fetched correctly from the BACKEND", () => {
    // Verify visited countries
    visitedCountries.forEach((country) => {
      cy.contains(".list-group-item", country).should("exist");
    });

    // Verify wanted countries
    wantedCountries.forEach((country) => {
      cy.contains(".list-group-item", country).should("exist");
    });
  });

  it("verifies deleting a country updates the FRONTEND", () => {
    // Deleting from visited list
    const countryToDeleteVisited = visitedCountries[0];
    cy.contains(".list-group-item", countryToDeleteVisited).within(() => {
      cy.get("span").find("svg").click();
    });

    cy.contains(".list-group-item", countryToDeleteVisited).should("not.exist");

    // Deleting from wanted list
    const countryToDeleteWanted = wantedCountries[0];
    cy.contains(".list-group-item", countryToDeleteWanted).within(() => {
      cy.get("span").find("svg").click();
    });

    cy.contains(".list-group-item", countryToDeleteWanted).should("not.exist");
  });

  it("verifies the backend DATABASE updates correctly after deleting a country", () => {
    // Deleting from visited list
    const countryToDeleteVisited = visitedCountries[0];
    cy.request("DELETE", "/api/travellist", {
      country_name: countryToDeleteVisited,
    }).then((response) => {
      expect(response.status).to.eq(204);
    });

    cy.request("GET", "/api/travellist/1").then((response) => {
      expect(response.status).to.eq(200);
      const updatedVisited = response.body.visited;
      expect(updatedVisited).not.to.include(countryToDeleteVisited);
    });

    // Deleting from wanted list
    const countryToDeleteWanted = wantedCountries[0];
    cy.request("DELETE", "/api/travellist", {
      country_name: countryToDeleteWanted,
    }).then((response) => {
      expect(response.status).to.eq(204);
    });

    cy.request("GET", "/api/travellist/1").then((response) => {
      expect(response.status).to.eq(200);
      const updatedWanted = response.body.wanted;
      expect(updatedWanted).not.to.include(countryToDeleteWanted);
    });
  });
});
