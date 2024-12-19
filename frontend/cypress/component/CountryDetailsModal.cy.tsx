import CountryDetailsModal from "../../src/components/CountryDetailsModal";

describe("CountryDetailsModal", () => {
  const countryDetailsMock = {
    country_name: "Sweden",
    country_description:
      "Sweden, formally the Kingdom of Sweden, is a Nordic country located on the Scandinavian Peninsula in Northern Europe. It borders Norway to the west and north, and Finland to the east.\nAt 450,295 square kilometres (173,860 sq mi), Sweden is the largest Nordic country and the fifth-largest country in Europe. Its capital and largest city is Stockholm. Sweden has a population of 10.6 million, and a low population density of 25.5 inhabitants per square kilometre (66/sq mi); 88% of Swedes reside in urban areas. They are mostly in the central and southern half of the country. Sweden's urban areas together cover 1.5% of its land area. Sweden has a diverse climate owing to the length of the country, which ranges from 55°N to 69°N.",
    country_capital: "Stockholm",
    country_population: 10353442,
    country_continent: "Europe",
    country_language: "Swedish",
    country_currency: "Swedish krona (kr)",
    country_flag: "https://flagcdn.com/se.svg",
  };
  beforeEach(() => {
    const mockOnCancel = cy.stub().as("onCancel");
    const mockOnUpdate = cy.stub().as("onUpdate");
    cy.mount(
      <CountryDetailsModal
        show={true}
        countryName='Sweden'
        onCancel={mockOnCancel}
        onUpdate={mockOnUpdate}
      />
    );
  });

  it("should display the country details in the modal", () => {
    // Header
    cy.get(".modal-title").should("contain.text", "Sweden");
    cy.get(".modal-header")
      .find("img")
      .should("have.attr", "src", countryDetailsMock.country_flag);
    //Karusel
    cy.get(".carousel").should("be.visible");
    // Country details
    cy.get(".modal-body").within(() => {
      cy.get("p").should(
        "contain.text",
        countryDetailsMock.country_description
      );
      cy.get("p").should("contain.text", countryDetailsMock.country_capital);
      cy.get("p").should(
        "contain.text",
        countryDetailsMock.country_population.toLocaleString()
      );
      cy.get("p").should("contain.text", countryDetailsMock.country_continent);
      cy.get("p").should("contain.text", countryDetailsMock.country_language);
      cy.get("p").should("contain.text", countryDetailsMock.country_currency);
    });
  });

  it("should call onCancel when 'Cancel' button is clicked", () => {
    cy.get("button").contains("Cancel").click();
    cy.get("@onCancel").should("have.been.calledOnce");
  });
});
