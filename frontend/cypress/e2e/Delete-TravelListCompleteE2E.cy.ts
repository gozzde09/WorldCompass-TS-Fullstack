describe("CompleteE2E: Travel List with Fixture Data", () => {
  let visitedCountries = [];
  let wantedCountries = [];

  beforeEach(() => {
    // Logga in
    cy.visit("/");
    cy.get("#loginEmail").type("test@example.com");
    cy.get("#loginPassword").type("test");
    cy.get("#login").click();

    cy.wait(2000);

    // fixture data
    cy.request("GET", "/api/travellist/1").then((response) => {
      expect(response.status).to.eq(200);
      visitedCountries = response.body.visited;
      wantedCountries = response.body.wanted;
    });
  });

  it("verifies that visited and wanted countries are fetched correctly from the backend", () => {
    // Verify visited countries
    visitedCountries.forEach((country) => {
      cy.contains(country).should("exist");
    });

    // Verify wanted countries
    wantedCountries.forEach((country) => {
      cy.contains(country).should("exist");
    });
  });

  it("verifies deleting a country updates the frontend", () => {
    // Deleting from visited list
    const countryToDeleteVisited = visitedCountries[0];
    cy.contains("li", countryToDeleteVisited).within(() => {
      cy.get("button").click();
    });

    cy.contains(countryToDeleteVisited).should("not.exist");

    // Deleting from wanted list
    const countryToDeleteWanted = wantedCountries[0];
    cy.contains("li", countryToDeleteWanted).within(() => {
      cy.get("button").click();
    });

    cy.contains(countryToDeleteWanted).should("not.exist");
  });

  it("verifies the backend database updates correctly after deleting a country", () => {
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
