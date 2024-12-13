import { User } from "../../src/types/interfaces";
const generateUniqueEmail = () => `user${Date.now()}@example.com`;
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
      email: generateUniqueEmail(),
      password: "password123",
    };
    cy.request("POST", "/api/users", newUser).then((response) => {
      console.log(response);
      expect(response.status).to.eq(201); // Created
      expect(response.body.user).to.have.property(
        "first_name",
        newUser.first_name
      );
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
  it("fetches details of a specific country", () => {
    cy.request("GET", "/api/countries/turkey").then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("country_name", "Turkey");
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
