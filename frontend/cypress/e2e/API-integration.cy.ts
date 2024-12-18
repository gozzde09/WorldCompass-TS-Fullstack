import { User, TravelList } from "../../src/types/interfaces";
const generateUniqueEmail = () => `user${Date.now()}@example.com`;

//USERS
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
      expect(response.status).to.eq(201); // Created
      expect(response.body.user).to.have.property(
        "first_name",
        newUser.first_name
      );
    });
  });
});

//COUNTRIES
describe("Countries API Tests", () => {
  it("fetches details of a specific country", () => {
    cy.request("GET", "/api/countries/turkey").then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("country_name", "Turkey");
    });
  });
});

// TRAVEL-LIST
describe("Travel List API Tests", () => {
  it("adds a country to the travel list", () => {
    const travelListItem: TravelList = {
      country_id: 12, //Italy
      status_id: 1,
      user_id: 1,
    };
    cy.request("POST", "/api/travellist", travelListItem).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.message).to.eq(
        "Country added to travel list successfully"
      );
    });
  });
  it("fetches the travel list for a user", () => {
    cy.request(`GET`, `/api/travellist/3`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("visited");
      expect(response.body).to.have.property("wanted");
    });
  });
  it("updates a country's status in the travel list", () => {
    const updatedTravelListItem: TravelList = {
      country_id: 12,
      status_id: 2, // Update status to visited
      user_id: 1,
    };
    cy.request("POST", "/api/travellist", updatedTravelListItem).then(
      (response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq(
          "Country updated in travel list successfully"
        );
      }
    );
  });
  it("removes a country from the travel list", () => {
    cy.request("DELETE", "/api/travellist", {
      country_name: "Italy",
    }).then((response) => {
      expect(response.status).to.eq(204);
    });
  });
});
