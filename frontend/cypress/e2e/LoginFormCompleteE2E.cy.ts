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
  it("verifies login request on the BACKEND; logined user exists in the response", () => {
    cy.request("POST", "/api/login", validUser).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("user");
      expect(response.body.user.email).to.equal(validUser.email);
    });
  });

  // Database
  it("verifies the user exists in the DATABASE", () => {
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

    // Användare sparades i localStorage
    cy.window().then(() => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      console.log(storedUser);
      expect(localStorage.getItem(storedUser)).to.exist;
      expect(localStorage.getItem(storedUser.userId)).equal("1");
      expect(localStorage.getItem(storedUser.userName)).to.equal(
        validUser.first_name
      );
    });
    //Välkommen meddelande
    const firstName = validUser.first_name;
    cy.get("#welcome").should("contain", `Welcome back,${firstName}!`);
  });
});
