import TravelList from "../../src/components/TravelList";

describe("Travel Lists", () => {
  const visitedCountries = ["France", "Germany", "Japan"];
  const wantedCountries = ["Canada", "Brazil"];
  let handleDeleteCountry: () => void;

  beforeEach(() => {
    handleDeleteCountry = cy.stub().as("deleteCountryStub");
    cy.mount(
      <TravelList
        visitedCountries={visitedCountries}
        wantedCountries={wantedCountries}
        handleDeleteCountry={handleDeleteCountry}
      />
    );
  });

  it("should display visited and wanted countries", () => {
    //Visited
    cy.get("h5")
      .contains("You have visited:")
      .next(".list-group")
      .within(() => {
        visitedCountries.forEach((country) => {
          cy.contains(".list-group-item", country).should("exist");
        });
      });

    //Want
    cy.get("h5")
      .contains("You want to visit:")
      .next(".list-group")
      .within(() => {
        wantedCountries.forEach((country) => {
          cy.contains(".list-group-item", country).should("exist");
        });
      });
  });

  it("should delete a visited country", () => {
    cy.contains("You have visited:")
      .parent()
      .within(() => {
        cy.contains(".list-group-item", "Germany")
          .find("span")
          .find("svg")
          .click();
      });

    cy.get("@deleteCountryStub").should(
      "have.been.calledWith",
      "Germany",
      "visited"
    );
  });

  it("should delete a wanted country", () => {
    cy.contains("You want to visit:")
      .parent()
      .within(() => {
        cy.contains(".list-group-item", "Canada")
          .find("span")
          .find("svg")
          .click();
      });

    cy.get("@deleteCountryStub").should(
      "have.been.calledWith",
      "Canada",
      "wanted"
    );
  });
});
