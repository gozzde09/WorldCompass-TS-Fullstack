import { User } from "../../src/types/interfaces";

describe("CompleteE2E: Login form", () => {
  const validUser: User = {
    first_name: "Test",
    last_name: "Testson",
    email: "test@example.com",
    password: "test",
  };

  beforeEach(() => {
    cy.visit("/");
    cy.get("#loginEmail").type(validUser.email);
    cy.get("#loginPassword").type(validUser.password);
    cy.get("#login").click();
  });

  //Backend
  it("verifies login request works on the BACKEND", () => {
    cy.request("POST", "/api/login", validUser).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("user");
      expect(response.body.user.email).to.equal(validUser.email);
    });
  });

  //Database
  it("verifies login is successfull and the user exists in the DATABASE", () => {
    cy.request("GET", "/api/users").then((response) => {
      expect(response.status).to.eq(200);
      const users = response.body;
      const user = users?.find((u: User) => u.email === validUser.email);

      expect(user).to.exist;
      expect(user.last_name).to.equal(validUser.last_name);
    });
  });

  // Loggade användare rörelser i frontend
  it("verifies the user redirects to the homepage, sees welcome message and appears in te local storage", () => {
    cy.wait(2500);
    cy.url().should("include", "/home");

    //Välkommen meddelande
    const firstName = validUser.first_name;
    cy.get("#welcome").should("contain", `Welcome,${firstName}!`);

    // Användare sparades i localStorage
    cy.window().then(() => {
      const storedUserString = localStorage.getItem("user");

      const storedUser = storedUserString ? JSON.parse(storedUserString) : null;
      expect(storedUser).to.exist;

      expect(storedUser.userId).to.equal(1);
      expect(storedUser.userName).to.equal(validUser.first_name);
    });
  });
});
