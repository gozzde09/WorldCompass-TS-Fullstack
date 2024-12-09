import { Country } from "../../src/types/interfaces";

describe("Users API Tests", () => {
  it("fetches all users from the database", () => {
    cy.request("GET", "/api/users").then((response) => {
      expect(response.status).to.eq(200); // Response OK
      expect(response.body).to.be.an("array");
    });
  });

  it("adds a new user to the database", () => {
    const uniqueEmail = `testuser${Date.now()}@example.com`;
    cy.request({
      method: "POST",
      url: "http://localhost/api/users",
      body: {
        first_name: "Test",
        last_name: "User",
        email: uniqueEmail,
        password: "password123",
      },
      failOnStatusCode: false,
    }).then((response) => {
      if (
        response.status === 400 &&
        response.body.error === "Email already exists"
      ) {
        cy.log("Email already exists");
      } else {
        expect(response.status).to.eq(201);
      }
    });
  });
});

describe("Countries API Tests", () => {
  it("fetches all countries from the database", () => {
    cy.request("GET", "/api/countries").then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("array");
    });
  });
  it("adds a new country to the database", () => {
    const uniqueCountryName = `Testland${Date.now()}`;
    const newCountry: Country = {
      country_name: uniqueCountryName,
      country_description: "A fictional country for testing.",
      country_capital: "Test City",
      country_population: 12345,
      country_continent: "Test Continent",
      country_language: "Test Language",
      country_currency: "Test Currency",
      country_flag: "http://example.com/flag.png",
    };

    cy.request("POST", "/api/countries", newCountry).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property(
        "country_name",
        newCountry.country_name
      );
    });
  });

  it("fetches details of a specific country", () => {
    const uniqueCountryName = `Testland${Date.now()}`;
    const newCountry: Country = {
      country_name: uniqueCountryName,
      country_description: "A fictional country for testing.",
      country_capital: "Test City",
      country_population: 12345,
      country_continent: "Test Continent",
      country_language: "Test Language",
      country_currency: "Test Currency",
      country_flag: "http://example.com/flag.png",
    };

    cy.request("POST", "/api/countries", newCountry).then(() => {
      cy.request("GET", `/api/countries/${uniqueCountryName}`).then(
        (response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property(
            "country_name",
            uniqueCountryName
          );
        }
      );
    });
  });
});

describe("Travel List API Tests", () => {}); //TODO

describe("Visit Status API Tests", () => {
  it("fetches all visit statuses from the database", () => {
    cy.request("GET", "/api/visitstatus").then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("array");
    });
  });
});
