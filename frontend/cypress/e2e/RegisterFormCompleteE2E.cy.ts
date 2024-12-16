import { User } from "../../src/types/interfaces";

describe("CompleteE2E: Registration Form", () => {
  const generateUniqueEmail = () => `user${Date.now()}@example.com`;

  const newUser: User = {
    first_name: "John",
    last_name: "Doe",
    email: generateUniqueEmail(),
    password: "password123",
  };

  beforeEach(() => {
    cy.visit("/");

    cy.get(".flip-card-back")
      .invoke("css", "transform", "rotateY(0deg)")
      .should("be.visible");

    cy.get("#registerFirstName").type(newUser.first_name);
    cy.get("#registerLastName").type(newUser.last_name);
    cy.get("#registerEmail").type(newUser.email);
    cy.get("#registerPassword").type(newUser.password);
    cy.get("#register").click();
  });

  // Backend
  it("verifies the user registers on the BACKEND", () => {
    cy.request("POST", "/api/users", newUser).then((response) => {
      cy.log("Response Status:", response.status);
      cy.log("Response Body:", response.body);
      expect(response.status).to.eq(201);
      expect(response.body.user.first_name).to.equal(newUser.first_name);
    });
  });

  // Database
  it("verifies the user exists in the DATABASE", () => {
    cy.request("GET", "/api/users").then((response) => {
      expect(response.status).to.eq(200);
      const users = response.body;
      const user = users.find((u: User) => u.email === newUser.email);

      expect(user).to.exist;
      expect(user.first_name).to.equal(newUser.first_name);
      expect(user.last_name).to.equal(newUser.last_name);
    });
  });

  // Registrerade and loggade användare rörelser i frontend
  it("verifies the user redirects to the homepage, sees welcome message and appears in te local storage", () => {
    cy.url().should("include", "/home");

    const firstName = newUser.first_name;
    cy.get("#welcome").should("contain", `Welcome back, ${firstName}!`);

    // Användare sparades i localStorage
    cy.window().then(() => {
      const storedUser = JSON.parse(localStorage.getItem("user"));

      expect(localStorage.getItem(storedUser)).to.exist;
      expect(localStorage.getItem("userId")).to.match(/^\d+$/); // Nummer
      expect(localStorage.getItem(storedUser.userName)).to.equal(
        newUser.first_name
      );
    });
  });
});
