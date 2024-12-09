import { User } from "../../src/types/interfaces";
import { Country } from "../../src/types/interfaces";

describe("Users API Tests", () => {
  it("fetches all users from the database", () => {
    cy.request("GET", "/api/users").then((response) => {
      expect(response.status).to.eq(200); // Response OK
      expect(response.body).to.be.an("array");
    });
  });

  it("adds a new user to the database", () => {
    const newUser: User = {
      first_name: "Test",
      last_name: "User",
      email: "newuser@example.com",
      password: "password123",
    };

    cy.request("POST", "/api/users", newUser).then((response) => {
      expect(response.status).to.eq(201); // Created
      expect(response.body).to.have.property("first_name", newUser.first_name);
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
    const newCountry: Country = {
      country_name: "Testland",
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
    cy.request("GET", "/api/countries/Testland").then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("country_name", "Testland");
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
