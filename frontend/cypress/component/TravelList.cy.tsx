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
    cy.get("h5")
      .contains("Visited Countries")
      .next("ul")
      .within(() => {
        visitedCountries.forEach((country) => {
          cy.contains("li", country).should("exist");
        });
      });

    cy.get("h5")
      .contains("Wanted Countries")
      .next("ul")
      .within(() => {
        wantedCountries.forEach((country) => {
          cy.contains("li", country).should("exist");
        });
      });
  });

  it("should delete a visited country", () => {
    cy.contains("Visited Countries")
      .parent()
      .within(() => {
        cy.contains("li", "Germany").find("button").click();
      });

    cy.get("@deleteCountryStub").should(
      "have.been.calledWith",
      "Germany",
      "visited"
    );
  });

  it("should delete a wanted country", () => {
    cy.contains("Wanted Countries")
      .parent()
      .within(() => {
        cy.contains("li", "Canada").find("button").click();
      });

    cy.get("@deleteCountryStub").should(
      "have.been.calledWith",
      "Canada",
      "wanted"
    );
  });
});
